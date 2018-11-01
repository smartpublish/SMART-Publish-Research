pragma solidity ^0.4.25;

import "./IAsset.sol";

// @title Any asset type (eg: a paper, ...)
contract AssetFile is IAsset {

    // @dev file data for this asset
    struct File {
        string fileName;
        string fileSystemName;
        string publicLocation;
        string summaryHashAlgorithm;
        string summaryHash;
    }

    File[] files;

    function addFile(string _fileSystemName, string _publicLocation, string _summaryHashAlgorithm, string _summaryHash) public returns(uint) {
        files.length++;
        files[files.length - 1].fileSystemName = _fileSystemName;
        files[files.length - 1].publicLocation = _publicLocation;
        files[files.length - 1].summaryHashAlgorithm = _summaryHashAlgorithm;
        files[files.length - 1].summaryHash = _summaryHash;
        return files.length;
    }

    function getFileCount() public constant returns(uint) {
        return files.length;
    }

    function getFile(uint index) public constant returns(string, string, string, string) {
        File memory file = files[index];
        return (file.fileSystemName, file.publicLocation, file.summaryHashAlgorithm, file.summaryHash);
    }

}