pragma solidity ^0.5.0;

import "./IAsset.sol";
import "../support/Contributable.sol";
import "../support/Actionable.sol";
import "../support/Archivable.sol";
import "../contributors/Contributor.sol";
import "../contributors/Contributors.sol";

contract Asset is IAsset, Archivable, Actionable, Contributable {
    
    string public title;
    string public summary;
    string[] public keywords;

    constructor(
        Contributors _contributors,
        Contributor _contributor,
        string memory _title, 
        string memory _summary) Contributable(_contributors, _contributor) public {
            title = _title;
            summary = _summary;
        }

    function setTitle(string calldata _title) external {
        title = _title;
    }

    function setSummary(string calldata _abstract) external {
        summary = _abstract;
    }

    function getKeywordsCount() external view returns(uint) {
        return keywords.length;
    }

    function addKeyword(string calldata _keyword) external {
        keywords.push(_keyword);
    }

    function removeKeywords(uint index) external {
        keywords[index] = keywords[keywords.length - 1];
        delete keywords[keywords.length - 1];
        keywords.length--;
    }
}