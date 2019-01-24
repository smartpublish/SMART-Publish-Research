pragma solidity ^0.5.0;

library SetAddress {

    // @dev Appends the specified element to the end of this list.
    function add(address[] storage self, address _value) public returns(int index) {
        int i = indexOf(self, _value);
        if(i < 0) {
            self.push(_value);
        }
        return i;
    }

    // @dev Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
    function indexOf(address[] storage self, address _value) public view returns(int index) {
        for(uint i = 0; i < self.length; i++) {
            if(self[i] == _value) {
                return int(i);
            }
        }
        return -1;
    }

    // @dev Removes the first occurrence of the specified element from this list, if it is present (it is chepear than removeSorted).
    function removeUnsorted(address[] storage self, address _value) public returns(bool removed) {
        int i = indexOf(self, _value);
        if(i < 0) return false;

        uint index = uint(i);
        self[index] = self[self.length - 1];
        delete self[self.length - 1];
        self.length--;
        return true;
    }

    // @dev Removes the first occurrence of the specified element from this list, if it is present (it is more expensive than removeUnsorted).
    function removeSorted(address[] storage self, address _value) public returns (bool removed) {
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