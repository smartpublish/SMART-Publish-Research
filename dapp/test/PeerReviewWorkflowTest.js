var truffleAssert = require('truffle-assertions')
var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow')
var Paper = artifacts.require('Paper')

contract('PeerReviewWorkflowTest', function(accounts) {

    var asset, workflow;
    beforeEach(async function() {
        workflow = await PeerReviewWorkflow.deployed()
        asset = await Paper.new(accounts[0], accounts[0], 'Title', 'Summary')
    });

    it("should has a workflow name", async function() {
        let instance = await PeerReviewWorkflow.deployed();
        let name = await instance.name.call();
        assert.strictEqual(name, 'Peer Review', 'Workflow name does not match')
    });

    it("should initialize states", async function() {
        let count = await workflow.getStatesCount.call()
        assert.strictEqual(parseInt(count, 10), 4, 'States count does not match')
        let state = await workflow.getState.call(0)
        assert.strictEqual(state, 'Submitted', 'Submitted state does not exists')
        state = await workflow.getState.call(1)
        assert.strictEqual(state, 'OnReview', 'OnReview state does not exists')
        state = await workflow.getState.call(2)
        assert.strictEqual(state, 'Published', 'Published state does not exists')
        state = await workflow.getState.call(3)
        assert.strictEqual(state, 'Rejected', 'Rejected state does not exists')
    });

    it("should initialize transitions", async function() {
        let count = await workflow.getTransitionsCount.call()
        assert.strictEqual(parseInt(count, 10), 5, 'Transitions count does not match')
        let transition = await workflow.getTransition.call(0)
        assert.strictEqual(transition[0], 'Submit', 'Submit transition does not exists')
        transition = await workflow.getTransition.call(1)
        assert.strictEqual(transition[0], 'Review', 'Review transition does not exists')
        transition = await workflow.getTransition.call(2)
        assert.strictEqual(transition[0], 'Accept', 'Accept transition does not exists')
        transition = await workflow.getTransition.call(3)
        assert.strictEqual(transition[0], 'Publish', 'Publish transition does not exists')
        transition = await workflow.getTransition.call(4)
        assert.strictEqual(transition[0], 'Reject', 'Reject transition does not exists')
    });


    it("should run transitions from Submit to Publish", async function() {
        let tx = await workflow.submit(asset.address)
        truffleAssert.eventEmitted(tx, 'AssetStateChanged', function(e) {
            return e.assetAddress === asset.address && e.state === 'Submitted'
        });

        let assetArray = await workflow.findAssetsByState.call('Submitted')
        assert.strictEqual(assetArray.length, 1, 'Assets on state Submitted must be 1')

        tx = await workflow.review(asset.address, 'This is a comment for Review')
        truffleAssert.eventEmitted(tx, 'AssetStateChanged', function(e) {
            return e.assetAddress === asset.address && e.state === 'OnReview'
        });

        assetArray = await workflow.findAssetsByState.call('Submitted')
        assert.strictEqual(assetArray.length, 0, 'Assets on state Submitted must be 0')
        assetArray = await workflow.findAssetsByState.call('OnReview')
        assert.strictEqual(assetArray.length, 1, 'Assets on state OnReview must be 1')

        // Not change state automatically
        for(let i = 1; i < 3; i++) {
            tx = await workflow.accept(asset.address, 'Comment ' + i + ' on Accept')
            truffleAssert.eventNotEmitted(tx, 'AssetStateChanged')
            assetArray = await workflow.findAssetsByState.call('Published')
            assert.strictEqual(assetArray.length, 0, 'Assets on state Published must be 0')
            assetArray = await workflow.findAssetsByState.call('OnReview')
            assert.strictEqual(assetArray.length, 1, 'Assets on state OnReview must be 1')
            let count = await workflow.getAcceptedCount.call(asset.address)
            assert.strictEqual(parseInt(count, 10), i, 'Asset accept count is not ' + i)
        }

        // Changed state automatically: Third time accept > Published
        tx = await workflow.accept(asset.address, 'Third comment on Accept')
        truffleAssert.eventEmitted(tx, 'AssetStateChanged', function(e) {
            return e.assetAddress === asset.address && e.state === 'Published'
        });
        assetArray = await workflow.findAssetsByState.call('Published')
        assert.strictEqual(assetArray.length, 1, 'Assets on state Published must be 1')
        assetArray = await workflow.findAssetsByState.call('OnReview')
        assert.strictEqual(assetArray.length, 0, 'Assets on state OnReview must be 0')
        let count = await workflow.getAcceptedCount.call(asset.address)
        assert.strictEqual(parseInt(count, 10), 3, 'Asset accept count is not 3')
    });

    it("should fail on not applicable transitions", async function() {
        await truffleAssert.fails(
            workflow.accept(asset.address, 'This is a comment'),
            truffleAssert.ErrorType.REVERT,
            'The current state not allow to Accept.'
        )
    });

    it("should find an asset by state", async function() {
        await workflow.submit(asset.address)
        let state = await workflow.findStateByAsset.call(asset.address)
        assert.strictEqual(state, 'Submitted', "Asset's state does not match or not found")
    });

    it("should add comments to an asset", async function() {
        let tx = await workflow.submit(asset.address)
        let count = await workflow.getCommentsCount.call(asset.address)
        assert.strictEqual(parseInt(count, 10), 0, 'Comments count is not 0 at start')
        
        tx = await workflow.addComment(asset.address, 'This is my first comment')
        truffleAssert.eventEmitted(tx, 'AssetCommentAdded', function (e) {
            return e.assetAddress === asset.address 
            && e.state === 'Submitted' 
            && e.message === 'This is my first comment'
            && e.author != undefined
            && e.timestamp != undefined;
        });

        tx = await workflow.addComment(asset.address, 'This is a second comment')
        truffleAssert.eventEmitted(tx, 'AssetCommentAdded', function (e) {
            return e.assetAddress === asset.address 
            && e.state === 'Submitted' 
            && e.message === 'This is a second comment'
            && e.author != undefined
            && e.timestamp != undefined;
        });

        count = await workflow.getCommentsCount.call(asset.address)
        assert.strictEqual(parseInt(count, 10), 2, 'Comments count is not 2 after 2 comments were added')

        let comment = await workflow.getComment.call(asset.address,0)
        assert.strictEqual(comment[0], 'This is my first comment','Messages comments not match')
        comment = await workflow.getComment.call(asset.address,1)
        assert.strictEqual(comment[0], 'This is a second comment','Messages comments not match')
    });

});