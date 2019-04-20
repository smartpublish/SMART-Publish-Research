var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');
var PaperAPI = artifacts.require('PaperAPI');

contract('PaperAPITest', function(accounts) {
    
    var paperAPI, paperFactory, paperRegistry, reviewRegistry;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        reviewRegistry = await ReviewRegistry.new(paperRegistry.address)
        paperFactory = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.allowCallsFrom(paperFactory.address)
        paperAPI = await PaperAPI.new(paperFactory.address)
    });

    it("Should change the Paper Factory with owner", async function() {
        let paperFactory2 = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        await paperAPI.setPaperFactory(paperFactory2.address)
    });

    it("Should not allow change the Paper Factory from a not owner", async function() {
        let paperFactory2 = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        truffleAssert.reverts(paperAPI.setPaperFactory(paperFactory2.address, { from: accounts[1] }))
    });

    let paperData = {
        _title: 'Title',
        _summary: 'Summary',
        _abstract: 'Abstract',
        _topic: 'Topic',
        _type: 'Type',
        _keywords: 'Keywords',
        _files: [{
            _fileName: 'MyfileName',
            _fileSystemName: 'IPFS',
            _publicLocation: 'https://ipfs.io/test',
            _summaryHashAlgorithm: 'blake2b',
            _summaryHash: 'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
        },{
            _fileName: 'MyfileName2',
            _fileSystemName: 'IPFS',
            _publicLocation: 'https://ipfs.io/test2',
            _summaryHashAlgorithm: 'blake2b',
            _summaryHash: 'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
        }],
        _author: accounts[0],
        _coAuthors: [accounts[1], accounts[2]],
        _contributors: [accounts[3], accounts[4], accounts[5]]
    }

    it("Should create a new Paper", async function() {
        let tx = await paperAPI.create(paperData)
        truffleAssert.eventEmitted(tx, 'PaperCreated')
    });

    it("Should read a paper", async function() {
        let tx = await paperAPI.create(paperData)
        let paperAddr
        truffleAssert.eventEmitted(tx, 'PaperCreated', (e)=>{ paperAddr = e.paper; return true; })
        let data = await paperAPI.read.call(paperAddr)

        // Assert paper data
        assert.strictEqual(data._title, 'Title', 'Title does not match')
        assert.strictEqual(data._summary, 'Summary', 'Summary does not match')
        assert.strictEqual(data._abstract, 'Abstract', 'Abstract does not match')
        assert.strictEqual(data._topic, 'Topic', 'Topic does not match')
        assert.strictEqual(data._type, 'Type', 'Type does not match')
        assert.strictEqual(data._keywords, 'Keywords', 'Keywords does not match')
        assert.strictEqual(data._files.length, 2, 'Files length does not match')

        // Assert files
        assert.strictEqual(data._files[0]._fileName, 'MyfileName', 'File Name does not match')
        assert.strictEqual(data._files[0]._fileSystemName, 'IPFS', 'File System Name does not match')
        assert.strictEqual(data._files[0]._publicLocation, 'https://ipfs.io/test', 'File Public Location does not match')
        assert.strictEqual(data._files[0]._summaryHashAlgorithm, 'blake2b', 'File Summary Hash Algortihm does not match')
        assert.strictEqual(data._files[0]._summaryHash, 'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B', 'File Summary Hash does not match')
        assert.strictEqual(data._files[1]._fileName, 'MyfileName2', 'File Name does not match')
        assert.strictEqual(data._files[1]._fileSystemName, 'IPFS', 'File System Name does not match')
        assert.strictEqual(data._files[1]._publicLocation, 'https://ipfs.io/test2', 'File Public Location does not match')
        assert.strictEqual(data._files[1]._summaryHashAlgorithm, 'blake2b', 'File Summary Hash Algortihm does not match')
        assert.strictEqual(data._files[1]._summaryHash, 'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B', 'File Summary Hash does not match')
        
        // Assert authorship
        assert.strictEqual(data._author, accounts[0], 'Author does not match')
        assert.strictEqual(data._coAuthors.length, 2, 'CoAuthors length does not match')
        assert.strictEqual(data._coAuthors[0], accounts[1], 'CoAuthor does not match')
        assert.strictEqual(data._coAuthors[1], accounts[2], 'CoAuthor does not match')
        assert.strictEqual(data._contributors.length, 3, 'Contributors length does not match')
        assert.strictEqual(data._contributors[0], accounts[3], 'Contributor does not match')
        assert.strictEqual(data._contributors[1],  accounts[4], 'Contributor does not match')
        assert.strictEqual(data._contributors[2], accounts[5], 'Contributor does not match')
    });

})