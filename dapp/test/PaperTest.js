var truffleAssert = require('truffle-assertions');

var Paper = artifacts.require('Paper');

contract('PaperTest', function(accounts) {
    
    var paperInstance;
    beforeEach(async function() {
        paperInstance = await Paper.new(accounts[0], accounts[0], 'Title', 'Summary','Abstract','Topic')
    });

    it("should fetch simple data from a paper", async function() {
        let data = await paperInstance.data.call()
        assert.strictEqual(data[0], 'Title', 'Title does not match')
        assert.strictEqual(data[1], 'Summary', 'Summary does not match')
        assert.strictEqual(data[2], 'Abstract', 'Abstract does not match')
        assert.strictEqual(data[3], 'Topic', 'Topic does not match')
    });
})