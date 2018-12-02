var truffleAssert = require('truffle-assertions');

var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow');
var Paper = artifacts.require('Paper');

contract('PeerReviewWorkflowTest', function() {
    it("should has a workflow name", function () {
        var workflow;
        return PeerReviewWorkflow.deployed().then(function (instance) {
            return instance.name.call();
        }).then(function(name) {
            assert.strictEqual(name, 'Peer Review', 'Workflow name does not match')
        });
    });

    it("should initialize states", function () {
        var workflow;
        return PeerReviewWorkflow.deployed().then(function (instance) {
            workflow = instance;
            return workflow.getStatesCount.call();
        }).then(function (count) {
            assert.strictEqual(parseInt(count, 10), 4, 'States count does not match');
            return workflow.getState.call(0);
        }).then(function (state) {
            assert.strictEqual(state, 'Submitted', 'Submitted state does not exists');
            return workflow.getState.call(1);
        }).then(function (state) {
            assert.strictEqual(state, 'OnReview', 'OnReview state does not exists');
            return workflow.getState.call(2);
        }).then(function (state) {
            assert.strictEqual(state, 'Published', 'Published state does not exists');
            return workflow.getState.call(3);
        }).then(function (state) {
            assert.strictEqual(state, 'Rejected', 'Rejected state does not exists');
        });
    });

    it("should initialize transitions", function () {
        var workflow;
        return PeerReviewWorkflow.deployed().then(function (instance) {
            workflow = instance;
            return workflow.getTransitionsCount.call();
        }).then(function (count) {
            assert.strictEqual(parseInt(count, 10), 5, 'Transitions count does not match');
            return workflow.getTransition.call(0);
        }).then(function (transition) {
            assert.strictEqual(transition[0], 'Submit', 'Submit transition does not exists');
            return workflow.getTransition.call(1);
        }).then(function (transition) {
            assert.strictEqual(transition[0], 'Review', 'Review transition does not exists');
            return workflow.getTransition.call(2);
        }).then(function (transition) {
            assert.strictEqual(transition[0], 'Accept', 'Accept transition does not exists');
            return workflow.getTransition.call(3);
        }).then(function (transition) {
            assert.strictEqual(transition[0], 'Publish', 'Publish transition does not exists');
            return workflow.getTransition.call(4);
        }).then(function (transition) {
            assert.strictEqual(transition[0], 'Reject', 'Reject transition does not exists');
        });
    });

    var asset;
    beforeEach(function() {
        return Paper.new()
            .then(function(instance) {
                asset = instance;
            });
    });

    it("should run transitions from Submit to Publish", function () {
        var workflow;
        return PeerReviewWorkflow.deployed().then(function (instance) {
            workflow = instance;
            return workflow.submit(asset.address);
        }).then(function (submitTx) {
            truffleAssert.eventEmitted(submitTx, 'AssetStateChanged', function (e) {
                return e.assetAddress === asset.address && e.state === 'Submitted';
            });
            return workflow.findAssetsByState.call('Submitted');
        }).then(function (assetArray){
            assert.strictEqual(assetArray.length, 1, 'Assets on state Submitted must be 1');
            return workflow.review(asset.address, 'This is a comment for Review');
        }).then(function (reviewTx) {
            truffleAssert.eventEmitted(reviewTx, 'AssetStateChanged', function (e) {
                return e.assetAddress === asset.address && e.state === 'OnReview';
            });
            return Promise.all([
                workflow.findAssetsByState.call('Submitted'),
                workflow.findAssetsByState.call('OnReview')
            ]);
        }).then(function(assetArraysByState){
            assert.strictEqual(assetArraysByState[0].length, 0, 'Assets on state Submitted must be 0');
            assert.strictEqual(assetArraysByState[1].length, 1, 'Assets on state OnReview must be 1');
            return workflow.accept(asset.address, 'First comment on Accept'); // First time accept
        }).then(function(acceptTx){
            truffleAssert.eventNotEmitted(acceptTx, 'AssetStateChanged');
            return Promise.all([
                workflow.findAssetsByState.call('Published'),
                workflow.findAssetsByState.call('OnReview'),
                workflow.getAcceptedCount.call(asset.address)
            ]);
        }).then(function(values) {
            assert.strictEqual(values[0].length, 0, 'Assets on state Published must be 0');
            assert.strictEqual(values[1].length, 1, 'Assets on state OnReview must be 1');
            assert.strictEqual(parseInt(values[2], 10), 1, 'Asset accept count is not 1');
            return workflow.accept(asset.address, 'Second comment on Accept'); // Second time accept
        }).then(function(acceptTx) {
            truffleAssert.eventNotEmitted(acceptTx, 'AssetStateChanged');
            return Promise.all([
                workflow.findAssetsByState.call('Published'),
                workflow.findAssetsByState.call('OnReview'),
                workflow.getAcceptedCount.call(asset.address)
            ]);
        }).then(function(values) {
            assert.strictEqual(values[0].length, 0, 'Assets on state Published must be 0');
            assert.strictEqual(values[1].length, 1, 'Assets on state OnReview must be 1');
            assert.strictEqual(parseInt(values[2], 10), 2, 'Asset accept count is not 2');
            return workflow.accept(asset.address, 'Third comment on Accept'); // Third time accept > Published
        }).then(function(acceptTx) {
            truffleAssert.eventEmitted(acceptTx, 'AssetStateChanged', function (e) {
                return e.assetAddress === asset.address && e.state === 'Published';
            });
            return Promise.all([
                workflow.findAssetsByState.call('Published'),
                workflow.findAssetsByState.call('OnReview'),
                workflow.getAcceptedCount.call(asset.address)
            ]);
        }).then(function(values) {
            assert.strictEqual(values[0].length, 1, 'Assets on state Published must be 1');
            assert.strictEqual(values[1].length, 0, 'Assets on state OnReview must be 0');
            assert.strictEqual(parseInt(values[2], 10), 3, 'Asset accept count is not 3');
        });
    });

    it("should fail with non-exist transitions", function () {
        return PeerReviewWorkflow.deployed().then(function (workflow) {
            return workflow.run('fakeTransition', asset.address);
        }).catch(function (e) {
            assert.strictEqual(e.message, 'workflow.run is not a function', 'Fake transition is forbidden');
        });
    });

    it("should fail on not applicable transitions", function () {
        return PeerReviewWorkflow.deployed().then(function (workflow) {
            return truffleAssert.fails(
                workflow.accept(asset.address, 'This is a comment'),
                truffleAssert.ErrorType.REVERT,
                'The current state not allow to Accept.'
            );
        });
    });

    it("should find an asset by state", function () {
        var workflow;
        return PeerReviewWorkflow.deployed().then(function (instance) {
            workflow = instance;
            return workflow.submit(asset.address);
        }).then(function (tx) {
            return workflow.findStateByAsset.call(asset.address);
        }).then(function(state) {
            assert.strictEqual(state, 'Submitted', "Asset's state does not match or not found");
        });
    });

    it("should add comments to an asset", function () {
        var workflow;
        return PeerReviewWorkflow.deployed().then(function (instance) {
            workflow = instance;
            return workflow.submit(asset.address);
        }).then(function (tx) {
            return workflow.getCommentsCount.call(asset.address);
        }).then(function (count) {
            assert.strictEqual(parseInt(count, 10), 0, 'Comments count is not 0 at start');
            return Promise.all([
                workflow.addComment(asset.address, 'This is my first comment'),
                workflow.addComment(asset.address, 'This is a second comment')
            ]);
        }).then(function(values) {
            var comment1Tx = values[0];
            var comment2Tx = values[1];
            truffleAssert.eventEmitted(comment1Tx, 'AssetCommentAdded', function (e) {
                return e.assetAddress === asset.address 
                && e.state === 'Submitted' 
                && e.message === 'This is my first comment'
                && e.author != undefined
                && e.timestamp != undefined;
            });
            truffleAssert.eventEmitted(comment2Tx, 'AssetCommentAdded', function (e) {
                return e.assetAddress === asset.address 
                && e.state === 'Submitted' 
                && e.message === 'This is a second comment'
                && e.author != undefined
                && e.timestamp != undefined;
            });
           return workflow.getCommentsCount.call(asset.address); 
        }).then(function(count){
            assert.strictEqual(parseInt(count, 10), 2, 'Comments count is not 2 after 2 comments were added');
            return Promise.all([
                workflow.getComment.call(asset.address,0),
                workflow.getComment.call(asset.address,1),
            ]);
        }).then(function(values) {
            var comment1 = values[0];
            var comment2 = values[1];
            assert.strictEqual(comment1[0], 'This is my first comment','Messages comments for comment1 not match');
            assert.strictEqual(comment2[0], 'This is a second comment','Messages comments for comment1 not match');
        });
    });

});