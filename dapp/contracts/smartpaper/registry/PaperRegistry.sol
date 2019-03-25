pragma solidity ^0.5.0;

import "../Paper.sol";

interface PaperRegistry {
    //PaperFactory can call this method to register
    function setPaper(Paper _paper) external;
    //Any contract can call this method
    function containsPaper(Paper _paper) public view returns(bool);
    //Called from a paper when authorship and topic is updated
    function onUpdated(string calldata _topic, address _author, address[] calldata _coAuthors) external;

}