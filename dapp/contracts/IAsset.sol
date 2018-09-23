pragma solidity ^0.4.23;

import "./IAddress.sol";

interface IAsset {
    function getAddress() external view returns (IAddress);
    function setAddress(IAddress location) external;
}