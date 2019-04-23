var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');
var Work = artifacts.require('Work');

contract('WorkTest', function(accounts) {

    var paperFactory;
    var paperRegistry;
    var paper;
    var work;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        const reviewRegistry = await ReviewRegistry.new(paperRegistry.address)
        paperFactory = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.allowCallsFrom(paperFactory.address)
        await paperRegistry.allowCallsFrom(accounts[0])
        paper = await Paper.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.addPaper(paper.address)
        work = await Work.new(paper.address)
    });

    it("Add an Asset", async function() {
        await work.addAsset('fileName.pdf','fileSystemName','publicLocation','summaryHashAlgorithm','summaryHash');
        let count = parseInt(await work.assetCount.call(),10)
        assert.strictEqual(count, 1, 'Work assets count not match')
    });

    it("Update an Asset if you tried add the same filename", async function() {
        for(let count, i = 0; i < 3; i++) {
            await work.addAsset('fileName.pdf','fileSystemName','publicLocation','summaryHashAlgorithm','summaryHash');
            count = parseInt(await work.assetCount.call(),10)
            assert.strictEqual(count, 1, 'Work assets count not match')
        }
    });

    it("Get an Asset", async function() {
        for(let i = 0; i < 2; i++) {
            await work.addAsset('fileName' + i, 'fileSystemName' + i, 'publicLocation' + i, 'summaryHashAlgorithm' + i, 'summaryHash' + i)
        }
        let count = parseInt(await work.assetCount.call(),10)
        for(let asset, i = 0; i < count; i++) {
            asset = await work.getAsset.call(i)
            assert.strictEqual(asset._fileName, 'fileName' + i, 'File Name does not match')
            assert.strictEqual(asset._fileSystemName, 'fileSystemName' + i, 'File System Name does not match')
            assert.strictEqual(asset._publicLocation, 'publicLocation' + i, 'Public Location does not match')
            assert.strictEqual(asset._summaryHashAlgorithm, 'summaryHashAlgorithm' + i, 'Summary Hash Algorithm does not match')
            assert.strictEqual(asset._summaryHash, 'summaryHash' + i, 'Summary Hash does not match')
        }
    });

    it("Only an owner can add an asset", async function() {
        await truffleAssert.reverts(work.addAsset('fileName', 'fileSystemName', 'publicLocation', 'summaryHashAlgorithm', 'summaryHash', { from: accounts[1] }), "Only parent Owner can perform this action")
    });

    it("Close a work", async function() {
        await work.addAsset('fileName.pdf','fileSystemName','publicLocation','summaryHashAlgorithm','summaryHash');
        await work.close()
        let isClosed = await work.isClosed.call()
        assert.strictEqual(isClosed, true, 'Work should be closed and it is still open')
    });

    it("Work closed can not be closed again", async function() {
        await work.addAsset('fileName.pdf','fileSystemName','publicLocation','summaryHashAlgorithm','summaryHash');
        await work.close()
        await truffleAssert.reverts(work.close(), "Work is already closed")
    });

    it("Only an owner can close a work", async function() {
        await truffleAssert.reverts(work.close( { from: accounts[1] }), "Only parent Owner can perform this action")
    });

});