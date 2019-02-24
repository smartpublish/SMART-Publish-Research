var truffleAssert = require('truffle-assertions');

var AssetFactory = artifacts.require('AssetFactory');
var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow');
var Paper = artifacts.require('Paper');
var Contributors = artifacts.require('Contributors');

contract('AssetFactoryTest', function(accounts) {
    var factory, workflow, contributors;
    beforeEach(async function() {
        contributors = await Contributors.new();
        factory = await AssetFactory.new(contributors.address);
        workflow = await PeerReviewWorkflow.new();
    });

    it("should create a new Paper with pre-existing Contributor", async function() {
        await contributors.createContributor("0000-0002-1825-0097",{ from: accounts[1] })
        let tx = await factory.createPaper(
            'Awesome Title paper',
            'Short summary',
            'Abstract lore ipsum ipsum ipsum',
            'IPFS',
            'https://ipfs.io/test',
            'blake2b',
            'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
            'Astronomy',
            ['tag1','tag2'],
            workflow.address,
            '0000-0002-1825-0097',
            { from: accounts[1] }
        )
        let paperAddress;
        truffleAssert.eventEmitted(tx, 'AssetCreated', function(e) {
            paperAddress = e.asset;
            return e.asset !== undefined;
        }, 'AssetCreated should be emitted')
        truffleAssert.eventNotEmitted(tx, 'ContributorCreated', null, 'ContributorCreated should not be emitted')
        let paper = await Paper.at(paperAddress)
        let owner = await paper.owner.call()
        assert.strictEqual(owner, accounts[1], 'Paper owner should be match')
    });

    it("should create a new Paper using PeerReviewWorkflow", async function() {
        let tx = await factory.createPaper(
            'Awesome Title paper',
            'Short summary',
            'Abstract lore ipsum ipsum ipsum',
            'IPFS',
            'https://ipfs.io/test',
            'blake2b',
            'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
            'Astronomy',
            ['tag1','tag2'],
            workflow.address,
            'google-oauth2|129380127374018398127'
        )
        truffleAssert.eventEmitted(tx, 'AssetCreated');
    });


    it("should get properties from a Paper after be submitted", async function() {
        let tx = await factory.createPaper(
            'Awesome Title paper',
            'Short summary',
            'Abstract lore ipsum ipsum ipsum',
            'IPFS',
            'https://ipfs.io/test',
            'blake2b',
            'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
            'Astronomy',
            ['tag1','tag2'],
            workflow.address,
            'google-oauth2|129380127374018398127'
        )
        let paperAddress;
        truffleAssert.eventEmitted(tx, 'AssetCreated', function (e) {
            paperAddress = e.asset;
            return e.asset !== undefined && e.sender === accounts[0];
        });

        let paper = await Paper.at(paperAddress)
        let title = await paper.title.call()
        assert.strictEqual(title,'Awesome Title paper','Titles are different');
        
        let summary = await paper.summary.call()
        assert.strictEqual(summary,'Short summary','Summaries are different');

        let abstract = await paper.abstrakt.call()
        assert.strictEqual(abstract,'Abstract lore ipsum ipsum ipsum','Abstracts are different');

        let topic = await paper.topic.call()
        assert.strictEqual(topic,'Astronomy','Topics are different');
        
        let file = await paper.getFile(0)
        assert.strictEqual(file[0],'IPFS','File System Names are different');
        assert.strictEqual(file[1],'https://ipfs.io/test','Public locations are different');
        assert.strictEqual(file[2],'blake2b','Summary Hash Algorithms are different');
        assert.strictEqual(file[3],'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B','Summary Hashes are different');
    });

    it("should get contributor: Author from Paper after be submitted", async function() {
        let tx = await factory.createPaper(
            'Awesome Title paper',
            'Short summary',
            'Abstract lore ipsum ipsum ipsum',
            'IPFS',
            'https://ipfs.io/test',
            'blake2b',
            'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
            'Astronomy',
            ['tag1','tag2'],
            workflow.address,
            'google-oauth2|129380127374018398127',
            { from: accounts[1] }
        )
        let paperAddress;
        truffleAssert.eventEmitted(tx, 'AssetCreated', function (e) {
            paperAddress = e.asset;
            return e.asset !== undefined && e.sender === accounts[1];
        });

        let paper = await Paper.at(paperAddress)
        let contributorsArray = await paper.getContributors.call()
        let contributor_address = await contributors.getOrCreateContributor.call(accounts[1],'google-oauth2|129380127374018398127')
        assert.strictEqual(contributorsArray.length, 1, 'Contributor author should be the only set')
        assert.strictEqual(contributorsArray[0],contributor_address,'Contributor should be match')
    });

    it("should CRUD keywords", async function() {
        let tx = await factory.createPaper(
            'Awesome Title paper',
            'Short summary',
            'Abstract lore ipsum ipsum ipsum',
            'IPFS',
            'https://ipfs.io/test',
            'blake2b',
            'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B',
            'Astronomy',
            ['tag-origin'],
            workflow.address,
            'google-oauth2|129380127374018398127'
        )
        let paperAddress;
        truffleAssert.eventEmitted(tx, 'AssetCreated', function (e) {
            paperAddress = e.asset;
            return e.asset !== undefined && e.sender === accounts[0];
        });

        // Get by keywords
        let papers = await factory.getAssetsByKeywords.call(['tag-origin'])
        assert.strictEqual(papers.length, 1, 'Keyword should returns 1 paper')
        assert.strictEqual(papers[0], paperAddress, 'Paper address should match')

        // Add keywords after submit
        tx = await factory.addKeywords(paperAddress, ['tag1', 'tag2'])
        
        // Get by keywords
        papers = await factory.getAssetsByKeywords.call(['tag2'])
        assert.strictEqual(papers.length, 1, 'Keyword should returns 1 paper')
        assert.strictEqual(papers[0], paperAddress, 'Paper address should match')

        // Remove keywords
        tx = await factory.removeKeywords(paperAddress, ['tag2'])

        // Get by keywords
        papers = await factory.getAssetsByKeywords.call(['tag2'])
        assert.strictEqual(papers.length, 0, 'Keyword should returns 0 papers')
        papers = await factory.getAssetsByKeywords.call(['tag1'])
        assert.strictEqual(papers.length, 1, 'Keyword should returns 1 paper')
        assert.strictEqual(papers[0], paperAddress, 'Paper address should match')
    });
});