pragma solidity ^0.5.2;

import "./Paper.sol";

contract Work {

    struct Review {
        address _reviewer;
        uint _reviewResult;
        string _identifier;
        string _comments;
        string _signature;
    }

    struct Asset {
        string _fileName;
        string _fileSystemName;
        string _publicLocation;
        string _summaryHashAlgorithm;
        string _summaryHash;
    }

    bool public isClosed;
    Paper public parent;
    mapping(string => uint) assetsIndex;
    Asset[] private assets;
    Review[] private reviews;

    constructor(Paper _parent) public {
        parent = _parent;
    }

    /**
     * @dev Throws if called by any account other than the parent owner.
     */
    modifier onlyParentOwner() {
        require(msg.sender == parent.owner(), "Only parent Owner can perform this action");
        _;
    }

    function close() external onlyParentOwner {
        require(!isClosed, "Work is already closed");
        isClosed = true;
    }

    function addAsset(
            string memory _fileName,
            string memory _fileSystemName,
            string memory _publicLocation,
            string memory _summaryHashAlgorithm,
            string memory _summaryHash
    ) public onlyParentOwner {
        require(!isClosed, "This work is closed");
        if(assetsIndex[_fileName] > 0) {
            // Update asset
            Asset storage asset = assets[assetsIndex[_fileName]-1];
            asset._fileSystemName = _fileSystemName;
            asset._publicLocation = _publicLocation;
            asset._summaryHashAlgorithm = _summaryHashAlgorithm;
            asset._summaryHash = _summaryHash;
        } else {
            // Create new asset
            uint length = assets.push(
                Asset(_fileName, 
                    _fileSystemName, 
                    _publicLocation, 
                    _summaryHashAlgorithm, 
                    _summaryHash)
                );
            assetsIndex[_fileName] = length;
        }
    }

    function assetCount() public view returns(uint) {
        return assets.length;
    }

    function getAsset(uint index) public view returns(
            string memory _fileName,
            string memory _fileSystemName,
            string memory _publicLocation,
            string memory _summaryHashAlgorithm,
            string memory _summaryHash
    ) {
        Asset memory asset = assets[index];
        return (asset._fileName, 
            asset._fileSystemName, 
            asset._publicLocation, 
            asset._summaryHashAlgorithm,
            asset._summaryHash);
    }

    function addReview(
                address payable _reviewer,
                uint _reviewResult,
                string calldata _identifier,
                string calldata _comments,
                string calldata _signature
    ) external {
        require(isClosed, "This work is still open and can not be reviewed");
        reviews.push(
            Review(_reviewer,
                _reviewResult,
                _identifier,
                _comments,
                _signature)
        );
        parent.onReviewed(_reviewer, _identifier, _reviewResult);
    }

    function reviewCount() public view returns(uint) {
        return reviews.length;
    }

    function getReview(uint index) public view returns(
            address _reviewer,
            uint _reviewResult,
            string memory _identifier,
            string memory _comments,
            string memory _signature
    ) {
        Review memory review = reviews[index];
        return (review._reviewer, review._reviewResult, review._identifier, review._comments, review._signature);
    }
}