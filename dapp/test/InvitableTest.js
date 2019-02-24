var truffleAssert = require('truffle-assertions');
var Invitable = artifacts.require('./InvitableForTest');
const AssertionError = require('assertion-error');

contract('InvitableTest', function(accounts) {

    var deployed;
    beforeEach(async function() {
        deployed = await Invitable.new()
    });

    it("should be the same hash", async function () {
        let code = "FakeCodeToTest"
        let hashedCodeFromJs = await web3.utils.soliditySha3(code)
        let hashedCodeFromContract =  await deployed.performKeccak256FromTest.call(code)
        assertEquals(hashedCodeFromJs, hashedCodeFromContract)
    });

    it("should create invitation", async function () {
        let code = "FakeCodeToTest"
        let hashedCode = await web3.utils.soliditySha3(code)
        let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
        let expires = block.timestamp + 24 * 60 * 60
        await deployed.createInvitationFromTest(hashedCode, expires)
    });

    /**
    it("should create invitation and consume it", async function () {
        let code = "FakeCodeToTest"
        let hashedCode = await web3.utils.soliditySha3(code)
        let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
        let expires = block.timestamp + 24 * 60 * 60
        await deployed.createInvitationFromTest(hashedCode, expires)
        await deployed.consumeInvitationFromTest.call(code)
    });
     */

    it("should fail when an invitation is already consumed", async function () {
        let code = "FakeCodeToTest"
        let hashedCode = web3.extend.utils.keccak256(code)
        let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
        let expires = block.timestamp + 24 * 60 * 60
        await deployed.createInvitationFromTest(hashedCode, expires)
        await deployed.consumeInvitationFromTest(code);
        await truffleAssert.fails(deployed.consumeInvitationFromTest(code),'Invitation already used or not valid')
    });


    it("should fail when an invitation is expired", async function () {
        let code = "FakeCodeToTest"
        let hashedCode = web3.extend.utils.keccak256(code)
        let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
        let expires = block.timestamp
        await deployed.createInvitationFromTest(hashedCode, expires)
        await truffleAssert.reverts(deployed.consumeInvitationFromTest(code),'Invitation has expired')
    });

});


function assertEquals(one, other) {
    if(one != other) throw new AssertionError('Expected equals: ' + one + " != " + other);
}
