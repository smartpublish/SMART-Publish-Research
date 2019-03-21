pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

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

    function createWithInfo(Info _paperInfo) public returns(Paper){
        Paper paper = create();
        paper.setPaperInfo(_paperInfo);
        return paper;
    }

    function createWithInfoAndAsset(Info _paperInfo, Asset[] assets)) public returns(Paper){
        Paper paper = createWithInfo(_paperInfo);
        paper.addWork(new Work(paper, assets));
        return paper;
    }
}