pragma solidity ^0.5.0;

import "./Contributor.sol";

contract Contributors {

    mapping(address => Contributor) internal contributorsByOwner;
    mapping(string => Contributor) internal contributorsByORCID;

    event ContributorCreated(Contributor contributor);

    function createContributor(string calldata _ORCID) external returns (Contributor) {
        Contributor contributor = new Contributor(msg.sender);
        address owner = contributor.owner();
        require(contributorsByOwner[owner] == Contributor(address(0)), "Owner already contains a contributor");
        require(contributorsByORCID[_ORCID] == Contributor(address(0)), "ORCID already associated with contributor");
        contributorsByOwner[owner] = contributor;
        contributorsByORCID[_ORCID] = contributor;
        //contributor.setORCID(_ORCID);
        address(contributor).delegatecall(abi.encodeWithSignature("setORCID(string)", _ORCID));
        
        emit ContributorCreated(contributor);
    }

    function getContributorByOwner(address owner) public view returns (Contributor) {
        Contributor contributor = contributorsByOwner[owner];
        require(contributor != Contributor(address(0)), "Contributor does not exists");
        return contributor;
    } 

    function getContributorByORCID(string memory ORCID) public view returns (Contributor) {
        Contributor contributor = contributorsByORCID[ORCID];
        require(contributor != Contributor(address(0)), "Contributor does not exists");
        return contributor;
    }
}