pragma solidity ^0.5.0;

import "./ArrayList.sol";

library HashSet {
    
    struct data {
        mapping(address => value) collection;
        ArrayList.data values;
    }

    struct value {
        address value;
        bool isValue;
    }

    // @dev Adds the specified element to this set if it is not already present.
    function add(data storage self, address _value) public returns (bool updated) {
         if(self.collection[_value].isValue) return false;
         self.collection[_value] = value(_value, true);
         ArrayList.add(self.values, _value);
         return true;
    }

    // @dev Returns true if this set contains the specified element.
    function contains(data storage self, address _value) public view returns(bool exist) {
        return ArrayList.indexOf(self.values, _value) > -1;
    }

    // @dev Returns the element at the specified position in this hash.
    function get(data storage self, uint index) public view returns(address element) {
        return ArrayList.get(self.values, index);
    }

    // @dev Removes the specified element from this set if it is present.
    function remove(data storage self, address _value) public returns (bool updated) {
         if(!self.collection[_value].isValue) return false;
         delete self.collection[_value];
         ArrayList.removeUnsorted(self.values, _value);
         return true;
    }

    // @dev Returns the number of elements in this hash.
    function size(data storage self) public view returns (uint) {
        return ArrayList.size(self.values);
    }

    // @dev Returns an array
    function toArray(data storage self) public view returns (address[] memory array) {
        return ArrayList.toArray(self.values);
    }
    
}
