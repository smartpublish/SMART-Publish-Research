pragma solidity ^0.5.0;

import "./IAsset.sol";
import "./IWorkflow.sol";
import "../libraries/HashSet.sol";

contract Asset is IAsset {

    HashSet.data private wfs;
    
    function addWorkflow(IWorkflow wf) public {
        HashSet.add(wfs, address(wf));
    }

    function removeWorkflow(IWorkflow wf) public {
        HashSet.remove(wfs, address(wf));
    }

    function getWorkflowCount() public view returns(uint) {
        HashSet.size(wfs);
    }

    function getWorkflows() public view returns(address[] memory) {
        return HashSet.toArray(wfs);
    }

}