pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "../core/PaperFactory.sol";
// import "../core/registry/PaperRegistry.sol";
import "../core/Paper.sol";
import "../core/Work.sol";

/**
   @dev This facade contract is just an API for core contracts and it never should storage values.
   Just acts as proxy in order to simplify call processes from third party systems
 */
contract PaperAPI {
    
    PaperFactory private paperFactory;

    constructor(PaperFactory _paperFactory) public {
        paperFactory = _paperFactory;
    }

    function setPaperFactory(PaperFactory _paperFactory) public {
        paperFactory = _paperFactory;
    }

    function create(
            string memory _title,
            string memory _summary,
            string memory _abstract,
            string memory _topic,
            string memory _type,
            string memory _keywords,
            string memory _fileName,
            string memory _fileSystemName,
            string memory _publicLocation,
            string memory _summaryHashAlgorithm,
            string memory _summaryHash
    ) public returns(Paper paper) {
        Paper paper_ = paperFactory.createPaper();
        paper_.setPaperInfo(_title,_summary,_abstract,_topic,_type,_keywords);
        Work work = new Work(paper_);
        paper_.addWork(work);
        work.addAsset(_fileName, _fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
        return paper_;
    }
    
    /*
    function read(
        address _address
    ) public returns(Paper paper) {
        address registryAddr = address(paperFactory.getRegistry(PaperFactory.RegistryType.PaperRegistry));
        PaperRegistry registry = PaperRegistry(registryAddr);
        require(registry.containsPaper(paper), "Only registered Papers can call this function");
        Paper paper_ = Paper(_address);
        return paper_;
    }

    function update() {

    }

    function remove() {

    }
    */
}
