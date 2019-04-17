var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');
var PaperRegistry = artifacts.require('PaperRegistryCentral');
var PaperFactory = artifacts.require('PaperFactory');
var ReviewRegistry = artifacts.require('ReviewRegistryCentral');
var PaperAPI = artifacts.require('PaperAPI');

contract('PaperAPITest', function(accounts) {
    
    var paperAPI;
    var paperFactory;
    var paperRegistry;
    beforeEach(async function() {
        paperRegistry = await PaperRegistry.new()
        const reviewRegistry = await ReviewRegistry.new(paperRegistry.address)
        paperFactory = await PaperFactory.new(paperRegistry.address, reviewRegistry.address)
        await paperRegistry.allowCallsFrom(paperFactory.address)
        paperAPI = await PaperAPI.new(paperFactory.address)
    });

    it("Should create new Paper", async function() {
        let tx = await paperAPI.create(
            'Awesome Title paper',
            'Short summary',
            'Abstract lore ipsum ipsum ipsum',
            'Astronomy',
            'Article',
            'Big-bang,nova',
            'MyfileName',
            'IPFS',
            'https://ipfs.io/test',
            'blake2b',
            'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B'
        )
    })
})