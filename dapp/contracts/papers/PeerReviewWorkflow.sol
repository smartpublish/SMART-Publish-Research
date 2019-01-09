pragma solidity ^0.5.0;

import "../assets/AssetWorkflow.sol";

contract PeerReviewWorkflow is AssetWorkflow {

    string constant STATE_SUMBITTED = "Submitted";
    string constant STATE_PUBLISHED = "Published";
    string constant STATE_REJECTED = "Rejected";

    string constant TRANSITION_SUBMIT = "Submit";
    string constant TRANSITION_REVIEW = "Review";
    string constant TRANSITION_PUBLISH = "Publish";
    string constant TRANSITION_REJECT = "Reject";

    string constant APPROVAL_TYPE_REVIEW = "Review";

    mapping(address => uint) internal successfulReviewsByAsset;
    uint constant REVIEWS_OK_TO_PUBLISH = 3;

    constructor() public {
        name = "Peer Review";

        addTransition(TRANSITION_SUBMIT, "", STATE_SUMBITTED, Permission.INTERNAL);
        addTransition(TRANSITION_REVIEW, STATE_SUMBITTED, STATE_SUMBITTED, Permission.NOTOWNER);
        addTransition(TRANSITION_PUBLISH, STATE_SUMBITTED, STATE_PUBLISHED, Permission.INTERNAL);
        addTransition(TRANSITION_REJECT, STATE_SUMBITTED, STATE_REJECTED, Permission.INTERNAL);
    }

    // @dev Transition
    function submit(IAsset _asset) public {
        run(TRANSITION_SUBMIT, _asset);
    }

    // @dev Transition
    function review(IAsset _asset) public {
        addApproval(_asset, STATE_SUMBITTED, msg.sender, APPROVAL_TYPE_REVIEW);
    }

    // @dev Approval function
    function accept(IAsset _asset, string memory _comment) public {
        // require(isOn(STATE_ONREVIEW, _asset), "The current state not allow to Accept.");
        updateApprovalStatus(_asset, STATE_SUMBITTED, msg.sender, ApprovalState.APPROVED);
        addComment(_asset, _comment);
        uint sucessful = successfulReviewsByAsset[address(_asset)] + 1;
        successfulReviewsByAsset[address(_asset)] = sucessful;
        if(sucessful == REVIEWS_OK_TO_PUBLISH) {
            run(TRANSITION_PUBLISH, _asset);
        }
    }

    function getAcceptedCount(IAsset _asset) public view returns (uint) {
        return successfulReviewsByAsset[address(_asset)];
    }

    // @dev Approval function
    function reject(IAsset _asset, string memory _comment) public {
        updateApprovalStatus(_asset, STATE_SUMBITTED, msg.sender, ApprovalState.REJECTED);
        addComment(_asset, _comment);
        run(TRANSITION_REJECT, _asset);
    }

    function start(IAsset _asset) public {
        submit(_asset);
    }
}
