pragma solidity ^0.5.0;

import "./Contributor.sol";

contract Contributors {

    mapping(address => Contributor) internal contributorsByOwner;
    mapping(string => Contributor[]) internal contributorsByORCID;

    event ContributorCreated(address owner, Contributor contributor);

    constructor () public { }

    function createContributor(Contributor contributor) external  {
        address owner = contributor.owner();
        string memory ORCID = contributor.ORCID();
        require(contributorsByOwner[owner] == Contributor(address(0)), "Owner contains contributor");
        contributorsByOwner[owner] = contributor;
        contributorsByORCID[ORCID].push(contributor);
        emit ContributorCreated(owner, contributor);
    }

    function getContributorByOwner(address owner) public view returns (Contributor) {
        Contributor contributor = contributorsByOwner[owner];
        require(contributor != Contributor(address(0)), "Contributor does not exists");
        return contributor;
    } 

    function getContributorsByORCID(string memory ORCID) public view returns (Contributor[] memory) {
        Contributor[] memory contributors = contributorsByORCID[ORCID];
        require(contributors.length > 0, "Contributor does not exists");
        return contributors;
    }
}