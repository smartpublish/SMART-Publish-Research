pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "../core/PaperFactory.sol";
// import "../core/registry/PaperRegistry.sol";
import "../core/Paper.sol";
import "../core/Work.sol";

/**
   @dev This facade contract is just an API for core contracts and it never should storage values.
   Just acts as proxy in order to simplify call processes from third party systems
 */
contract PaperAPI is Ownable {
    
    PaperFactory private paperFactory;

    constructor(PaperFactory _paperFactory) public {
        paperFactory = _paperFactory;
    }

    /**
     * @dev Allows set another paper factory.
     * @param _paperFactory The address to paper factory.
     */
    function setPaperFactory(PaperFactory _paperFactory) public onlyOwner {
        paperFactory = _paperFactory;
    }

    struct File {
        string _fileName;
        string _fileSystemName;
        string _publicLocation;
        string _summaryHashAlgorithm;
        string _summaryHash;
    }

    struct PaperData {
        string _title;
        string _summary;
        string _abstract;
        string _topic;
        string _type;
        string _keywords;
        File[] _files;
        address _author;
        address[] _coAuthors;
        address[] _contributors;
    }

    event PaperCreated(Paper indexed paper);
    
    /**
     * @dev Allows create a new paper using the paper factory.
     * @param _data paper
     */
    function create(PaperData memory _data) public returns(Paper paper) {
        Paper paper_ = paperFactory.createPaper();
        paper_.setPaperInfo(_data._title,_data._summary,_data._abstract,_data._topic,_data._type,_data._keywords);
        Work work = new Work(paper_);
        paper_.addWork(work);
        for(uint i=0; i < _data._files.length; i++) {
            work.addAsset(_data._files[i]._fileName, _data._files[i]._fileSystemName, _data._files[i]._publicLocation, _data._files[i]._summaryHashAlgorithm, _data._files[i]._summaryHash);
        }
        paper_.setAuthorship(_data._author, _data._coAuthors, _data._contributors);
        paper_.transferOwnership(msg.sender);
        emit PaperCreated(paper_);
        return paper_;
    }
    
    /**
     * @dev Allows read all paper data.
     * @param _address paper
     */
    function read(address payable _address) public returns(PaperData memory paper) {
        Paper paper_ = Paper(_address);
        (   
            string memory _title,
            string memory _summary,
            string memory _abstract,
            string memory _topic,
            string memory _type,
            string memory _keywords
        ) = paper_.getPaperInfo();
        (
            address _author,
            address[] memory _coAuthors,
            address[] memory _contributors
        ) = paper_.getAuthorship();
        
        Work work = paper_.getCurrentWork();
        uint count = work.assetCount();
        File[] memory _files = new File[](count);
        for(uint i = 0; i < count; i++) {
            (
            string memory _fileName,
            string memory _fileSystemName,
            string memory _publicLocation,
            string memory _summaryHashAlgorithm,
            string memory _summaryHash
            ) = work.getAsset(i);
            _files[i] = File(_fileName, _fileSystemName, _publicLocation, _summaryHashAlgorithm, _summaryHash);
        }
        PaperData memory p = PaperData(_title,_summary,_abstract,_topic,_type,_keywords,_files,_author,_coAuthors,_contributors);
        return p;
    }

    /*
    function update() {

    }

    function remove() {

    }
    */
}
