pragma solidity ^0.4.24;

import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IAsset.sol";

contract AssetFactory is Ownable, CloneFactory {

    event AssetCreated(address newAssetAddress, address template);

    mapping(string => address) internal assetRegistry;

    function register(string objectType, address object) external  {
        assetRegistry[objectType] = object;
    }

    function create(string objectType) external returns(IAsset) {
        address template = assetRegistry[objectType];
        address clone = createClone(template);
        IAsset asset = IAsset(clone);
        emit AssetCreated(clone, template);
        return asset;
    }

    constructor () public { }

}