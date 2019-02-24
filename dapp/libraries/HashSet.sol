pragma solidity ^0.5.0;

import "./ArrayAddress.sol";

library HashSet {
    
    using ArrayAddress for address[];

    struct data {
        mapping(address => value) collection;
        address[] values;
    }

    struct value {
        address value;
        bool isValue;
    }

    // @dev Adds the specified element to this set if it is not already present.
    function add(data storage self, address _value) public returns (bool updated) {
         if(self.collection[_value].isValue) return false;
         self.collection[_value] = value(_value, true);
         self.values.add(_value);
         return true;
    }

    // @dev Returns true if this set contains the specified element.
    function contains(data storage self, address _value) public view returns(bool exist) {
        return self.values.indexOf(_value) > -1;
    }

    // @dev Returns the element at the specified position in this hash.
    function get(data storage self, uint index) public view returns(address element) {
        return self.values[index];
    }

    // @dev Removes the specified element from this set if it is present.
    function remove(data storage self, address _value) public returns (bool updated) {
         if(!self.collection[_value].isValue) return false;
         delete self.collection[_value];
         self.values.removeUnsorted(_value);
         return true;
    }

    // @dev Returns the number of elements in this hash.
    function size(data storage self) public view returns (uint) {
        return self.values.length;
    }

    // @dev Returns an array
    function toArray(data storage self) public view returns (address[] memory array) {
        return self.values;
    }
    
}
