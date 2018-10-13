pragma solidity ^0.4.23;

import "./ILocation.sol";

interface IAsset {
    // function init(ILocation _location, string _title, string _abstract) external;
    function init(string _location, string _title, string _abstract) external;
    // function setLocation(ILocation _location) external;
    function setLocation(string _location) external;
}