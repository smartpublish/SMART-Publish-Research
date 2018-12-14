pragma solidity ^0.5.0;

import "../support/Ownable.sol";

contract Contributor is Ownable {

    string public identifier;

    constructor(address sender) Ownable(sender) public {}

    function setIdentifier(string calldata _identifier) onlyOwner external {
        identifier = _identifier;
    } 
}
