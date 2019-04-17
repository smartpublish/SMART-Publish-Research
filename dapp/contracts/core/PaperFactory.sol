pragma solidity ^0.5.0;

import "./Paper.sol";
import "./Work.sol";
import "./registry/Registry.sol";
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
        paperRegistry.addPaper(paper);
        return paper;
    }

    enum RegistryType { PaperRegistry, ReviewRegistry }
    function getRegistry(RegistryType _type) external view returns(Registry registry) {
        Registry registry_;
        if(_type == RegistryType.PaperRegistry) {
            registry_ = paperRegistry;
        } else if(_type == RegistryType.ReviewRegistry) {
            registry_ = reviewRegistry;
        }
        return registry_;
    }

}