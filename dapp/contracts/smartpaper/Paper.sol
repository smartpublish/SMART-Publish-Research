pragma solidity ^0.5.0;

import "./Work.sol";
import "./PaperRegistry.sol";
import "./ReviewRegistry.sol";

contract Paper {

    struct Info {
        string _title;
        string _summary;
        string _abstract;
        string _topic;
        string _type;
        string _keywords;
    }

    struct Cite {
        Paper _from;
        Paper _to;
        string _type;
    }

    struct Authorship {
        address _author;
        address[] _coAuthors;
        address[] _contributors;
    }

    PaperRegistry private paperRegistry;
    ReviewRegistry private reviewRegistry;
    address public owner;
    Authorship private authorship;
    Info private paperInfo;
    Work[] private liveWork;
    Work private currentWork;

    mapping (address => Cite) private citedBy;
    mapping (address => Cite) private cites;

    constructor(address _owner, PaperRegistry _paperRegistry, ReviewRegistry _reviewRegistry) public {
        owner = _owner;
        paperRegistry = _paperRegistry;
        reviewRegistry = _reviewRegistry;
    }

    function setPaperInfo(
            string calldata _title,
            string calldata _summary,
            string calldata _abstract,
            string calldata _topic,
            string calldata _type,
            string calldata _keywords
    ) external {
        require(msg.sender == owner, "Only owner can perform this action");
        paperInfo = Info(_title, _summary, _abstract, _topic, _type, _keywords);
    }

    function getPaperInfo() public view returns(
            string memory _title,
            string memory _summary,
            string memory _abstract,
            string memory _topic,
            string memory _type,
            string memory _keywords
    ) {
        return (paperInfo._title, 
                paperInfo._summary,
                paperInfo._abstract,
                paperInfo._topic,
                paperInfo._type,
                paperInfo._keywords);
    }

    function addWork(Work _work) external {
        require(msg.sender == owner, "Only owner can perform this action");
        liveWork.push(_work);
        currentWork = _work;
    }

    function getLiveWork() public view returns(Work[] memory) {
        return liveWork;
    }

    function getCurrentWork() public view returns(Work) {
        return currentWork;
    }

    function setAuthorship(
            address _author,
            address[] calldata _coAuthors,
            address[] calldata _contributors
    ) external {
        require(msg.sender == owner, "Only owner can perform this action");
        authorship = Authorship(_author, _coAuthors, _contributors);
    }

    function getAuthorship() public view returns(
            address _author,
            address[] memory _coAuthors,
            address[] memory _contributors
    ) {
        return (authorship._author, authorship._coAuthors, authorship._contributors);
    }
    
    function cite(string calldata _citeType, Paper _to) external {
        require(msg.sender == owner, "Only owner can perform this action");
        _to.receiveCite(_citeType);
        cites[address(_to)] = Cite(_to, this, _citeType);
    }

    function receiveCite(string calldata _citeType) external {
        require(paperRegistry.containsPaper(Paper(msg.sender)), "Paper is not registered");
        citedBy[msg.sender] = Cite(this, Paper(msg.sender), _citeType);
    }

    function contabilizeReview(address _from, string calldata _reviewIdentifier, bool _isAccepted) external {
        require(msg.sender == address(currentWork), "Only currentWork in paper can contabilize a Review");
        reviewRegistry.contabilize(_from, address(this), _reviewIdentifier, _isAccepted);
    }


}