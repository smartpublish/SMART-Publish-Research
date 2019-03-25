pragma solidity ^0.5.0;

import "./Paper.sol";
import "./Work.sol";
import "./registry/PaperRegistry.sol";
import "./registry/ReviewRegistry.sol";

contract PaperFactory {

    PaperRegistry private paperRegistry;
    ReviewRegistry private reviewRegistry;

    constructor(PaperRegistry _paperRegistry, ReviewRegistry _reviewRegistry) public {
        paperRegistry = _paperRegistry;
        reviewRegistry = _reviewRegistry;
    }

    function createPaper() external returns(Paper){
        Paper paper = new Paper(msg.sender, paperRegistry, reviewRegistry);
        paperRegistry.setPaper(paper);
        return paper;
    }

}