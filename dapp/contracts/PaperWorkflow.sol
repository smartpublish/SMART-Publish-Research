pragma solidity ^0.4.24;

import "./Paper.sol";
import "./AssetFactory.sol";
import "./IPFSLocation.sol";
import "./ILocation.sol";

contract PaperWorkflow is AssetFactory {

    mapping(string => address[]) internal papersByState;

    string constant STATE_SUMBITTED = "Submitted";

    constructor() public {}

    event PaperSubmitted(address paperAddress, string state);

    function submit(string _location, string _title, string _summary) public returns(Paper) {
        // Paper paper = Paper(this.create("paper"));
        Paper paper = new Paper();

        // ILocation ipfsLocation = new IPFSLocation(_location);
        paper.init(_location,_title,_summary);

        papersByState[STATE_SUMBITTED].push(paper) - 1;

        emit PaperSubmitted(paper, STATE_SUMBITTED);
        return paper;
    }

    function findPapers(string state) view public returns (address[]){
        return papersByState[state];
    }

}
