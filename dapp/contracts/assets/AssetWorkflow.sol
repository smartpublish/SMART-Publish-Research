pragma solidity ^0.5.0;

import "./IAsset.sol";
import "./IWorkflow.sol";

contract AssetWorkflow is IWorkflow {

    string public name;

    enum ApprovalState { PENDING, APPROVED, REJECTED }
    struct Approval {
        bool exist; // Just to check on array if exists
        address approver;
        string approvalType;
        ApprovalState status;
        string[] actions;
    }

    struct State {
        bool exist; // Just to check on array if exists
        string name;
    }

    enum Permission { EVERYBODY, OWNER, NOTOWNER, INTERNAL }
    struct Transition {
        bool exist; // Just to check on array if exists
        string name;
        State sourceState;
        State targetState;
        Permission permission;
    }

    struct Comment {
        string message;
        address author;
        uint256 timestamp;
        State state;
    }

    mapping (string => State) private statesByName;
    mapping (string => Transition) private transitionsByName;
    mapping (string => IAsset[]) private assetsByState;
    mapping (address => Comment[]) private commentsByAsset;
    mapping (string => mapping(address => Approval[])) private approvalsByAssetAndState;

    State[] private states;
    Transition[] private transitions;

    event AssetStateChanged(address indexed asset, string state, string oldState, string transition);
    event AssetCommentAdded(address indexed asset, string message, address author, uint256 timestamp, string state);

    function addState(string memory _name) internal {
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

    function getState(uint256 index) public view returns (string memory) {
        return states[index].name;
    }

    function addApproval(IAsset _asset, string memory _state, address _approver, string memory _approvalType) internal {
        State storage state = statesByName[_state];
        require(state.exist, 'State does not exist');
        require(!isApproval(_asset, _state, _approver), 'This approver already has an approval on this state for this asset');
        
        string[] memory actions = new string[](2);
        actions[0] = "Accept";
        actions[1] = "Reject";
        Approval memory approval = Approval(true, _approver, _approvalType, ApprovalState.PENDING, actions);
        approvalsByAssetAndState[_state][address(_asset)].push(approval);
    }

    function getApprovalsCount(IAsset _asset, string memory _state) public view returns(uint) {
        return approvalsByAssetAndState[_state][address(_asset)].length;
    }

    function getApproval(IAsset _asset, string memory _state, uint _index) public view returns(address, string memory, ApprovalState, string memory, string memory) {
        Approval memory approval = approvalsByAssetAndState[_state][address(_asset)][_index];
        return (approval.approver, approval.approvalType, approval.status, approval.actions[0], approval.actions[1]);
    }

    function getApprovalByApprover(IAsset _asset, string memory _state, address _approver) public view returns(address, string memory, ApprovalState, string memory, string memory) {
        int index = indexOfApprovalsByAssetAndState(_asset, _state, _approver);
        if(index > -1) {
            return getApproval(_asset, _state, uint(index));
        }
        return (address(0), "", ApprovalState.PENDING, "", "");
    }

    function updateApproval(IAsset _asset, string memory _state, address _approver, ApprovalState _status) public {
        require(statesByName[_state].exist, 'State does not exist');
        int index = indexOfApprovalsByAssetAndState(_asset, _state, _approver);
        require(index > -1, 'Approval does not exist');
        approvalsByAssetAndState[_state][address(_asset)][uint(index)].status = _status; 
    }

    function isApproval(IAsset _asset, string memory _state, address _approver) internal view returns (bool) {
        return indexOfApprovalsByAssetAndState(_asset, _state, _approver) > -1;
    }

    function indexOfApprovalsByAssetAndState(IAsset _asset, string memory _state, address _approver) internal view returns(int) {
        Approval[] memory approvals = approvalsByAssetAndState[_state][address(_asset)];
        for(uint i = 0; i < approvals.length; i++) {
            if(approvals[i].exist && approvals[i].approver == _approver) {
                return int(i);
            }
        }
        return -1;
    }

    function addTransition(string memory _name, string memory _sourceState, string memory _targetState, Permission _permission) public {
        require(bytes(_name).length > 1, 'Transition must have a name');

        addState(_sourceState);
        addState(_targetState);

        // Avoid duplicates
        Transition memory transition = transitionsByName[_name];
        if(!transition.exist) {
            transition = Transition(true, _name, statesByName[_sourceState], statesByName[_targetState], _permission);
            transitionsByName[_name] = transition;
            transitions.push(transition);
        }
    }

    function getTransitionsCount() public view returns (uint) {
        return transitions.length;
    }

    function getTransition(uint256 index) public view returns (string memory, string memory, string memory, Permission) {
        Transition memory transaction = transitions[index];
        return (transaction.name, transaction.sourceState.name, transaction.targetState.name, transaction.permission);
    }

    function findAssetsByState(string memory state) public view returns (IAsset[] memory) {
        return assetsByState[state];
    }

    function findStateByAsset(IAsset _asset) public view returns (string memory) {
        uint length = states.length;
        for(uint i = 0; i < length; i++) {
            if(isOn(states[i].name, _asset)) {
                return states[i].name;
            }
        }
    }

    function removeAssetFromState(State memory _state, IAsset _asset) private {
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

    function isOn(string memory _stateName, IAsset _asset) internal view returns (bool) {
        return getPossitionOnAssetByState(statesByName[_stateName], _asset) > -1;
    }

    function getPossitionOnAssetByState(State memory _state, IAsset _asset) internal view returns(int) {
        IAsset[] memory assets = assetsByState[_state.name];
        uint length = assets.length;
        for(uint i = 0; i < length; i++) {
            if(assets[i] == _asset) {
                return int(i);
            }
        }
        return -1;
    }

    function run(string memory _transitionName, IAsset _asset) internal {
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
        emit AssetStateChanged(address(_asset), currentTransition.targetState.name, currentTransition.sourceState.name, currentTransition.name);
    }

    function addComment(IAsset _asset, string memory message) public {
        State memory state = statesByName[findStateByAsset(_asset)];
        Comment memory comment = Comment(message, msg.sender, now, state);
        commentsByAsset[address(_asset)].push(comment);
        emit AssetCommentAdded(address(_asset), comment.message, comment.author, comment.timestamp, comment.state.name);
    }

    function getCommentsCount(IAsset _asset) public view returns(uint) {
        return commentsByAsset[address(_asset)].length;
    }

    function getComment(IAsset _asset, uint index) public view returns(string memory, address, uint256, string memory) {
        Comment memory comment = commentsByAsset[address(_asset)][index];
        return (comment.message, comment.author, comment.timestamp, comment.state.name);
    }

    function start(IAsset _asset) public;

}
