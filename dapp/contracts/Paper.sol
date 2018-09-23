pragma solidity ^0.4.24;

import "./AbstractAsset.sol";
import "./ILocation.sol";

contract Paper is AbstractAsset {

    string private title;

    // @dev abstract is a reserved keyword
    string private summary;

    constructor() public { }

    function init(ILocation _location, string _title, string _abstract) public {
        this.setLocation(_location);
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