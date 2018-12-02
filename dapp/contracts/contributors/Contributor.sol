pragma solidity ^0.5.0;

import "./ContributorOracle.sol";
import "../support/Ownable.sol";

contract Contributor is Ownable {

    ContributorOracle private oracle;
    string public ORCID;

    constructor(ContributorOracle _oracle) public {
        oracle = _oracle;
    }

    function validateORCID(string memory _ORCID) public payable {
        oracle.validateORCID(_ORCID, this);
    }

    function setORCID(string calldata _ORCID) external {
        require(oracle.owner() == msg.sender, "Expected call by oracle");
        ORCID = _ORCID;
    } 
}
