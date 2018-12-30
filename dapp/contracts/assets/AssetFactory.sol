pragma solidity ^0.5.0;

import "./IAsset.sol";
import "./AssetWorkflow.sol";
import "../papers/Paper.sol";
import "../contributors/Contributors.sol";

contract AssetFactory {

    Contributors private contributors;

    mapping(address => IAsset[]) internal assetByCreator;

    event AssetCreated(address assetAddress, string assetType);

    constructor (Contributors _contributors) public { 
        contributors = _contributors;
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
        Paper paper = new Paper(contributors, contributor);
        paper.init(_title, _summary, _fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
        paper.addWorkflow(_workflow);
        _workflow.start(paper);
        paper.transferOwnership(msg.sender);

        assetByCreator[msg.sender].push(paper);
        emit AssetCreated(address(paper), 'paper');
        return paper;
    }

    function getAssetsByCreator(address creator) public view returns(IAsset[] memory) {
        return assetByCreator[creator];
    }
}