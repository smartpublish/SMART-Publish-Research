pragma solidity ^0.5.0;

import "../Paper.sol";
import "./PaperRegistry.sol";

contract PaperRegistryCentral is PaperRegistry {

    address private owner;
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

    constructor() public {
        owner = msg.sender;
    }

    function allowCallsFrom(address _address) external {
        require(msg.sender == owner, "Only owner can call this function");
        allowedCalls[_address] = true;
    }

    function setPaper(Paper _paper) external {
        require(allowedCalls[msg.sender], "Only allowed address can call setPaper");
        papers[address(_paper)] = PaperInfo(true, "", address(0), new address[](0));
    }
    function containsPaper(Paper _paper) public view returns(bool) {
        return papers[address(_paper)]._exists;
    }

    //Called from a paper when authorship is updated
    function onUpdated(string calldata _topic, address _author, address[] calldata _coAuthors) external {
        Paper paper = Paper(msg.sender);
        require(containsPaper(paper), "Only registered Papers can call this function");

        updateAuthorCounts(-1);
        PaperInfo storage paperInfo = papers[msg.sender];
        paperInfo._topic = _topic;
        paperInfo._author = _author;
        paperInfo._coAuthors = _coAuthors;
        updateAuthorCounts(1);
    }

    function updateAuthorCounts(int value) private view {
        PaperInfo storage paperInfo = papers[msg.sender];

        authorPublicationSize[paperInfo._author] + value;
        for (uint coIndex = 0; coIndex < paperInfo._coAuthors.length; coIndex++) {
            authorPublicationSize[paperInfo._coAuthors[coIndex]] += value;
        }

        TopicInfo storage topicInfo = topics[paperInfo._topic];
        topicInfo._authorPublicationSize[paperInfo._author] + value;
        for (uint coIndex2 = 0; coIndex2 < paperInfo._coAuthors.length; coIndex2++) {
            topicInfo._authorPublicationSize[paperInfo._coAuthors[coIndex2]] += value;
        }
    }

    function getPapersByAuthorAndTopic(address _author, string memory _topic) public view returns(uint _papers, uint _papersByTopic) {
        uint papers = authorPublicationSize[_author];
        uint papersOnTopic = topics[_topic]._authorPublicationSize[_author];
        return (papers, papersOnTopic);
    }
    
}