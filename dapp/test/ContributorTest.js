var truffleAssert = require('truffle-assertions');

var Contributors = artifacts.require('Contributors');

contract('ContributorsTest', function() {
    it("should create new Contributor", function () {
        return Contributors.deployed().then(function (instance) {
            instance.createContributor().then(function (tx) {
                truffleAssert.eventEmitted(tx, 'ContributorCreated', function (e) {
                    return e.address !== undefined && e.contributor !== undefined;
                });
        });
    });
});
});