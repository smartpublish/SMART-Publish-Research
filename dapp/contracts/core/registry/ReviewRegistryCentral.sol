pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./ReviewRegistry.sol";
import "./PaperRegistryCentral.sol";
import "../Paper.sol";

contract ReviewRegistryCentral is ReviewRegistry, Ownable {

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
        ReviewInfo[] _reviews;
        mapping(address => bool) _reviewers;
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
    }

    function allowCallsFrom(address _address) external onlyOwner {
        allowedCalls[_address] = true;
    }

    modifier isAllowed(address payable _paper) {
        require(paperRegistryCentral.containsPaper(Paper(_paper)), "Paper is not registered");
        require(allowedCalls[msg.sender] || _paper == msg.sender, "Contabilize must be called from allowed address or registered Paper"); 
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
        uint topicIndex = ensureTopicIndex(topics[_topic], _topic);
        return ensureIndex(topicInfo[topicIndex]._reviewsOnTopic[_reviewer], _reviewer);
    }

    function getWorkInfoIndex(address _workInPaper) private returns(uint index) {
       return ensureWorkInfoIndex(works[_workInPaper], _workInPaper);
    }

    function ensureWorkInfoIndex(uint _index, address _workInPaper) private returns (uint index) {
        uint ensuredIndex = _index;
        if(workInfo.length == 0) {
            workInfo.length ++;
            WorkInfo storage w = workInfo[0];
            w._work = address(0);
        }
        if(_index == 0) {
            ensuredIndex = workInfo.length;
            workInfo.length ++;
            WorkInfo storage w = workInfo[ensuredIndex];
            w._work = _workInPaper;
            works[_workInPaper] = ensuredIndex;
        }
        
        return ensuredIndex;
    }

    function ensureTopicIndex(uint _index, string memory _topic) private returns (uint index) {
        uint ensuredIndex = _index;
        if(topicInfo.length == 0) {
            topicInfo.push(TopicReviewerInfo());
        }
        if(_index == 0) {
            ensuredIndex = topicInfo.length;
            topicInfo.push(TopicReviewerInfo());
            topics[_topic] = ensuredIndex;
        }
        return ensuredIndex;

    }

    function ensureIndex(uint _index, address _reviewer) private returns (uint index) {
        uint ensuredIndex = _index;
        if(reviewerInfo.length == 0) {
            reviewerInfo.push(ReviewerInfo(address(0), 0, 0, 0));
        }
        if(_index == 0) {
            ensuredIndex = reviewerInfo.length;
            reviewerInfo.push(ReviewerInfo(_reviewer, 0, 0, 0));
            reviews[_reviewer] = ensuredIndex;
        }
        return ensuredIndex;
    }

    function updateOldReviewers(address _workInPaper, uint _reviewResult, string memory _topic) private {
        WorkInfo storage workInfo = workInfo[getWorkInfoIndex(_workInPaper)];
        for (uint i=0; i < workInfo._reviews.length; i++) {
            ReviewInfo storage reviewInfo = workInfo._reviews[i];
            ReviewerInfo storage info = reviewerInfo[reviews[reviewInfo._reviewer]];
            ReviewerInfo storage infoOnTopic = reviewerInfo[topicInfo[topics[_topic]]._reviewsOnTopic[reviewInfo._reviewer]];
            if(reviewInfo._review != _reviewResult) {
                info._wrong ++;
                infoOnTopic._wrong ++;
            } else {
                info._right ++;
                infoOnTopic._right ++;
            }
         }
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
     
        uint r = 0;
        uint rf = 0;

        uint index = reviews[_reviewer];
        if(index != 0) {
            ReviewerInfo memory info = reviewerInfo[index];
            r = info._reviews;
            rf = ((info._right * 100) / (info._right + info._wrong));
        }
      
        return (papers, r, rf);
    }

    function calculeFactorOnTopic(address _reviewer, address payable _paper, address _work) public view 
                                returns(uint _papersOnTopic,
                                        uint _reviewsOnTopic,
                                        uint _reviewFactorOnTopic){
        
        string memory topic = Paper(_paper).getTopic();
        uint papersOnTopic = paperRegistryCentral.getPapersByAuthorAndTopic(_reviewer, topic);
        
        uint reviewsOnTopic = 0;
        uint reviewsFactorOnTopic = 0;

        uint indexTopic = topics[topic];
        if(indexTopic != 0) {
            uint index = topicInfo[indexTopic]._reviewsOnTopic[_reviewer];
            if(index != 0) {
                ReviewerInfo memory infoOnTopic = reviewerInfo[index];
                reviewsOnTopic = infoOnTopic._reviews;
                reviewsFactorOnTopic = ((infoOnTopic._right * 100) / (infoOnTopic._right + infoOnTopic._wrong));
            }
        }
    
        return (papersOnTopic, reviewsOnTopic, reviewsFactorOnTopic);
    }

}