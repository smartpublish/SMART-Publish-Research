pragma solidity ^0.4.24;

import "./AbstractContributor.sol";

contract Organization is AbstractContributor {

    function newInstance() external returns(IContributor) {
        return new Organization();
    }

}