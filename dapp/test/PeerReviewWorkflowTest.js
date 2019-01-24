var truffleAssert = require('truffle-assertions')
var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow')
var Paper = artifacts.require('Paper')

contract('PeerReviewWorkflowTest', function(accounts) {

    const STATE_SUMBITTED = 'Submitted'
    const STATE_PUBLISHED = 'Published'
    const STATE_REJECTED = 'Rejected'

    const TRANSITION_SUBMIT = 'Submit'
    const TRANSITION_REVIEW = 'Review'
    const TRANSITION_PUBLISH = 'Publish'
    const TRANSITION_REJECT = 'Reject'

    const APPROVAL_TYPE_REVIEW = 'Review'

    var asset, workflow;
    beforeEach(async function() {
        workflow = await PeerReviewWorkflow.new()
        asset = await Paper.new(accounts[0], accounts[0], 'Title', 'Summary','Abstract','Topic')
    });

    it("should has a workflow name", async function() {
        let name = await workflow.name.call();
        assert.strictEqual(name, 'Peer Review', 'Workflow name does not match')
    });

    it("should initialize states", async function() {
        let count = await workflow.getStatesCount.call()
        assert.strictEqual(parseInt(count, 10), 3, 'States count does not match')
        let state = await workflow.getState.call(0)
        assert.strictEqual(state, STATE_SUMBITTED, STATE_SUMBITTED + ' state does not exists')
        state = await workflow.getState.call(1)
        assert.strictEqual(state, STATE_PUBLISHED, STATE_PUBLISHED + ' state does not exists')
        state = await workflow.getState.call(2)
        assert.strictEqual(state, STATE_REJECTED, STATE_REJECTED + ' state does not exists')
    });

    it("should initialize transitions", async function() {
        let count = await workflow.getTransitionsCount.call()
        assert.strictEqual(parseInt(count, 10), 4, 'Transitions count does not match')
        let transition = await workflow.getTransition.call(0)
        assert.strictEqual(transition[0], TRANSITION_SUBMIT, TRANSITION_SUBMIT + ' transition does not exists')
        transition = await workflow.getTransition.call(1)
        assert.strictEqual(transition[0], TRANSITION_REVIEW, TRANSITION_REVIEW + ' transition does not exists')
        transition = await workflow.getTransition.call(2)
        assert.strictEqual(transition[0], TRANSITION_PUBLISH, TRANSITION_PUBLISH + ' transition does not exists')
        transition = await workflow.getTransition.call(3)
        assert.strictEqual(transition[0], TRANSITION_REJECT, TRANSITION_REJECT + ' transition does not exists')
    });

    it("should find an asset by state", async function() {
        await workflow.submit(asset.address)
        let state = await workflow.findStateByAsset.call(asset.address)
        assert.strictEqual(state, STATE_SUMBITTED, "Asset's state does not match or not found")
    });

    it("should add comments to an asset", async function() {
        let tx = await workflow.submit(asset.address)
        let count = await workflow.getCommentsCount.call(asset.address)
        assert.strictEqual(parseInt(count, 10), 0, 'Comments count is not 0 at start')
        
        tx = await workflow.addComment(asset.address, 'This is my first comment')
        truffleAssert.eventEmitted(tx, 'AssetCommentAdded', function (e) {
            return e.asset === asset.address 
            && e.state === 'Submitted' 
            && e.message === 'This is my first comment'
            && e.author != undefined
            && e.timestamp != undefined;
        });

        tx = await workflow.addComment(asset.address, 'This is a second comment')
        truffleAssert.eventEmitted(tx, 'AssetCommentAdded', function (e) {
            return e.asset === asset.address 
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

    const ApprovalState_PENDING = 0
    const ApprovalState_APPROVED = 1
    const ApprovalState_REJECTED = 2

    it("should add approvals to asset on review", async function() {
        await workflow.submit(asset.address)

        // Add 2 reviewers
        for(let i = 1; i < 3; i++) {
            await workflow.review(asset.address, { from: accounts[i] })
            let count = await workflow.getApprovalsCount.call(asset.address, STATE_SUMBITTED)
            assert.strictEqual(parseInt(count,10), i, 'Must be ' + i + ' approval after a review transtion')
            let approval = await workflow.getApproval(asset.address, STATE_SUMBITTED, i - 1)
            assert.strictEqual(approval[0], accounts[i], 'Approver must be who did review action')
            assert.strictEqual(approval[1], APPROVAL_TYPE_REVIEW, 'Approval types not match')
            assert.strictEqual(parseInt(approval[2],10), ApprovalState_PENDING, 'Approval state not match')    
        }
    })

    it("should reviewer update its approval", async function() {
        await workflow.submit(asset.address)
        let approval;
        for(let i = 1; i < 3; i++) {
            await workflow.review(asset.address, { from: accounts[i] })
            await workflow.accept(asset.address, 'This is an accept comment', { from: accounts[i] }) // Approval
            approval = await workflow.getApproval(asset.address, STATE_SUMBITTED, i - 1)
            assert.strictEqual(parseInt(approval[2],10), ApprovalState_APPROVED, 'Approval state not match')
        }
        await workflow.review(asset.address, { from: accounts[3] })
        await workflow.reject(asset.address, 'This is a rejected comment', { from: accounts[3] })
        approval = await workflow.getApproval(asset.address, STATE_SUMBITTED, 2)
        assert.strictEqual(parseInt(approval[2],10), ApprovalState_REJECTED, 'Approval state not match')
    })

    it("should get assets by approver", async function() {
        let approver = accounts[5]
        let assetsAddress = []
        let asset;
        for(let i = 0; i < 4; i++) {
            asset = await Paper.new(accounts[0], accounts[0], 'Title ' + i, 'Summary ' + i, 'Abstract ' + i, 'Topic ' + i)
            await workflow.submit(asset.address)
            await workflow.review(asset.address, { from: approver })
            assetsAddress[i] = asset.address
        }
        let count = await workflow.getApprovalsByApproverCount.call(approver);
        let approvals = [];
        for(let i = 0; i < count; i++) {
            approvals.push(await workflow.getApprovalByApprover.call(approver, i))
        }
        let approverAssetsAddress = approvals.map(approval => approval.asset)
        assert.deepEqual(approverAssetsAddress, assetsAddress, 'Assets by approver not match')
    })

    it("should fire an event when you submit an asset", async function() {
        let tx = await workflow.submit(asset.address, { from: accounts[0] })
        truffleAssert.eventEmitted(tx, 'AssetStateChanged', function(e) {
            return e.asset === asset.address && e.state === STATE_SUMBITTED
        });
    })

    it("should run transitions from Submit to Publish", async function() {
        let assetArray = await workflow.findAssetsByState.call(STATE_SUMBITTED)
        assert.strictEqual(assetArray.length, 0, 'Assets on state ' + STATE_SUMBITTED + ' must be 0')

        let tx = await workflow.submit(asset.address, { from: accounts[0] })
        assetArray = await workflow.findAssetsByState.call(STATE_SUMBITTED)
        assert.strictEqual(assetArray.length, 1, 'Assets on state ' + STATE_SUMBITTED + ' must be 1')
        state = await workflow.findStateByAsset.call(asset.address)
        assert.strictEqual(state, STATE_SUMBITTED, "Asset's state does not match or not found")

        // Add 3 reviewer
        let count;
        for(let i = 1; i < 4; i++) {
            await workflow.review(asset.address, { from: accounts[i] })
            count = await workflow.getApprovalsCount.call(asset.address, STATE_SUMBITTED)
            assert.strictEqual(parseInt(count,10), i, 'Must be ' + i + ' approval after a accept transtion')
        }
        
        // Not change state automatically
        for(let i = 1; i < 3; i++) {
            tx = await workflow.accept(asset.address, 'Comment on Accept: ' + i, { from: accounts[i] }) // Approval
            truffleAssert.eventNotEmitted(tx, 'AssetStateChanged')
            state = await workflow.findStateByAsset.call(asset.address)
            assert.strictEqual(state, STATE_SUMBITTED, "Asset's state does not match or not found")
            count = await workflow.getAcceptedCount.call(asset.address)
            assert.strictEqual(parseInt(count, 10), i, 'Asset accept count is not ' + i)
        }

        // Changed state automatically: Third time accept > Published
        tx = await workflow.accept(asset.address, 'Comment on Accept: 3', { from: accounts[3] })
        truffleAssert.eventEmitted(tx, 'AssetStateChanged', function(e) {
            return e.asset === asset.address && e.state === STATE_PUBLISHED
        });
        state = await workflow.findStateByAsset.call(asset.address)
        assert.strictEqual(state, STATE_PUBLISHED, "Asset's state does not match or not found")
        count = await workflow.getAcceptedCount.call(asset.address)
        assert.strictEqual(parseInt(count, 10), 3, 'Asset accept count is not 3')
        assetArray = await workflow.findAssetsByState.call(STATE_PUBLISHED)
        assert.strictEqual(assetArray.length, 1, 'Assets on state ' + STATE_PUBLISHED + ' must be 1')
        assetArray = await workflow.findAssetsByState.call(STATE_SUMBITTED)
        assert.strictEqual(assetArray.length, 0, 'Assets on state ' + STATE_SUMBITTED + ' must be 0')
    });

});