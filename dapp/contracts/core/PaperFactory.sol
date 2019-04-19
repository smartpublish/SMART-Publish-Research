pragma solidity ^0.5.2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "./Paper.sol";
import "./Work.sol";
import "./registry/Registry.sol";
import "./registry/PaperRegistry.sol";
import "./registry/ReviewRegistry.sol";

contract PaperFactory is Ownable {

    PaperRegistry private paperRegistry;
    ReviewRegistry private reviewRegistry;

    constructor(PaperRegistry _paperRegistry, ReviewRegistry _reviewRegistry) public {
        paperRegistry = _paperRegistry;
        reviewRegistry = _reviewRegistry;
    }

    function createPaper() external returns(Paper paper){
        Paper paper_ = new Paper(paperRegistry, reviewRegistry);
        paper_.transferOwnership(msg.sender);
        paperRegistry.addPaper(paper_);
        return paper_;
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

    function setRegistry(RegistryType _type, Registry _registry) public onlyOwner{
        if(_type == RegistryType.PaperRegistry) {
            paperRegistry = PaperRegistry(address(_registry));
        } else if(_type == RegistryType.ReviewRegistry) {
            reviewRegistry = ReviewRegistry(address(_registry));
        }
    }

}