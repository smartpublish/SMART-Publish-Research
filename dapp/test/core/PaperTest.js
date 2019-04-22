var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');
var Work = artifacts.require('Work');

contract('PaperTest', function(accounts) {
    
    var paperFactory;
    var paperRegistry;
    var reviewRegistry;
    var paper;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        reviewRegistry = await ReviewRegistry.new(paperRegistry.address)
        paperFactory = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.allowCallsFrom(paperFactory.address)
        await paperRegistry.allowCallsFrom(accounts[0])
        paper = await Paper.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.addPaper(paper.address)
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
            paper.setPaperInfo("Title", "Summary", "Abstract", "Topic", "Type", "Keywords", { from: accounts[1] })
            )
    });

    it("Should set Paper Work", async function() {
        let work = await Work.new(paper.address);
        await paper.addWork(work.address);
        let workAddress = await paper.getCurrentWork.call()
        assert.strictEqual(work.address, workAddress, 'Address does not match');
    });

    it("Should get Live Work", async function() {
        let work = await Work.new(paper.address);
        await paper.addWork(work.address);
        let work2 = await Work.new(paper.address);
        await paper.addWork(work2.address);

        let liveWork = await paper.getLiveWork.call();
        let expectedLiveWork = [work.address, work2.address]
        assert.strictEqual(expectedLiveWork.length, liveWork.length, 'Expected same length')
        var i;
        for(i = 0; i < expectedLiveWork.length; i++) {
            assert.strictEqual(expectedLiveWork[i], liveWork[i],'Live Work does not match');
        }
    });

    it("Should cite another Paper", async function() {
        let otherPaper = await Paper.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.addPaper(otherPaper.address)
        await otherPaper.cite("refutation", paper.address)
    });


    it("Cite should fail if paper is not registered", async function() {
        let otherPaper = await Paper.new(paperRegistry.address, reviewRegistry.address)
        await truffleAssert.reverts(otherPaper.cite("refutation", paper.address),"Paper is not registered")
    });
})