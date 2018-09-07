pragma solidity ^0.4.24;
import "./Ownable.sol";

contract Versionable is Ownable {

    address currentVersion;

    function updateVersion(address newVersion) internal {
        require(owner == msg.sender);
        currentVersion = newVersion;
    }

}
