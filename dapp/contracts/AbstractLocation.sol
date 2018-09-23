pragma solidity ^0.4.24;

import "./ILocation.sol";

contract AbstractLocation is ILocation {
    string private location;

    constructor(string _location) public {
        location = _location;
    }

    function getLocation() external view returns (string) {
        return location;
    }

    function setLocation(string _location) external {
        location = _location;
    }

}