pragma solidity ^0.5.0;

import "./IAsset.sol";
import "./AssetWorkflow.sol";
import "./Paper.sol";
import "./contributors/Contributors.sol";

contract AssetFactory {

    Contributors private contributors;
    mapping(string => address) internal assetTypeRegistry;

    struct AssetMetadata {
        IAsset asset;
        AssetWorkflow[] workflows;
    }

    mapping(address => AssetMetadata[]) internal assetByCreator;

    event AssetCreated(address assetAddress, string assetType);

    constructor (Contributors _contributors) public { 
        contributors = _contributors;
    }

    function register(string calldata objectType, address object) external  {
        assetTypeRegistry[objectType] = object;
    }

    function createPaper(
        string memory _title,
        string memory _summary,
        string memory _fileSystemName,
        string memory _publicLocation,
        string memory _summaryHashAlgorithm,
        string memory _summaryHash,
        AssetWorkflow _workflow,
        string memory _contributorId) public returns(Paper) {
        
        Contributor contributor = contributors.getOrCreateContributor(msg.sender, _contributorId);
        Paper paper = new Paper(contributor);
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
        paper.addWorkflow(_workflow);

        assetByCreator[msg.sender].push(AssetMetadata(paper, assetWorkflows)) - 1;
        _workflow.start(paper);

        emit AssetCreated(address(paper), 'paper');
        return paper;
    }

}