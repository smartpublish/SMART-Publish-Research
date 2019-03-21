pragma solidity ^0.5.0;

import "./Paper.sol";

contract PaperRegistry {

    address private owner;
    mapping(address => bool) private allowedCalls;

    mapping(address => Paper) private papers;

    constructor() public {
        owner = msg.sender;
    }

    function allowCallsFrom(address _address) external {
        require(msg.sender == owner, "Only owner can call this function");
        allowedCalls[_address] = true;
    }

    function setPaper(Paper _paper) external {
        require(allowedCalls[msg.sender], "Only allowed address can call setPaper");
        papers[address(_paper)] = _paper;
    }
    function containsPaper(Paper _paper) public view returns(bool) {
        return address(papers[address(_paper)]) != address(0);
    }

}