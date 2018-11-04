pragma solidity ^0.4.25;

import "./AssetWorkflow.sol";

contract PeerReviewWorkflow is AssetWorkflow {

    string constant STATE_SUMBITTED = 'Submitted';
    string constant STATE_ONREVIEW = 'OnReview';
    string constant STATE_PUBLISHED = 'Published';
    string constant STATE_REJECTED = 'Rejected';

    string constant TRANSITION_SUBMIT = 'Submit';
    string constant TRANSITION_REVIEW = 'Review';
    string constant TRANSITION_PUBLISH = 'Publish';
    string constant TRANSITION_REJECT = 'Reject';

    mapping(address => uint) internal successfulReviewsByAsset;
    uint constant REVIEWS_OK_TO_PUBLISH = 3;

    constructor() public {
        name = 'Peer Review';

        addTransition(TRANSITION_SUBMIT,'',STATE_SUMBITTED);
        addTransition(TRANSITION_REVIEW,STATE_SUMBITTED,STATE_ONREVIEW);
        addTransition(TRANSITION_PUBLISH,STATE_ONREVIEW,STATE_PUBLISHED);
        addTransition(TRANSITION_REJECT,STATE_ONREVIEW,STATE_REJECTED);
    }

    function submit(IAsset _asset) public {
        run(TRANSITION_SUBMIT, _asset);
    }

    function review(IAsset _asset) public {
        run(TRANSITION_REVIEW, _asset);
    }

    function accept(IAsset _asset) public {
        require(isOn(STATE_ONREVIEW, _asset), 'The current state not allow to Accept.');

        uint sucessful = successfulReviewsByAsset[_asset] + 1;
        successfulReviewsByAsset[_asset] = sucessful;
        if(sucessful == REVIEWS_OK_TO_PUBLISH) {
            publish(_asset);
        }
    }

    function getAcceptedCount(IAsset _asset) public view returns (uint) {
        return successfulReviewsByAsset[_asset];
    }

    function publish(IAsset _asset) internal {
        run(TRANSITION_PUBLISH, _asset);
    }

    function reject(IAsset _asset) public {
        run(TRANSITION_REJECT, _asset);
    }

    function start(IAsset _asset) public {
        submit(_asset);
    }
}
