pragma solidity ^0.4.24;

import "./AssetFile.sol";

contract Paper is AssetFile {

    // @dev public generates getters automatically
    string public title;
    // @dev abstract is a reserved keyword
    string public summary;

    constructor() public {
    }

    function init(string _title, string _abstract, string _fileSystemName, string _publicLocation, string _summaryHashAlgorithm, string _summaryHash) external {
        title = _title;
        summary = _abstract;
        this.addFile(_fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
    }

    function setTitle(string _title) external {
        title = _title;
    }

    function setAbstract(string _abstract) external {
        summary = _abstract;
    }

}