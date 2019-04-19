pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "../Paper.sol";
import "./PaperRegistry.sol";

contract PaperRegistryCentral is PaperRegistry, Ownable  {

    mapping(address => bool) private allowedCalls;

    struct PaperInfo {
        bool _exists;
        string _topic;
        address _author;
        address[] _coAuthors;
    }
    struct TopicInfo {
        mapping(address => uint) _authorPublicationSize;
    }

    mapping(address => PaperInfo) private papers;
    mapping(address => uint) private authorPublicationSize;
    mapping(string => TopicInfo) private topics;

    function allowCallsFrom(address _address) external onlyOwner {
        allowedCalls[_address] = true;
    }

    function addPaper(Paper _paper) external {
        require(allowedCalls[msg.sender], "Only allowed address can call addPaper");
        papers[address(_paper)] = PaperInfo(true, "", address(0), new address[](0));
    }
    function containsPaper(Paper _paper) public view returns(bool) {
        return papers[address(_paper)]._exists;
    }

    //Called from a paper when authorship is updated
    function onUpdated(string calldata _topic, address _author, address[] calldata _coAuthors) external {
        Paper paper = Paper(msg.sender);
        require(containsPaper(paper), "Only registered Papers can call this function");

        decrementAuthorCounts();
        PaperInfo storage paperInfo = papers[msg.sender];
        paperInfo._topic = _topic;
        paperInfo._author = _author;
        paperInfo._coAuthors = _coAuthors;
        incrementAuthorCounts();
    }

    function decrementAuthorCounts()  private {
        PaperInfo storage paperInfo = papers[msg.sender];

        authorPublicationSize[paperInfo._author] -= 1;
        for (uint coIndex = 0; coIndex < paperInfo._coAuthors.length; coIndex++) {
            address author = paperInfo._coAuthors[coIndex];
            if(authorPublicationSize[author] > 0) {
                authorPublicationSize[author] -= 1;
            } 
        }

        TopicInfo storage topicInfo = topics[paperInfo._topic];
        topicInfo._authorPublicationSize[paperInfo._author] -= 1;
        for (uint coIndex2 = 0; coIndex2 < paperInfo._coAuthors.length; coIndex2++) {
            address author = paperInfo._coAuthors[coIndex2];
            if(authorPublicationSize[author] > 0) {
                topicInfo._authorPublicationSize[author] -= 1;
            } 
        }

    }

    function incrementAuthorCounts()  private {
        PaperInfo storage paperInfo = papers[msg.sender];

        authorPublicationSize[paperInfo._author] += 1;
        for (uint coIndex = 0; coIndex < paperInfo._coAuthors.length; coIndex++) {
            authorPublicationSize[paperInfo._coAuthors[coIndex]] += 1;
        }

        TopicInfo storage topicInfo = topics[paperInfo._topic];
        topicInfo._authorPublicationSize[paperInfo._author] += 1;
        for (uint coIndex2 = 0; coIndex2 < paperInfo._coAuthors.length; coIndex2++) {
            topicInfo._authorPublicationSize[paperInfo._coAuthors[coIndex2]] -= 1;
        }

    }

    function getPapersByAuthor(address _author) public view returns(uint _papers) {
        return authorPublicationSize[_author];
    }


    function getPapersByAuthorAndTopic(address _author, string memory _topic) public view returns(uint _papersByTopic) {
        return topics[_topic]._authorPublicationSize[_author];
    }
    
}