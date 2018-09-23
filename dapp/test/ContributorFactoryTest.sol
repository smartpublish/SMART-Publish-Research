pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/ContributorFactory.sol";
import "../contracts/Researcher.sol";
import "../contracts/Organization.sol";

// TODO Improve tests
contract ContributorFactoryTest {

    function testCreateResearcher() public {
        ContributorFactory factory = new ContributorFactory();
        factory.register("researcher", DeployedAddresses.Researcher());
        Researcher clone = Researcher(factory.create("rsearcher"));

        Assert.notEqual(clone, DeployedAddresses.Researcher(), "The instances should have different address");
    }

    function testCreateOrganization() public {
        ContributorFactory factory = new ContributorFactory();
        factory.register("organization", DeployedAddresses.Organization());
        Researcher clone = Researcher(factory.create("organization"));

        Assert.notEqual(clone, DeployedAddresses.Researcher(), "The instances should have different address");
    }

}