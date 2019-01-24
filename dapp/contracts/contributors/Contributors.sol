pragma solidity ^0.5.0;

import "./Contributor.sol";

contract Contributors {

    mapping(address => Contributor) internal contributorsByOwner;
    mapping(string => Contributor) internal contributorsByIdentifier;

    event ContributorCreated(Contributor contributor);

    function createContributor(string memory _identifier) public returns (Contributor) {
        Contributor contributor = new Contributor(_identifier);
        contributor.transferOwnership(tx.origin);
        address owner = contributor.owner();
        require(contributorsByOwner[owner] == Contributor(address(0)), "Owner is already a contributor");
        require(contributorsByIdentifier[_identifier] == Contributor(address(0)), "Identifier already associated with contributor");
        contributorsByOwner[owner] = contributor;
        contributorsByIdentifier[_identifier] = contributor;

        emit ContributorCreated(contributor);
        return contributor;
    }

    function getContributorByOwner(address owner) public view returns (Contributor) {
        Contributor contributor = contributorsByOwner[owner];
        require(contributor != Contributor(address(0)), "Contributor does not exists");
        return contributor;
    } 

    function getContributorByIdentifier(string memory _identifier) public view returns (Contributor) {
        Contributor contributor = contributorsByIdentifier[_identifier];
        require(contributor != Contributor(address(0)), "Contributor does not exists");
        return contributor;
    }

    function getOrCreateContributor(address owner, string memory _identifier) public returns (Contributor) {
        Contributor contributor = contributorsByOwner[owner];
        if(contributor == Contributor(address(0)) && contributorsByIdentifier[_identifier] == Contributor(address(0))) {
            contributor = createContributor(_identifier);
        }
        return contributor;
    }
}