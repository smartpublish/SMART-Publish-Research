var truffleAssert = require('truffle-assertions');

var Contributors = artifacts.require('Contributors');
var Contributor = artifacts.require('Contributor');

const AssertionError = require('assertion-error');

contract('ContributorTest', function(accounts) {
    console.log(accounts)
    var deployed;
    beforeEach(async function() {
        deployed = await Contributors.new()
    });


    it("should create new Contributor", async function () {
        let tx = await deployed.createContributor("0000-0002-1825-0097",{from: accounts[1] })
        truffleAssert.eventEmitted(tx, 'ContributorCreated');
    });

    it("should return Contributor by its Owner address", async function() {
        let tx = await deployed.createContributor("0000-0002-1825-0097",{from: accounts[1] })
        let event = eventsOf(tx, 'ContributorCreated')[0]
        let contributor = await deployed.getContributorByOwner.call(accounts[1])
        assertEquals(event.contributor, contributor.address)
    });

    it("should return Contributor by Identifier", async function() {
        let tx = await deployed.createContributor("0000-0002-1825-0097", {from: accounts[1] })
        let event = eventsOf(tx, 'ContributorCreated')[0]
        let contributor = await deployed.getContributorByIdentifier.call("0000-0002-1825-0097")
        assertEquals(event.contributor, contributor.address)
    });

    it("should fail when same owner create two contributors", async function() {
        await deployed.createContributor("0000-0002-1825-0097", {from: accounts[1] })
        await truffleAssert.reverts(deployed.createContributor("0000-0002-1825-0098", {from: accounts[1] }),'Owner is already a contributor')
    });

    it("owner should not be undefined", async function() {
        await deployed.createContributor("0000-0002-1825-0097", {from: accounts[1] })
        let address = await deployed.getContributorByIdentifier.call("0000-0002-1825-0097")
        let contributor = await Contributor.at(address)
        let owner = await contributor.owner.call()
        if(owner === undefined) throw new AssertionError("Expected not undefined")
    });

    it("should fail when same Identifier create two contributors", async function() {
        await deployed.createContributor("0000-0002-1825-0097", {from: accounts[1] })
        await truffleAssert.fails(deployed.createContributor("0000-0002-1825-0097", {from: accounts[2] }),'Identifier already associated with contributor')
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