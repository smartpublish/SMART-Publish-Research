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

    it("should contabilize review", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let tx = await reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);

    });

    it("should contabilize 9 reviews", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let tx = await reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);
        let tx1 = await reviewRegistry.contabilize(accounts[1], paper.address, work.address, "1", 0);
        let tx2 = await reviewRegistry.contabilize(accounts[2], paper.address, work.address, "1", 0);
        let tx3 = await reviewRegistry.contabilize(accounts[3], paper.address, work.address, "1", 0);
        let tx4 = await reviewRegistry.contabilize(accounts[4], paper.address, work.address, "1", 0);
        let tx5 = await reviewRegistry.contabilize(accounts[5], paper.address, work.address, "1", 0);
        let tx6 = await reviewRegistry.contabilize(accounts[6], paper.address, work.address, "1", 0);
        let tx7 = await reviewRegistry.contabilize(accounts[7], paper.address, work.address, "1", 0);
        let tx8 = await reviewRegistry.contabilize(accounts[8], paper.address, work.address, "1", 0);

    });
    
    it("Contabilize should fail if paper is not registered", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        let work = await Work.new(paper.address);
        await paper.addWork(work.address)
        await truffleAssert.reverts(reviewRegistry.contabilize(accounts[1], paper.address, work.address, "1", 0), 'Paper is not registered')
    });

    it("Contabilize should fail if paper is reviewed twice by the same address", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let tx = await reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);
        await truffleAssert.reverts(reviewRegistry.contabilize(accounts[0], paper.address, work.address, "2", 0), 'Reviewer has reviewed this work previously');
    });


    it("Calculate Factor of a not known reviewer", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let factor = await reviewRegistry.calculeFactor(accounts[0], paper.address, work.address);
        assert.strictEqual(0, factor.toNumber());
    });

    it("Calculate Factor of a well known reviewer", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let tx = await reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);
        let tx1 = await reviewRegistry.contabilize(accounts[1], paper.address, work.address, "1", 0);
        let tx2 = await reviewRegistry.contabilize(accounts[2], paper.address, work.address, "1", 0);
        let tx3 = await reviewRegistry.contabilize(accounts[3], paper.address, work.address, "1", 0);
        let tx4 = await reviewRegistry.contabilize(accounts[4], paper.address, work.address, "1", 0);
        let tx5 = await reviewRegistry.contabilize(accounts[5], paper.address, work.address, "1", 0);
        let tx6 = await reviewRegistry.contabilize(accounts[6], paper.address, work.address, "1", 0);
        let tx7 = await reviewRegistry.contabilize(accounts[7], paper.address, work.address, "1", 0);
        let tx8 = await reviewRegistry.contabilize(accounts[8], paper.address, work.address, "1", 0);

        let factor = await reviewRegistry.calculeFactor(accounts[0], paper.address, work.address);
        assert.strictEqual(100, factor.toNumber());   //8 * 100 / 8 + 0 = 100%
    });

    it("Calculate Factor of a well refuted reviewer", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let tx = await reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);
        let tx1 = await reviewRegistry.contabilize(accounts[1], paper.address, work.address, "1", 1);
        let tx2 = await reviewRegistry.contabilize(accounts[2], paper.address, work.address, "1", 1);
        let tx3 = await reviewRegistry.contabilize(accounts[3], paper.address, work.address, "1", 1);
        let tx4 = await reviewRegistry.contabilize(accounts[4], paper.address, work.address, "1", 1);
        let tx5 = await reviewRegistry.contabilize(accounts[5], paper.address, work.address, "1", 1);
        let tx6 = await reviewRegistry.contabilize(accounts[6], paper.address, work.address, "1", 1);
        let tx7 = await reviewRegistry.contabilize(accounts[7], paper.address, work.address, "1", 1);
        let tx8 = await reviewRegistry.contabilize(accounts[8], paper.address, work.address, "1", 1);

        let factor = await reviewRegistry.calculeFactor(accounts[0], paper.address, work.address);
        assert.strictEqual(0, factor.toNumber()); // 0 * 100 / 0 + 8 = 0%
    });

    it("Calculate Factor of a refuted and approved reviewer", async function() {
        let paper = await Paper.new(paperRegistry.address, reviewRegistry.address);
        await paperRegistry.addPaper(paper.address);

        let work = await Work.new(paper.address);
        await paper.addWork(work.address);

        let tx = await reviewRegistry.contabilize(accounts[0], paper.address, work.address, "1", 0);
        let tx1 = await reviewRegistry.contabilize(accounts[1], paper.address, work.address, "1", 0);
        let tx2 = await reviewRegistry.contabilize(accounts[2], paper.address, work.address, "1", 0);
        let tx3 = await reviewRegistry.contabilize(accounts[3], paper.address, work.address, "1", 0);
        let tx4 = await reviewRegistry.contabilize(accounts[4], paper.address, work.address, "1", 0);
        let tx5 = await reviewRegistry.contabilize(accounts[5], paper.address, work.address, "1", 1);
        let tx6 = await reviewRegistry.contabilize(accounts[6], paper.address, work.address, "1", 1);
        let tx7 = await reviewRegistry.contabilize(accounts[7], paper.address, work.address, "1", 1);
        let tx8 = await reviewRegistry.contabilize(accounts[8], paper.address, work.address, "1", 1);

        let factor = await reviewRegistry.calculeFactor(accounts[0], paper.address, work.address);
        assert.strictEqual(50, factor.toNumber()); // 4 * 100 / 4 + 4 = 50%
    });
})