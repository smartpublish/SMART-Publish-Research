pragma solidity ^0.4.24;

import "./IAsset.sol";
import "./ILocation.sol";

// @title Any asset type (eg: a paper, ...)
contract AbstractAsset is IAsset {

    // @dev "Filesystem" address
    // ILocation public location;

    constructor() internal { }

}