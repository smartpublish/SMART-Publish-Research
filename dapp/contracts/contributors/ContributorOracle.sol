pragma solidity ^0.5.0;

import "./Contributor.sol";
import "../support/Ownable.sol";

contract ContributorOracle is Ownable {

    event ValidationRequest(string ORCID, Contributor contributor);

    function validateORCID(string memory _ORCID, Contributor _contributor) public payable {
        emit ValidationRequest(_ORCID, _contributor);
        //TODO Remove this line
        this.confirmValidation(_ORCID, _contributor);
    }

    function confirmValidation(string memory _ORCID, Contributor _contributor) public onlyOwner {
        _contributor.setORCID(_ORCID);
    }
}


