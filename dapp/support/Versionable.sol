pragma solidity ^0.4.24;

import "./Ownable.sol";
import "./Pausable.sol";

contract Versionable is Ownable {

    address currentVersion;

    function updateVersion(address newVersion) internal {
        require(owner == msg.sender);
        Pausable(currentVersion).pause();
        currentVersion = newVersion;
    }

    function firm(string func) constant returns (bytes4) {
        return bytes4(keccak256(func));
    }
}
