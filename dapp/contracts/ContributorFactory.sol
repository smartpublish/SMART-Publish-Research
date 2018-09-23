pragma solidity ^0.4.24;

import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IContributor.sol";

contract ContributorFactory is Ownable, CloneFactory {

    event ContributorCreated(address newContributorAddress, address libraryAddress);

    mapping(string => address) internal usersRegistry;

    function register(string objectType, address object) external  {
        usersRegistry[objectType] = object;
    }

    function create(string objectType) external returns(IContributor) {
        address template = usersRegistry[objectType];
        address clone = createClone(template);
        IContributor contributor = IContributor(clone);
        contributor.init();
        emit ContributorCreated(clone, template);
        return contributor;
    }

    constructor () public { }

}