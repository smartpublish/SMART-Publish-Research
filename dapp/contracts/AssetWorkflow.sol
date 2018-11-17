pragma solidity ^0.4.25;

import "./IAsset.sol";

contract AssetWorkflow {

    string public name;

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

    event AssetStateChanged(address assetAddress, string state, string oldState, string transition);

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
        require(bytes(_name).length > 1, 'Transition must have a name');

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

    function findStateByAsset(IAsset _asset) public view returns (string) {
        uint length = states.length;
        for(uint i = 0; i < length; i++) {
            if(isOn(states[i].name, _asset)) {
                return states[i].name;
            }
        }
    }

    function removeAssetFromState(State _state, IAsset _asset) private {
        if(bytes(_state.name).length > 0) {
            IAsset[] memory assets = assetsByState[_state.name];
            int i = getPossitionOnAssetByState(_state, _asset);
            if(assets[0] == _asset && i == 0) {
                delete assetsByState[_state.name];
            } else if (i > 0) {
                delete assetsByState[_state.name][uint(i)];
            } else {
                revert('The asset is not on that state');
            }
        }
    }

    function isOn(string _stateName, IAsset _asset) internal view returns (bool) {
        return getPossitionOnAssetByState(statesByName[_stateName], _asset) > -1;
    }

    function getPossitionOnAssetByState(State _state, IAsset _asset) internal view returns(int) {
        IAsset[] memory assets = assetsByState[_state.name];
        uint length = assets.length;
        for(uint i = 0; i < length; i++) {
            if(assets[i] == _asset) {
                return int(i);
            }
        }
        return -1;
    }

    function run(string _transitionName, IAsset _asset) internal {
        Transition memory currentTransition = transitionsByName[_transitionName];

        require(currentTransition.exist, 'Transition does not exist');
        require(
            isOn(currentTransition.sourceState.name, _asset) || // Transition source state matches with asset current state
            (bytes(currentTransition.sourceState.name).length < 1 && bytes(findStateByAsset(_asset)).length < 1), // First time on this workflow
            'The current state not allow that transition.'
        );

        // Remove from current state if has previous one
        removeAssetFromState(currentTransition.sourceState, _asset);

        // Move to new state
        assetsByState[currentTransition.targetState.name].push(_asset);

        // Notify
        emit AssetStateChanged(_asset, currentTransition.targetState.name, currentTransition.sourceState.name, currentTransition.name);
    }

    function start(IAsset _asset) public;

}
