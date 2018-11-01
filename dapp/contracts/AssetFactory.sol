pragma solidity ^0.4.25;

import "@optionality.io/clone-factory/contracts/CloneFactory.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IAsset.sol";
import "./AssetWorkflow.sol";
import "./Paper.sol";

contract AssetFactory is Ownable, CloneFactory {

    mapping(string => address) internal assetTypeRegistry;

    struct AssetMetadata {
        IAsset asset;
        AssetWorkflow[] workflows;
    }

    mapping(address => AssetMetadata[]) internal assetByCreator;

    event AssetCreated(address assetAddress, string assetType);

    constructor () public { }

    function register(string objectType, address object) external  {
        assetTypeRegistry[objectType] = object;
    }

    function createPaper(
        string _title,
        string _summary,
        string _fileSystemName,
        string _publicLocation,
        string _summaryHashAlgorithm,
        string _summaryHash,
        AssetWorkflow _workflow) public returns(Paper) {

        Paper paper = new Paper();
        paper.init(
            _title,
            _summary,
            _fileSystemName,
            _publicLocation,
            _summaryHashAlgorithm,
            _summaryHash
        );

        AssetWorkflow[] memory assetWorkflows = new AssetWorkflow[](1);
        assetWorkflows[0] = _workflow;

        assetByCreator[msg.sender].push(AssetMetadata(paper, assetWorkflows)) - 1;
        _workflow.start(paper);

        emit AssetCreated(paper, 'paper');
        return paper;
    }

}