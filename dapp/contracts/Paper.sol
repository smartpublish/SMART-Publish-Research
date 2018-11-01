pragma solidity ^0.4.25;

import "./AssetFile.sol";

contract Paper is AssetFile {

    // @dev public generates getters automatically
    string public title;
    // @dev abstract is a reserved keyword
    string public summary;

    struct Comment {
        string message;
        address author;
        uint256 timestamp;
    }

    Comment[] private comments;

    constructor() public {
    }

    function init(string _title, string _abstract, string _fileSystemName, string _publicLocation, string _summaryHashAlgorithm, string _summaryHash) external {
        title = _title;
        summary = _abstract;
        addFile(_fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
    }

    function setTitle(string _title) external {
        title = _title;
    }

    function setAbstract(string _abstract) external {
        summary = _abstract;
    }

    function addComment(string message) public {
        comments.push(Comment(message, msg.sender, now));
    }

    function getCommentsCount() public constant returns(uint) {
        return comments.length;
    }

    function getComments(uint index) public constant returns(string, address, uint256) {
        Comment memory comment = comments[index];
        return (comment.message, comment.author, comment.timestamp);
    }

}