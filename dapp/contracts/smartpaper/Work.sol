pragma solidity ^0.5.0;

import "./Paper.sol";

contract Work {

    struct Review {
        address _reviewer;
        bool _isAccepted;
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
    Asset[] private assets;
    Review[] private reviews;

    constructor(Paper _parent) public {
        parent = _parent;
    }

    function close() external {
        require(!isClosed, "Work is already closed");
        require(msg.sender == address(parent.owner), "Only parent Owner can perform this action");
        isClosed = true;
    }

    function addAsset(
            string calldata _fileName,
            string calldata _fileSystemName,
            string calldata _publicLocation,
            string calldata _summaryHashAlgorithm,
            string calldata _summaryHash
    ) external {
        require(!isClosed, "This work is closed");
        require(msg.sender == address(parent.owner), "Only parent Owner can perform this action");
        assets.push(
            Asset(_fileName, 
                _fileSystemName, 
                _publicLocation, 
                _summaryHashAlgorithm, 
                _summaryHash)
            );
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
                address _reviewer,
                bool _isAccepted,
                string calldata _identifier,
                string calldata _comments,
                string calldata _signature
    ) external {
        require(isClosed, "This work is still open and can not be reviewed");
        parent.contabilizeReview(msg.sender, _identifier, _isAccepted);
        reviews.push(
            Review(_reviewer,
                _isAccepted,
                _identifier,
                _comments,
                _signature)
        );
    }

    function reviewCount() public view returns(uint) {
        return reviews.length;
    }

    function getReview(uint index) public view returns(
            address _reviewer,
            bool _isAccepted,
            string memory _identifier,
            string memory _comments,
            string memory _signature
    ) {
        Review memory review = reviews[index];
        return (review._reviewer, review._isAccepted, review._identifier, review._comments, review._signature);
    }
}