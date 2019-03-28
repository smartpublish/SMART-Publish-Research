var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');

contract('PaperFactoryTest', function(accounts) {
    
    var paperFactory;
    var paperRegistry;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        const reviewRegistry = await ReviewRegistry.new(paperRegistry.address)
        paperFactory = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
    });

    it("Should create new Paper", async function() {
        await paperRegistry.allowCallsFrom(paperFactory.address)
        let tx = await paperFactory.createPaper.call()
    });

    it("Should not be allowed to create new Paper", async function() {
        await truffleAssert.reverts(paperFactory.createPaper(),'Only allowed address can call setPaper')
    });
})