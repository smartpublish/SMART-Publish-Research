pragma solidity ^0.5.0;

import "./Contributor.sol";

contract Contributors {

    ContributorOracle private oracle;
    mapping(address => Contributor) internal contributorsByOwner;
    mapping(address => bool) internal existence;
    mapping(string => Contributor[]) internal contributorsByORCID;

    event ContributorCreated(address owner, Contributor contributor);

    constructor () public { 
        oracle = new ContributorOracle();
    }

    function createContributor() external returns (Contributor) {
        Contributor contributor = new Contributor(oracle);
        address owner = contributor.owner();
        require(contributorsByOwner[owner] == Contributor(address(0)), "Owner already contains a contributor");
        contributorsByOwner[owner] = contributor;
        existence[address(contributor)] = true;
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