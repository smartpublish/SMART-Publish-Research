pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

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
        string[] _keywords;
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
    address private owner;
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

    function setPaperInfo(Info calldata _paperInfo) external {
        require(msg.sender == owner, "Only owner can perform this action");
        paperInfo = _paperInfo;
    }

    function getPaperInfo() public returns(Info memory) {
        return paperInfo;
    }

    function addWork(Work _work) external {
        require(msg.sender == owner, "Only owner can perform this action");
        liveWork.push(_work);
        currentWork = _work;
    }

    function getLiveWork() public returns(Work[] memory) {
        return liveWork;
    }

    function getCurrentWork() public returns(Work) {
        return currentWork;
    }

    function setAuthorship(Authorship calldata _authorship) external {
        require(msg.sender == owner, "Only owner can perform this action");
        authorship = _authorship;
    }
    
    function cite(string calldata _citeType, Paper _to) external {
        require(msg.sender == owner, "Only owner can perform this action");
        cites[address(_to)] = _to.receiveCite(_citeType);
    }

    function receiveCite(string calldata _citeType) external returns(Cite memory) {
        require(paperRegistry.containsPaper(Paper(msg.sender)), "Paper is not registered");
        Cite memory _cite = Cite(this, Paper(msg.sender), _citeType);
        citedBy[msg.sender] = _cite;
        return _cite;
    }

    function contabilizeReview(address _from, string calldata _reviewIdentifier, bool _isAccepted) external {
        require(msg.sender == address(currentWork), "Only currentWork in paper can contabilize a Review");
        reviewRegistry.contabilize(_from, address(this), _reviewIdentifier, _isAccepted);
    }


}