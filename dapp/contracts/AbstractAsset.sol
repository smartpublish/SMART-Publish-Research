pragma solidity ^0.4.24;

import "./IAsset.sol";

// @title Any asset type (eg: a paper, ...)
contract AbstractAsset is IAsset {

    // @dev "Filesystem" address
    IAddress private addr;

    constructor(IAddress _addr) public {
        addr = _addr;
    }

    function getAddress() external view returns (IAddress) {
        return addr;
    }

    function setAddress(IAddress location) external {
        addr = location;
    }
}