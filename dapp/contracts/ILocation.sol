pragma solidity ^0.4.23;

// @title Address on any system: EThereum, IPSF, ...
interface ILocation {
    function getLocation() external view returns (string);
    function setLocation(string _location) external;
}