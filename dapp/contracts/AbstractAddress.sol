pragma solidity ^0.4.24;

import "./IAddress.sol";

contract AbstractAddress is IAddress {
    string private addr;

    constructor(string _addr) public {
        addr = _addr;
    }

    function getAddress() external view returns (string) {
        return addr;
    }

    function setAddress(string location) external {
        addr = location;
    }

}