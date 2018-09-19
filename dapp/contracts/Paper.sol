pragma solidity ^0.4.24;
import "./AbstractAsset.sol";

contract Paper is AbstractAsset {

    string private title;

    // @dev abstract is a reserved keyword
    string private summary;

    constructor(IAddress _addr, string _title, string _abstract) AbstractAsset(_addr) public {
        title = _title;
        summary = _abstract;
    }

    function getTitle() external view returns(string) {
        return title;
    }

    function setTitle(string _title) external {
        title = _title;
    }

    function getAbstract() external view returns(string) {
        return summary;
    }

    function setAbstract(string _abstract) external {
        summary = _abstract;
    }
}