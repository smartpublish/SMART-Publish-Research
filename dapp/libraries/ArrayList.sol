pragma solidity ^0.5.0;

library ArrayList {
    struct data {
        address[] array;
    }

    // @dev Appends the specified element to the end of this list.
    function add(data storage self, address _value) public returns(bool updated) {
        self.array.push(_value);
        return true;
    }

    // @dev Returns the index of the first occurrence of the specified element in this list, or -1 if this list does not contain the element.
    function indexOf(data storage self, address _value) public view returns(int index) {
        for(uint i = 0; i < self.array.length; i++) {
            if(self.array[i] == _value) {
                return int(i);
            }
        }
        return -1;
    }

    // @dev Returns the element at the specified position in this list.
    function get(data storage self, uint index) public view returns(address element) {
        return self.array[index];
    }

    // @dev Removes the first occurrence of the specified element from this list, if it is present (it is chepear than removeSorted).
    function removeUnsorted(data storage self, address _value) public returns(bool removed) {
        int i = indexOf(self, _value);
        if(i < 0) return false;

        uint index = uint(i);
        self.array[index] = self.array[self.array.length - 1];
        delete self.array[self.array.length - 1];
        self.array.length--;
        return true;
    }

    // @dev Removes the first occurrence of the specified element from this list, if it is present (it is more expensive than removeUnsorted).
    function removeSorted(data storage self, address _value) public returns (bool removed) {
        int i = indexOf(self, _value);
        if(i < 0) return false;

        uint index = uint(i);  
        for (uint j = index; j < self.array.length - 1; j++) {
            self.array[j] = self.array[j + 1];
        }
        delete self.array[self.array.length - 1];
        self.array.length--;
        return true;
    }

    // @dev Returns the number of elements in this list.
    function size(data storage self) public view returns (uint) {
        return self.array.length;
    }

    // @dev Returns an array
    function toArray(data storage self) public view returns (address[] memory array) {
        return self.array;
    }

}