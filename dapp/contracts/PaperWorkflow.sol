pragma solidity ^0.4.24;

import "./Paper.sol";
import "./AssetFactory.sol";

contract PaperWorkflow is AssetFactory {

    mapping(string => address[]) internal papersByState;

    string constant STATE_SUMBITTED = "Submitted";

    constructor() public {}

    event PaperSubmitted(address paperAddress, string state);

    function submit(string _title, string _summary, string _fileSystemName, string _publicLocation, string _summaryHashAlgorithm, string _summaryHash) public returns(Paper) {
        // Paper paper = Paper(this.create("paper"));
        Paper paper = new Paper();

        paper.init(_title,_summary,_fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);

        papersByState[STATE_SUMBITTED].push(paper) - 1;

        emit PaperSubmitted(paper, STATE_SUMBITTED);
        return paper;
    }

    function findPapers(string state) view public returns (address[]){
        return papersByState[state];
    }

}
