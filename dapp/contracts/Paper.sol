pragma solidity ^0.5.0;

import "./AssetFile.sol";
import "./support/Invitable.sol";
import "./contributors/Contributor.sol";

contract Paper is AssetFile, Invitable {

    // @dev public generates getters automatically
    string public title;
    // @dev abstract is a reserved keyword
    string public summary;

    Contributor[] contributors;

    constructor(Contributor _contributor) AssetFile(address(_contributor.owner)) public {
        contributors.push(_contributor);
    }

    function init(string calldata _title, string calldata _abstract, string calldata _fileSystemName,
        string calldata _publicLocation, string calldata _summaryHashAlgorithm, string calldata _summaryHash) external {
        
        title = _title;
        summary = _abstract;
        addFile(_fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
    }

    function addInvitation(bytes32 _hashedCode, uint256 _expiresInSeconds) onlyOwner public {
        createInvitation(_hashedCode, _expiresInSeconds);
    }

    function setTitle(string calldata _title) external {
        title = _title;
    }

    function setAbstract(string calldata _abstract) external {
        summary = _abstract;
    }

}