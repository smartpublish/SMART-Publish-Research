pragma solidity ^0.4.24;

import "./support/Versionable.sol";
import "./Researcher.sol";


contract Researchers is Versionable {

    mapping(address => Researcher) researchers;

    constructor() {
        updateVersion(new ResearchersV0());
    }

    modifier unique {
        require(researchers[msg.sender] != address(0));
        _;
    }

    function createResearcher() unique external returns(address) {
        Researcher researcher = currentVersion.delegateCall(firm("createResearcher()"));
        researchers[msg.sender] = researcher;
        return researcher;
    }
}

contract ResearchersV0 is Pausable {

    function createResearcher() nonPaused returns (address) {
        return new Researcher();
    }
}

