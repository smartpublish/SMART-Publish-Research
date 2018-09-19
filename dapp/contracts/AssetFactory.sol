pragma solidity ^0.4.24;

import "./IAsset.sol";

contract AssetFactory {

    mapping(string => IAsset) internal assetRegistry;

    function register(string objectType, IAsset object) external  {
        assetRegistry[objectType] = object;
    }

    function create(string objectType) external returns(IAsset) {
        assetRegistry[objectType].newInstance();
    }

}