pragma solidity ^0.4.24;

import "./AbstractAddress.sol";

contract IPFSAddress is AbstractAddress {
    constructor(string addr) AbstractAddress(addr) public {}
}