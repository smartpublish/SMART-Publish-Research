var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');
var Work = artifacts.require('Work');


contract('ReviewRegistryTests', function(accounts) {
    
    var paperRegistry;
    var reviewRegistry;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        reviewRegistry = await ReviewRegistry.new(paperRegistry.address);
        await paperRegistry.allowCallsFrom(accounts[0])
        await reviewRegistry.allowCallsFrom(accounts[0])
    });


    it("Contabilize should fail if paper is not registered", async function() {

        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        await truffleAssert.reverts(reviewRegistry.contabilize(accounts[1], paper.address, work.address, "1", 0), 'Contabilize must be called from allowed address or registered Paper')

    });


    it("should contabilize review", async function() {

        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);

    });


})