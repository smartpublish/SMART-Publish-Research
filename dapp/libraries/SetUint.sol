pragma solidity ^0.5.0;

library SetUint {

    // @dev Adds the specified element to this set if it is not already present.
    function add(uint[] storage self, uint _value) public returns (int index) {
        int i = indexOf(self, _value);
        if(i < 0) {
            self.push(_value);
        }
        return i;
    }

    // @dev Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
    function indexOf(uint[] storage self, uint _value) public view returns (int index) {
        for(uint i = 0; i < self.length; i++) {
            if(self[i] == _value) {
                return int(i);
            }
        }
        return -1;
    }

    // @dev Removes the first occurrence of the specified element from this array, if it is present (sorted).
    function remove(uint[] storage self, uint _value) public returns (bool updated) {
        int i = indexOf(self, _value);
        if(i < 0) return false;

        uint index = uint(i);  
        for (uint j = index; j < self.length - 1; j++) {
            self[j] = self[j + 1];
        }
        delete self[self.length - 1];
        self.length--;
        return true;
    }
}