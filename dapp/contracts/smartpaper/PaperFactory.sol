pragma solidity ^0.5.0;

import "./Paper.sol";
import "./Work.sol";
import "./PaperRegistry.sol";
import "./ReviewRegistry.sol";

contract PaperFactory {

    PaperRegistry private paperRegistry;
    ReviewRegistry private reviewRegistry;

    function create() public returns(Paper){
        Paper paper = new Paper(msg.sender, paperRegistry, reviewRegistry);
        paperRegistry.setPaper(paper);
        return paper;
    }

}