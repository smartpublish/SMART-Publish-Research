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

    modifier nonPaused {
        require(!isPaused);
        // Do not forget the "_;"! It will
        // be replaced by the actual function
        // body when the modifier is used.
        _;
    }
}
