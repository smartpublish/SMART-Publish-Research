pragma solidity ^0.4.23;

import "./IContributor.sol";

contract AbstractContributor is IContributor {

    function newInstance() external returns(IContributor);

}