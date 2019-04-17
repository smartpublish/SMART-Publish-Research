var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');

contract('PaperRegistryTests', function(accounts) {
    
    var paperRegistry;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
    });

    it("should not contains paper", async function() {
        let paper = await Paper.new(accounts[0],accounts[0],accounts[0])
        let isContained = await paperRegistry.containsPaper.call(paper.address)
        assert.strictEqual(isContained, false, 'Expected paper is not contained')
    });

    it("Fail - Only allowed address can call addPaper", async function() {
        let paper = await Paper.new(accounts[0],accounts[0],accounts[0])
        await truffleAssert.reverts(paperRegistry.addPaper(paper.address),'Only allowed address can call addPaper')
    });

    it("Success - Only allowed address can call addPaper", async function() {
        let paper = await Paper.new(accounts[0],accounts[0],accounts[0])
        await paperRegistry.allowCallsFrom(accounts[0])
        await paperRegistry.addPaper(paper.address)
    });

    it("Sould countains paper", async function() {
        let paper = await Paper.new(accounts[0],accounts[0],accounts[0])
        await paperRegistry.allowCallsFrom(accounts[0])
        await paperRegistry.addPaper(paper.address)
        let isContained = await paperRegistry.containsPaper.call(paper.address)
        assert.strictEqual(isContained, true, 'Expected paper to be contained')
    });

})