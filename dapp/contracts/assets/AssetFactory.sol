pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./IAsset.sol";
import "./AssetWorkflow.sol";
import "../papers/Paper.sol";
import "../contributors/Contributors.sol";

contract AssetFactory {

    Contributors private contributors;
    mapping(address => IAsset[]) internal assetByCreator;
    IAsset[] internal assets;
    mapping(string => IAsset[]) assetByKeywords;

    event AssetCreated(IAsset asset, string assetType, address indexed sender);

    constructor (Contributors _contributors) public { 
        contributors = _contributors;
    }

    function getAssetsByCreator(address creator) public view returns(IAsset[] memory) {
        return assetByCreator[creator];
    }

    function getAssetsCount() public view returns(uint) {
        return assets.length;
    }

    function getAsset(uint index) public view returns(IAsset) {
        return assets[index];
    }

    function getAssets() public view returns(IAsset[] memory) {
        return assets;
    }

    function createPaper(
        string memory _title,
        string memory _summary,
        string memory _abstract,
        string memory _fileSystemName,
        string memory _publicLocation,
        string memory _summaryHashAlgorithm,
        string memory _summaryHash,
        string memory _topic,
        string[] memory _keywords,
        AssetWorkflow _workflow,
        string memory _contributorId) public returns(Paper) {
        
        Contributor contributor = contributors.getOrCreateContributor(msg.sender, _contributorId);
        Paper paper = new Paper(contributors, contributor, _title, _summary, _abstract, _topic);
        paper.addFile(_fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
        paper.addWorkflow(_workflow);
        _workflow.start(paper);
        paper.transferOwnership(msg.sender);

        assetByCreator[msg.sender].push(paper);
        assets.push(paper);
        addKeywords(paper, _keywords);
        emit AssetCreated(paper, 'paper', msg.sender);
        return paper;
    }

    function addKeywords(IAsset _asset, string[] memory _keywords) public {
        uint length = _keywords.length;
        for(uint i = 0; i < length; i++) {
            string memory keyword = _keywords[i];
            _asset.addKeyword(keyword);
            assetByKeywords[keyword].push(_asset);
        }
    }

    function removeKeywords(IAsset _asset, string[] memory _keywords) public {
        uint length = _keywords.length;
        for(uint i = 0; i < length; i++) {
            string memory keyword = _keywords[i];
            uint assets_length = assetByKeywords[keyword].length;
            for(uint j = 0; j < assets_length; j++) {
                if(assetByKeywords[keyword][j] == _asset) {
                    assetByKeywords[keyword][j] = assetByKeywords[keyword][assets_length - 1];
                    delete assetByKeywords[keyword][assetByKeywords[keyword].length - 1];
                    assetByKeywords[keyword].length--;
                }
            }
        }
        // TODO: Remove keyword from asset
        // _asset.removeKeywords(_keywords)
    }

    function getAssetsByKeywords(string[] memory _keywords) public view returns(IAsset[] memory) {
        uint length = 0;
        for(uint i = 0; i < _keywords.length; i++) {
            length += assetByKeywords[_keywords[i]].length;
        }
        IAsset[] memory result = new IAsset[](length);
        uint index = 0;
        for(uint i = 0; i < _keywords.length; i++) {
            IAsset[] memory assetByKeyword = assetByKeywords[_keywords[i]];
            length = assetByKeyword.length;
            for(uint j = 0; j < length; j++) {
                result[index] = assetByKeyword[j];
            }
        }
        return result;
    }

}