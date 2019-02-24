pragma solidity ^0.5.0;

interface IAsset { 
    function setTitle(string calldata _title) external;
    function setSummary(string calldata _abstract) external;
    function getKeywordsCount() external view returns(uint);
    function addKeyword(string calldata _keyword) external;
    function removeKeywords(uint index) external;
}