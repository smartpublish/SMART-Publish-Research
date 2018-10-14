var truffleAssert = require('truffle-assertions');

var PaperWorkflow = artifacts.require("PaperWorkflow");
var Paper = artifacts.require("Paper");

contract('PaperWorkflow', function() {
    it("should submit a new Paper", function () {
        return PaperWorkflow.deployed().then(function (instance) {
            return instance.submit(
                'Awesome Title paper',
                'Best abstract',
                'IPFS',
                'https://ipfs.io/test',
                'blake2b',
                'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B'
            );
        });
    });
    it("should fire event when you submit a new Paper", function () {
        return PaperWorkflow.deployed().then(function (instance) {
            return instance.submit(
                'Awesome Title paper',
                'Best abstract',
                'IPFS',
                'https://ipfs.io/test',
                'blake2b',
                'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B'
            );
        }).then(function (tx) {
            truffleAssert.eventEmitted(tx, 'PaperSubmitted', function (e) {
                return e.paperAddress !== undefined;
            });
        });
    });
    it("should find all papers on state 'submitted'", function () {
        var paperWF, submitTx;

        return PaperWorkflow.deployed().then(function (instance) {
            paperWF = instance;
            return paperWF.submit(
                'Awesome Title paper',
                'Best abstract',
                'IPFS',
                'https://ipfs.io/test',
                'blake2b',
                'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B'
            );
        }).then(function (Tx) {
            submitTx = Tx;
            return paperWF.findPapers.call("Submitted")
        }).then(function (papers) {
            assert(papers.length > 0);
            truffleAssert.eventEmitted(submitTx, 'PaperSubmitted', function (e) {
               return papers[papers.length - 1] === e.paperAddress;
            });
        });
    });
    it("should get properties: title and abstract from a Paper after be submitted", function () {
        var paperWF;
        var paper;

        return PaperWorkflow.deployed().then(function (instance) {
            paperWF = instance;
            return paperWF.submit(
                'Awesome Title paper',
                'Best abstract',
                'IPFS',
                'https://ipfs.io/test',
                'blake2b',
                'A8CFBBD73726062DF0C6864DDA65DEFE58EF0CC52A5625090FA17601E1EECD1B'
            );
        }).then(function () {
            return paperWF.findPapers.call("Submitted");
        }).then(function (papersAdresses) {
            paper = Paper.at(papersAdresses[papersAdresses.length - 1]);
            return paper.title.call();
        }).then(function (title) {
            assert.strictEqual(title,'Awesome Title paper','Titles are different');
            return paper.summary.call();
        }).then(function (summary) {
            assert.strictEqual(summary,'Best abstract','Abstracts are different');
        });
    });
});