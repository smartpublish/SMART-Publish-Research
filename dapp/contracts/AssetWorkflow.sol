pragma solidity ^0.4.25;

import "./IAsset.sol";

contract AssetWorkflow {

    struct State {
        bool exist; // Just to check on array if exists
        string name;
    }

    struct Transition {
        bool exist; // Just to check on array if exists
        string name;
        State sourceState;
        State targetState;
    }

    mapping (string => State) private statesByName;
    mapping (string => Transition) private transitionsByName;
    mapping (string => IAsset[]) private assetsByState;

    State[] private states;
    Transition[] private transitions;

    event AssetStateChanged(address assetAddress, string state);

    function addState(string _name) internal {
        // Avoid empty states or creation states ''
        if(bytes(_name).length < 1) {
            return;
        }

        // Avoid duplicates
        State memory state = statesByName[_name];
        if(!state.exist) {
            state = State(true,_name);
            statesByName[_name] = state;
            states.push(state);
        }
    }

    function getStatesCount() public view returns (uint) {
        return states.length;
    }

    function getState(uint256 index) public view returns (string) {
        return states[index].name;
    }

    function addTransition(string _name, string _sourceState, string _targetState) public {
        // Avoid empty transitions
        if(bytes(_name).length < 1) {
            return;
        }

        addState(_sourceState);
        addState(_targetState);

        // Avoid duplicates
        Transition memory transition = transitionsByName[_name];
        if(!transition.exist) {
            transition = Transition(true,_name,statesByName[_sourceState],statesByName[_targetState]);
            transitionsByName[_name] = transition;
            transitions.push(transition);
        }
    }

    function getTransitionsCount() public view returns (uint) {
        return transitions.length;
    }

    function getTransition(uint256 index) public view returns (string, string, string) {
        Transition memory transaction = transitions[index];
        return (transaction.name, transaction.sourceState.name, transaction.targetState.name);
    }

    function findAssetsByState(string state) public view returns (IAsset[]) {
        return assetsByState[state];
    }

    function removeAssetFromState(State _state, IAsset _asset) private {
        if(bytes(_state.name).length > 0) {
            IAsset[] memory assets = assetsByState[_state.name];
            int i = getAssetsByStatePosition(_state, _asset);
            if(assets[0] == _asset && i == 0) {
                delete assetsByState[_state.name];
            } else if (i > 0) {
                delete assetsByState[_state.name][uint(i)];
            } else {
                revert('The asset is not on state');
            }
        }
    }

    function isOn(string _stateName, IAsset _asset) internal view returns (bool) {
        return getAssetsByStatePosition(statesByName[_stateName], _asset) > -1;
    }

    function getAssetsByStatePosition(State _state, IAsset _asset) internal view returns(int) {
        IAsset[] memory assets = assetsByState[_state.name];
        uint length = assets.length;
        for(uint i = 0; i < length; i++ ) {
            if(assets[i] == _asset) {
                return int(i);
            }
        }
        return -1;
    }

    function run(string _transitionName, IAsset _asset) internal {
        Transition memory currentTransition = transitionsByName[_transitionName];

        // Check if transition exists
        if(!currentTransition.exist) {
            revert('Transition does not exist');
        }

        // Remove from current state if has previous one
        removeAssetFromState(currentTransition.sourceState, _asset);

        // Move to new state
        assetsByState[currentTransition.targetState.name].push(_asset);

        // Notify
        emit AssetStateChanged(_asset, currentTransition.targetState.name);
    }

    function start(IAsset _asset) public;

}
