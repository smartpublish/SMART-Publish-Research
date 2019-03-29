var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');

contract('PaperTest', function(accounts) {
    
    var paperFactory;
    var paperRegistry;
    var paper;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        const reviewRegistry = await ReviewRegistry.new(paperRegistry.address)
        paperFactory = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.allowCallsFrom(paperFactory.address)
        await paperRegistry.allowCallsFrom(accounts[0])
        paper = await Paper.new(accounts[0], paperRegistry.address, reviewRegistry.address)
        await paperRegistry.setPaper(paper.address)
    });

    it("Should set Paper Info", async function() {
        await paper.setPaperInfo("Title", "Summary", "Abstract", "Topic", "Type", "Keywords");
        let data = await paper.getPaperInfo.call()
        assert.strictEqual(data[0], 'Title', 'Title does not match')
        assert.strictEqual(data[1], 'Summary', 'Summary does not match')
        assert.strictEqual(data[2], 'Abstract', 'Abstract does not match')
        assert.strictEqual(data[3], 'Topic', 'Topic does not match')
        assert.strictEqual(data[4], 'Type', 'Type does not match')
        assert.strictEqual(data[5], 'Keywords', 'Keywords does not match')
    });

    it("Should Fail set Paper Info (call from not owner)", async function() {
        await truffleAssert.reverts(
            paper.setPaperInfo("Title", "Summary", "Abstract", "Topic", "Type", "Keywords", { from: accounts[1] }),
            'Only owner can perform this action'
            )
    });
})