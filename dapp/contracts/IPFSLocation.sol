pragma solidity ^0.4.24;

import "./AbstractLocation.sol";

contract IPFSLocation is AbstractLocation {
    constructor(string _location) AbstractLocation(_location) public {}
}