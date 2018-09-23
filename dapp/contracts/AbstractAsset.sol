pragma solidity ^0.4.24;

import "./IAsset.sol";
import "./ILocation.sol";

// @title Any asset type (eg: a paper, ...)
contract AbstractAsset is IAsset {

    // @dev "Filesystem" address
    ILocation private location;

    constructor() internal { }

    function getLocation() external view returns (ILocation) {
        return location;
    }

    function setLocation(ILocation _location) public {
        location = _location;
    }
}