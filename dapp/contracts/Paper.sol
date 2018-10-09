pragma solidity ^0.4.24;

import "./AbstractAsset.sol";
import "./ILocation.sol";

contract Paper is AbstractAsset {

    // @dev public generates getters automatically
    string public title;
    // @dev abstract is a reserved keyword
    string public summary;

    constructor() public {
    }

    function init(ILocation _location, string _title, string _abstract) external {
        location = _location;
        title = _title;
        summary = _abstract;
    }

    function setTitle(string _title) external {
        title = _title;
    }

    function setAbstract(string _abstract) external {
        summary = _abstract;
    }

}