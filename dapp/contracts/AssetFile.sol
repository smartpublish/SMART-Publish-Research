pragma solidity ^0.5.0;

import "./Asset.sol";

// @title Any asset type (eg: a paper, ...)
contract AssetFile is Asset {

    // @dev file data for this asset
    struct File {
        string fileName;
        string fileSystemName;
        string publicLocation;
        string summaryHashAlgorithm;
        string summaryHash;
    }

    File[] files;

    constructor(address sender) Asset(sender) public {}

    function addFile(string memory _fileSystemName, string memory _publicLocation,
        string memory _summaryHashAlgorithm, string memory _summaryHash) public returns(uint) {

        files.length++;
        files[files.length - 1].fileSystemName = _fileSystemName;
        files[files.length - 1].publicLocation = _publicLocation;
        files[files.length - 1].summaryHashAlgorithm = _summaryHashAlgorithm;
        files[files.length - 1].summaryHash = _summaryHash;
        return files.length;
    }

    function getFileCount() public view returns(uint) {
        return files.length;
    }

    function getFile(uint index) public view returns(string memory, string memory, string memory, string memory) {
        File memory file = files[index];
        return (file.fileSystemName, file.publicLocation, file.summaryHashAlgorithm, file.summaryHash);
    }

}