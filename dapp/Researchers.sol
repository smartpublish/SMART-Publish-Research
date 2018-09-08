pragma solidity ^0.4.24;

import "./support/Versionable.sol";


contract Researchers is Versionable {

    Researcher[] researchers;

    constructor() {
        updateVersion(new ResearchersV0());
    }

    function createResearcher() external returns(address) {
        var researcherAddress = currentVersion.delegateCall(firm("createResearcher()"));
        researchers.push(researcherAddress);
        return researcherAddress;
    }
}

contract ResearchersV0 is Pausable {

    function createResearcher() returns (address) {
        require(!isPaused);
        return new Researcher();
    }
}


contract Researcher is Ownable {


}