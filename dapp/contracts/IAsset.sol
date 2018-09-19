pragma solidity ^0.4.23;

import "./IAddress.sol";

interface IAsset {

    // @dev newInstance is from AssetFactory because Solidity does not allow inheritance between interfaces
    // TODO When solidity allow inheritance between interfaces extract it to one
    function newInstance() external returns (IAsset);

    function getAddress() external view returns (IAddress);
    function setAddress(IAddress location) external;
}