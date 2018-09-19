pragma solidity ^0.4.24;

import "./IContributor.sol";

contract UserFactory {

    mapping(string => IContributor) internal usersRegistry;

    function register(string objectType, IContributor object) external  {
        usersRegistry[objectType] = object;
    }

    function create(string objectType) external returns(IContributor) {
        usersRegistry[objectType].newInstance();
    }
}