pragma solidity ^0.4.24;

import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IAsset.sol";

contract AssetFactory is Ownable, CloneFactory {

    mapping(string => address) internal assetTypeRegistry;
    mapping(address => address[]) internal assetByCreator;

    event AssetCreated(address assetAddress);

    function register(string objectType, address object) external  {
        assetTypeRegistry[objectType] = object;
    }

    function create(string objectType) external returns(IAsset) {
        // Create a new asset instance
        address template = assetTypeRegistry[objectType];
        address clone = createClone(template);
        IAsset asset = IAsset(clone);
        assetByCreator[msg.sender].push(asset) - 1;
        emit AssetCreated(clone);
        return asset;
    }

    function findAsset(address user) view public returns (address[]){
        return assetByCreator[user];
    }

    constructor () public { }

}