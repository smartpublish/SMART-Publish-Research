var truffleAssert = require('truffle-assertions');
var Contributable = artifacts.require('Contributable');
var Contributors = artifacts.require('Contributors');
var Contributor = artifacts.require('Contributor');

contract('ContributableTest', function(accounts) {
    var contributable, contributors, contributor_address;
    beforeEach(async function() {
        contributors = await Contributors.new()
        let tx = await contributors.createContributor('0000-0002-1825-0097',{from: accounts[1]})
        truffleAssert.eventEmitted(tx, 'ContributorCreated', function(e) {
            contributor_address = e.contributor;
            return e.contributor !== undefined;
        }, 'ContributorCreated should be emitted')
        contributable = await Contributable.new(contributor_address)
    });

    it("should get Contributors", async function () {
        let count = await contributable.getContributorCount.call()
        assert.strictEqual(parseInt(count, 10), 1, 'Contributors should be 1')
        
        let fetched_contributor = await contributable.contributors.call(0)
        assert.strictEqual(fetched_contributor, contributor_address, 'Contributors should be match')

        let all_contributors = await contributable.getContributors.call()
        assert.strictEqual(all_contributors[0], contributor_address, 'Contributors should be match')
    });

    it("should create and invitation and consume it", async function () {
        let code = "FakeCodeToTest"
        let hashedCode = await web3.utils.soliditySha3(code)
        let block = await web3.eth.getBlockNumber().then(web3.eth.getBlock)
        let expires = block.timestamp + 24 * 60 * 60
        await contributable.addInvitation(hashedCode, expires)
        // TODO JOIN
    });
    
});