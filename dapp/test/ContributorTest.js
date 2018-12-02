var truffleAssert = require('truffle-assertions');

var Contributors = artifacts.require('Contributors');
const AssertionError = require('assertion-error');

contract('ContributorsTest', function() {
    var deployed;
    beforeEach(async function() {
        deployed = await Contributors.new()
    });


    it("should create new Contributor", async function () {
        let tx = await deployed.createContributor()
        truffleAssert.eventEmitted(tx, 'ContributorCreated');
    });

    it("should return Contributor by its address", async function() {
        let tx = await deployed.createContributor()
        let event = eventsOf(tx, 'ContributorCreated')[0]
        let contributor = await deployed.getContributorByOwner.call(event.address)
        assertEquals(event.contributor, contributor.address)
    });

    it("should fail when same owner create two contributors", async function() {
        let tx1 = await deployed.createContributor()
        truffleAssert.reverts(deployed.createContributor,'Owner already contains a contributor')
    });
});


function eventsOf(tx, type) {
    return tx.logs.filter((entry) => {
        return entry.event === type;
      });
}

function assertEquals(one, other) {
    if(one != other) throw new AssertionError('Expected equals: ' + one + " != " + other);
}