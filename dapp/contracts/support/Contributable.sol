pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./Invitable.sol";
import "../contributors/Contributor.sol";
import "../contributors/Contributors.sol";

contract Contributable is Ownable, Invitable {

    Contributors public contributorRegistry;
    Contributor[] public contributors;
    mapping(address => bool) private owners;

    constructor(Contributors _contributors, Contributor _contributor) Ownable() public {
        contributorRegistry = _contributors;
        add(_contributor);
    }

    modifier onlyContributors() {
        require(owners[msg.sender] == true, "You are not a contributor");
        _;
    }

    function add(Contributor _contributor) private {
        contributors.push(_contributor);
        owners[address(_contributor.owner)] = true;
    }

    function getContributorCount() public view returns (uint) {
        return contributors.length;
    }

    function getContributors() public view returns (Contributor[] memory) {
        return contributors;
    }

    function addInvitation(bytes32 _hashedCode, uint256 _expiresInSeconds) public onlyOwner {
        createInvitation(_hashedCode, _expiresInSeconds);
    }

    function join(string memory _code) public {
        Contributor contributor = contributorRegistry.getContributorByOwner(address(msg.sender));
        consumeInvitation(_code);
        add(contributor);
    }
}
