pragma solidity ^0.4.23;

// @title Address on any system: EThereum, IPSF, ...
interface IAddress {
    function getAddress() external view returns (string);
    function setAddress(string location) external;
}