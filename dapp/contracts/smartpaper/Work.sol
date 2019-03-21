pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Paper.sol";

contract Work {

    struct Review {
        string _identifier;
        address _reviewer;
        string[] _majorComments;
        string[] _minorComments;
        bool _isAccepted;
        string _signature;
    }

    struct Asset {
        string _fileName;
        string _fileSystemName;
        string _publicLocation;
        string _summaryHashAlgorithm;
        string _summaryHash;
    }

    Paper private parent;
    Asset[] private assets;
    Review[] private reviews;
    
    function addReview(Review calldata _review) external {
        parent.contabilizeReview(msg.sender, _review._identifier);
        reviews.push(_review);
    }

    function getReviews() public returns(Review[] memory) {
        return reviews;
    }
}