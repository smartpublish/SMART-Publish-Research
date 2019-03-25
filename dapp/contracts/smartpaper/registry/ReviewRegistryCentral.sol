pragma solidity ^0.5.0;

import "./PaperRegistryCentral.sol";
import "../Paper.sol";

contract ReviewRegistryCentral {

    address private owner;
    mapping(address => bool) private allowedCalls;
    PaperRegistryCentral private paperRegistryCentral;

    struct ReviewerInfo {
        address _reviewer;
        uint _reviews;
        uint _right;
        uint _wrong;
    }

    struct TopicReviewerInfo {
        mapping(address => uint) _reviewsOnTopic;
    }

    //reviewer -> reviewerInfoIndex
    mapping(address => uint) private reviews;
    ReviewerInfo[] private reviewerInfo;

    //topic -> TopicInfoIndex
    mapping(string => uint) private topics;
    TopicReviewerInfo[] private topicInfo;

    struct WorkInfo {
        address _work;
        mapping(address => bool) _reviewers;
        ReviewInfo[] _reviews;
    }

    struct ReviewInfo {
        address _reviewer;
        uint _review;
    }

    //work -> WorkInfoIndex
    mapping(address => uint) works;
    WorkInfo[] private workInfo;


    constructor(PaperRegistryCentral _paperRegistryCentral) public {
        paperRegistryCentral = _paperRegistryCentral;
        owner = msg.sender;
    }

    function allowCallsFrom(address _address) external {
        require(msg.sender == owner, "Only owner can call this function");
        allowedCalls[_address] = true;
    }

    modifier isAllowed(address _paper) {
        bool isAllowedPaper = (_paper == msg.sender && paperRegistryCentral.containsPaper(Paper(msg.sender)));
        bool isAllowedCaller = allowedCalls[msg.sender];
        require(isAllowedPaper || isAllowedCaller, "Contabilize must be called from allowed address or registered Paper");
        _;
    }

  //Update reviewer state depending on paper/work and review
    function contabilize(address _reviewer, 
                        address payable _paper,
                        address _workInPaper, 
                        string calldata _identifier, 
                        uint _reviewResult) isAllowed(_paper) external {
        
        string memory topic = Paper(_paper).getTopic();
        ReviewerInfo storage reviewerInfo = reviewerInfo[getReviewerInfoIndex(_reviewer)];


        
        ReviewerInfo storage reviewerInfoOnTopic = reviewerInfo[getReviewerInfoIndexOnTopic(_reviewer, topic)];

        WorkInfo storage workInfo = workInfo[getWorkInfoIndex(_workInPaper)];
        require(!workInfo._reviewers[_reviewer], "Reviewer has reviewed this work previously");
        reviewerInfo._reviews ++;
        reviewerInfoOnTopic._reviews ++;
        updateOldReviewers(_workInPaper, _reviewResult, topic);
        workInfo._reviewers[_reviewer] = true;
        workInfo._reviews.push(ReviewInfo(_reviewer, _reviewResult));
    }

    function getReviewerInfoIndex(address _reviewer) private view returns (uint index) {
        return ensureIndex(reviews[_reviewer], _reviewer);
    }

    function getReviewerInfoIndexOnTopic(address _reviewer, string memory _topic) private view returns (uint index) {
        return ensureIndex(topicInfo[topics[_topic]]._reviewsOnTopic[_reviewer], _reviewer);
    }

    function ensureIndex(uint _index, address _reviewer) private view returns (uint index) {
        ReviewerInfo storage info = reviewerInfo[_index];
        if(info._reviewer != _reviewer) {
            info = ReviewerInfo(_reviewer, 0, 0, 0);
            reviewerInfo.push(reviewerInfo);
            reviews[_reviewer] = reviewerInfo.length;
        }
        return index;
    }

    function updateOldReviewers(address _workInPaper, uint _reviewResult, string memory _topic) private view {
        WorkInfo storage workInfo = workInfo[getWorkInfoIndex(_workInPaper)];
        for (uint i=0; i < workInfo._reviews.length; i++) {
            ReviewInfo storage reviewInfo = workInfo._reviews[i];
            ReviewerInfo storage reviewerInfo = reviewerInfo[getReviewerInfoIndex(reviewInfo._reviewer)];
            ReviewerInfo storage reviewerInfoOnTopic = reviewerInfo[getReviewerInfoIndexOnTopic(reviewInfo._reviewer, _topic)];
            if(reviewInfo._review != _reviewResult) {
                reviewerInfo._wrong ++;
                reviewerInfoOnTopic._right ++;
            } else {
                reviewerInfo._right ++;
                reviewerInfoOnTopic._right ++;
            }
         }
    }

    function getWorkInfoIndex(address _workInPaper) private view returns(uint index) {
        uint _index = works[_workInPaper];
        WorkInfo storage info = workInfo[_index];
        if(info._work != _workInPaper) {
            info = WorkInfo(_workInPaper);
            workInfo.push(info);
            works[_workInPaper] = workInfo.length;
        }
        return index;

    }



    //calcule factor between 0 - 100 depending on number of reviews and number of rights and wrongs
    function calculeFactor(address _reviewer, address _paper, address _work) public view 
                                returns(uint papers,
                                        uint papersOnTopic,
                                        uint reviews,
                                        uint reviewsOnTopic,
                                        uint reviewFactor, 
                                        uint reviewFactorOnTopic){
        
        string memory topic = Paper(_paper).getTopic();
        (uint papers, uint papersOnTopic) = paperRegistryCentral.getPapersByAuthorAndTopic(_reviewer, topic);
        
        ReviewerInfo memory reviewerInfo = reviewerInfo[reviews[_reviewer]];
        ReviewerInfo memory topicReviewerInfo = reviewerInfo[topicInfo[topics[topic]]._reviewsOnTopic[_reviewer]];
        uint reviews = reviewerInfo._reviews;
        uint reviewsOnTopic = topicReviewerInfo._reviews;
        uint reviewsFactor = ((reviewerInfo._right * 100) / (reviewerInfo._right + reviewerInfo._wrong));
        uint reviewsFactorOnTopic = ((topicReviewerInfo._right * 100) / (topicReviewerInfo._right + topicReviewerInfo._wrong));

        return (papers, papersOnTopic, reviews, reviewsOnTopic, reviewsFactor, reviewsFactorOnTopic);
    }


}