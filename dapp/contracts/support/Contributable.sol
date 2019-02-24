pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./Invitable.sol";
import "../contributors/Contributor.sol";
import "../contributors/Contributors.sol";
import "../../libraries/HashSet.sol";

contract Contributable is Ownable, Invitable {

    Contributors public contributorRegistry;
    HashSet.data private contributors;

    constructor(Contributors _contributors, Contributor _contributor) Ownable() public {
        contributorRegistry = _contributors;
        add(_contributor);
    }

    function add(Contributor _contributor) private {
        HashSet.add(contributors, address(_contributor));
    }

    function getContributorCount() public view returns (uint) {
        return HashSet.size(contributors);
    }

    function getContributors() public view returns (address[] memory) {
        return HashSet.toArray(contributors);
    }

    function getContributor(uint index) public view returns(address) {
        return HashSet.get(contributors, index);
    }

    function addInvitation(bytes32 _hashedCode, uint256 _expiresInSeconds) public onlyOwner {
        createInvitation(_hashedCode, _expiresInSeconds);
    }

    function join(string memory _code, string memory _contributorId) public {
        Contributor contributor = contributorRegistry.getOrCreateContributor(msg.sender, _contributorId);
        require(!HashSet.contains(contributors, address(contributor)), "You are already a contributor");
        consumeInvitation(_code);
        add(contributor);
    }
}
