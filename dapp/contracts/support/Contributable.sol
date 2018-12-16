pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./Invitable.sol";
import "../contributors/Contributor.sol";
import "../contributors/Contributors.sol";

contract Contributable is Ownable, Invitable {

    Contributor[] public contributors;

    constructor(Contributor contributor) Ownable(address(contributor.owner)) public {
        contributors.push(contributor);
    }

    function addInvitation(bytes32 _hashedCode, uint256 _expiresInSeconds) public onlyOwner {
        createInvitation(_hashedCode, _expiresInSeconds);
    }

    //TODO _contributors as parameter is hackeable, (fake contract same abi is enought)
    function join(Contributors _contributors, string memory _code) public {
        Contributor contributor = _contributors.getContributorByOwner(address(msg.sender));
        consumeInvitation(_code);
        contributors.push(contributor);
    }
}
