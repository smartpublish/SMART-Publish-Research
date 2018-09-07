pragma solidity ^0.4.24;

import "./support/Versionable.sol";


contract Researchers is Versionable {

    Researcher[] researchers;

    constructor(address firstVersion) {
        updateVersion(firstVersion);
    }

    function createResearcher(string orcid) external returns(address) {
        var researcherAddress = currentVersion.delegateCall(bytes4(keccak256("createResearcher(string)")), orcid);
        researchers.push(researcherAddress);
        return researcherAddress;
    }
}

contract ResearchersV1 {

    function createResearcher(string orcid) returns (address) {
        //Create a Researcher address
    }
}


contract Researcher {

}