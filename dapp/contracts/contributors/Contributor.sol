pragma solidity ^0.5.0;

import "../support/Ownable.sol";

contract Contributor is Ownable {

    string public ORCID;

    constructor(address sender) Ownable(sender) public {}

    function setORCID(string calldata _ORCID) onlyOwner external {
        ORCID = _ORCID;
    } 
}
