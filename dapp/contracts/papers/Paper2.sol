pragma solidity ^0.5.0;

import "../assets/Asset.sol";
import "../support/Invitable.sol";
import "../contributors/Contributor.sol";
import "../contributors/Contributors.sol";

contract Paper2 is Asset {

    // @dev abstract is a Solidity reserved keyword
    string public abstrakt;
    string public topic;

    constructor(
        Contributors _contributors,
        Contributor _contributor,
        string memory _title,
        string memory _summary,
        string memory _abstract,
        string memory _topic) Asset(_contributors, _contributor, _title, _summary) public {
            abstrakt = _abstract;
            topic = _topic;
        }

    function setAbstract(string calldata _abstract) external {
        abstrakt = _abstract;
    }

    function data() external view returns(string memory _title, string memory _summary, 
        string memory _abstrakt, string memory _topic, address _owner) {
        return (title, summary, abstrakt, topic, this.owner());
    }
}