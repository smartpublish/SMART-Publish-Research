pragma solidity ^0.4.24;

contract Ownable {

    address internal owner;

    constructor () {
        owner = msg.sender;
    }

}
