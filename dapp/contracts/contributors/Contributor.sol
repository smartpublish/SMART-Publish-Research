pragma solidity ^0.5.0;

import "../support/Ownable.sol";

contract Contributor is Ownable {

    string public ORCID;

    constructor(string memory _ORCID) public {
        ORCID = _ORCID;
    }

}
