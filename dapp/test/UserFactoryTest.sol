pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/UserFactory.sol";
import "../contracts/Researcher.sol";
import "../contracts/Organization.sol";

contract UserFactoryTest {

    function testCreateResearcher() public {
        UserFactory userFactory = new UserFactory();
        userFactory.register("resercher",new Researcher());
        userFactory.register("organization", new Organization());

        IContributor resercher1 = Researcher(userFactory.create("resercher"));
        IContributor resercher2 = Researcher(userFactory.create("resercher"));

        IContributor organization1 = Organization(userFactory.create("organization"));
        IContributor organization2 = Organization(userFactory.create("organization"));

        // Todo asserts
    }

    function testCreateOrganization() public {

    }

}