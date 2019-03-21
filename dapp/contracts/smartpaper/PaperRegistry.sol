pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Paper.sol";

contract PaperRegistry {

    mapping(address => Paper) private papers;

    function containsPaper(Paper _paper) public returns(bool) {
        return papers[address(_paper)] != address(0);
    }

}