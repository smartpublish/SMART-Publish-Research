pragma solidity ^0.5.2;

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
        ReviewerInfo storage info = reviewerInfo[getReviewerInfoIndex(_reviewer)];


        
        ReviewerInfo storage infoOnTopic = reviewerInfo[getReviewerInfoIndexOnTopic(_reviewer, topic)];

        WorkInfo storage workInfo = workInfo[getWorkInfoIndex(_workInPaper)];
        require(!workInfo._reviewers[_reviewer], "Reviewer has reviewed this work previously");
        info._reviews ++;
        infoOnTopic._reviews ++;
        updateOldReviewers(_workInPaper, _reviewResult, topic);
        workInfo._reviewers[_reviewer] = true;
        workInfo._reviews.push(ReviewInfo(_reviewer, _reviewResult));
    }

    function getReviewerInfoIndex(address _reviewer) private returns (uint index) {
        return ensureIndex(reviews[_reviewer], _reviewer);
    }

    function getReviewerInfoIndexOnTopic(address _reviewer, string memory _topic) private returns (uint index) {
        return ensureIndex(topicInfo[topics[_topic]]._reviewsOnTopic[_reviewer], _reviewer);
    }

    function ensureIndex(uint _index, address _reviewer) private returns (uint index) {
        ReviewerInfo storage info = reviewerInfo[_index];
        if(info._reviewer != _reviewer) {
            uint256 pos = reviewerInfo.length + 1;
            info = reviewerInfo[pos];
            info._reviewer = _reviewer;
            reviews[_reviewer] = pos;
        }
        return index;
    }

    function updateOldReviewers(address _workInPaper, uint _reviewResult, string memory _topic) private {
        WorkInfo storage workInfo = workInfo[getWorkInfoIndex(_workInPaper)];
        for (uint i=0; i < workInfo._reviews.length; i++) {
            ReviewInfo storage reviewInfo = workInfo._reviews[i];
            ReviewerInfo storage info = reviewerInfo[getReviewerInfoIndex(reviewInfo._reviewer)];
            ReviewerInfo storage infoOnTopic = reviewerInfo[getReviewerInfoIndexOnTopic(reviewInfo._reviewer, _topic)];
            if(reviewInfo._review != _reviewResult) {
                info._wrong ++;
                infoOnTopic._right ++;
            } else {
                info._right ++;
                infoOnTopic._right ++;
            }
         }
    }

    function getWorkInfoIndex(address _workInPaper) private returns(uint index) {
        uint _index = works[_workInPaper];
        WorkInfo storage info = workInfo[_index];
        if(info._work != _workInPaper) {
            uint256 pos = workInfo.length + 1;
            info = workInfo[pos];
            info._work = _workInPaper;
            works[_workInPaper] = pos;
        }
        return index;

    }

    //calcule factor between 0 - 100 depending on number of reviews and number of rights and wrongs

    function calculeFactor(address _reviewer, address payable _paper, address _work) public view returns(uint _reviewFactor) {
        (uint _papers, uint _reviews, uint _reviewFactor) = calculeFactorOnPapers(_reviewer, _paper, _work);
        return _reviewFactor;
    }

    function calculeFactorOnPapers(address _reviewer, address payable _paper, address _work) public view 
                                returns(uint _papers,
                                        uint _reviews,
                                        uint _reviewFactor){
        
        uint papers = paperRegistryCentral.getPapersByAuthor(_reviewer);
        ReviewerInfo memory info = reviewerInfo[reviews[_reviewer]];
        uint reviews = info._reviews;
        uint reviewsFactor = ((info._right * 100) / (info._right + info._wrong));
        return (papers, reviews, reviewsFactor);
    }

    function calculeFactorOnTopic(address _reviewer, address payable _paper, address _work) public view 
                                returns(uint _papersOnTopic,
                                        uint _reviewsOnTopic,
                                        uint _reviewFactorOnTopic){
        
        string memory topic = Paper(_paper).getTopic();
        uint papersOnTopic = paperRegistryCentral.getPapersByAuthorAndTopic(_reviewer, topic);
        
        ReviewerInfo memory infoOnTopic = reviewerInfo[topicInfo[topics[topic]]._reviewsOnTopic[_reviewer]];
        uint reviewsOnTopic = infoOnTopic._reviews;
        uint reviewsFactorOnTopic = ((infoOnTopic._right * 100) / (infoOnTopic._right + infoOnTopic._wrong));

        return (papersOnTopic, reviewsOnTopic, reviewsFactorOnTopic);
    }

}