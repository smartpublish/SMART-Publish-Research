pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./Work.sol";
import "./registry/PaperRegistry.sol";
import "./registry/ReviewRegistry.sol";

contract Paper is Ownable {

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
    Authorship private authorship;
    Info private paperInfo;
    Work[] private liveWork;
    Work private currentWork;

    uint256 public deposit;
    uint256 public ethPerReview;

    mapping (address => Cite) private citedBy;
    mapping (address => Cite) private cites;

    constructor(PaperRegistry _paperRegistry, ReviewRegistry _reviewRegistry) public {
        transferOwnership(msg.sender);
        paperRegistry = _paperRegistry;
        reviewRegistry = _reviewRegistry;
    }

    function () payable external {
        deposit += msg.value;
    }

    function setEthPerReview(uint256 _ethPerReview) public onlyOwner {
        ethPerReview = _ethPerReview;
    }

    function setPaperInfo(
            string calldata _title,
            string calldata _summary,
            string calldata _abstract,
            string calldata _topic,
            string calldata _type,
            string calldata _keywords
    ) external onlyOwner {
        paperInfo = Info(_title, _summary, _abstract, _topic, _type, _keywords);
        paperRegistry.onUpdated(_topic, authorship._author, authorship._coAuthors);
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

    function addWork(Work _work) external onlyOwner {
        liveWork.push(_work);
        currentWork = _work;
    }

    function getLiveWork() public view returns(Work[] memory) {
        return liveWork;
    }

    function getCurrentWork() public view returns(Work) {
        return currentWork;
    }

    function getTopic() public view returns(string memory) {
        return paperInfo._topic;
    }

    function setAuthorship(
            address _author,
            address[] calldata _coAuthors,
            address[] calldata _contributors
    ) external onlyOwner {
        authorship = Authorship(_author, _coAuthors, _contributors);
        paperRegistry.onUpdated(paperInfo._topic, _author, _coAuthors);
    }

    function getAuthorship() public view returns(
            address _author,
            address[] memory _coAuthors,
            address[] memory _contributors
    ) {
        return (authorship._author, authorship._coAuthors, authorship._contributors);
    }
    
    function cite(string calldata _citeType, Paper _to) external onlyOwner {
        _to.receiveCite(_citeType);
        cites[address(_to)] = Cite(_to, this, _citeType);
    }

    function receiveCite(string calldata _citeType) external {
        require(paperRegistry.containsPaper(Paper(msg.sender)), "Paper is not registered");
        citedBy[msg.sender] = Cite(this, Paper(msg.sender), _citeType);
    }

    function onReviewed(address payable _reviewer, string calldata _reviewIdentifier, uint _reviewResult) external {
        require(msg.sender == address(currentWork), "Only currentWork in paper can contabilize a Review");
        uint reviewFactor = reviewRegistry.calculeFactor(_reviewer, address(this), msg.sender);

        reviewRegistry.contabilize(_reviewer, address(this), msg.sender, _reviewIdentifier, _reviewResult);

        uint256 amount = ((reviewFactor * ethPerReview) / 100);
        if(amount <= deposit) {
            _reviewer.transfer(amount);
        }
    }

}