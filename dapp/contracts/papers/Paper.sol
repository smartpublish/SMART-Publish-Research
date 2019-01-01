pragma solidity ^0.5.0;

import "../assets/Asset.sol";
import "../support/Invitable.sol";
import "../contributors/Contributor.sol";
import "../contributors/Contributors.sol";

contract Paper is Asset {

    constructor(
        Contributors _contributors,
        Contributor _contributor,
        string memory _title,
        string memory _summary) Asset(_contributors, _contributor, _title, _summary) public {}

    function setAbstract(string calldata _abstract) external {
        summary = _abstract;
    }

    function getAbstract() external view returns(string memory) {
        return summary;
    }
}