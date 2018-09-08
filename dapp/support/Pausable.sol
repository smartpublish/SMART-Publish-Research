pragma solidity ^0.4.24;
import "./Ownable.sol";

contract Pausable is Ownable{

    bool isPaused;

    constructor() {
        isPaused = false;
    }

    function pause() {
        require(owner == msg.sender);
        isPaused = true;
    }
}
