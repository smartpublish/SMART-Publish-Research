pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Work is Ownable {

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

    enum FieldType { String, Number, Address, ArrayString, ArrayNumber, ArrayAddress }
    struct Field {
        string _name;
        FieldType _type;
        bytes _value;
    }

    bool public isClosed;
    Work parent;
    mapping(string => uint) assetsIndex;
    Asset[] private assets;
    Review[] private reviews;
    mapping(string => Field) fieldsByName;

    function getFieldValue(string memory _name) public view returns(bytes memory) {
        return fieldsByName[_name]._value;
    }

    function getFieldType(string memory _name) public view returns(FieldType) {
        return fieldsByName[_name]._type;
    }

    function setFieldValue(string memory _name, FieldType _type, bytes memory _value) public {
        fieldsByName[_name] = Field(_name, _type, _value);
    }

    /**
     * @dev Throws if called by any account other than the parent owner.
     */
    modifier onlyParentOwner() {
        require(msg.sender == parent.owner(), "Only parent Owner can perform this action");
        _;
    }

    /**
     * @dev Throws if called by someone whom has paper authorship.
     */
    modifier onlyNotAuthorship() {
        /*
        (address author, address[] memory coAuthors, address[] memory contributors) = parent.getAuthorship();
        require(msg.sender != author, "Author can not perform this action");
        
        for(uint i = 0; i < coAuthors.length; i++) {
            require(msg.sender != coAuthors[i], "Co-authors can not perform this action");
        }
        
        for(uint i = 0; i < contributors.length; i++) {
            require(msg.sender != contributors[i], "Contributors can not perform this action");
        }
        */
        _;
    }

    function close() external onlyParentOwner {
        require(!isClosed, "Work is already closed");
        require(assets.length > 0, "Work must contains at least one asset");
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
                uint _reviewResult,
                string memory _identifier,
                string memory _comments,
                string memory _signature
    ) public onlyNotAuthorship {
        require(isClosed, "This work is still open and can not be reviewed");
        // (address author, address[] memory coAuthors, address[] memory contributors) = parent.getAuthorship();
        // require(author != address(0), "This paper need an author before it could be reviewed");
        reviews.push(
            Review(msg.sender,
                _reviewResult,
                _identifier,
                _comments,
                _signature)
        );
        // parent.onReviewed(msg.sender, _identifier, _reviewResult);
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