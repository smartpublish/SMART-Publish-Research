pragma solidity ^0.5.0;

import "./IAsset.sol";
import "./IWorkflow.sol";
import "../../libraries/SetAddress.sol";

contract AssetWorkflow is IWorkflow {

    string public name;

    enum ApprovalState { PENDING, APPROVED, REJECTED }
    struct Approval {
        bool exist; // Just to check on array if exists
        address approver;
        string approvalType;
        ApprovalState status;
        string[] actions;
        IAsset asset;
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

    using SetAddress for address[];

    mapping (string => State) private statesByName;
    mapping (string => Transition) private transitionsByName;
    mapping (string => address[]) private assetsByState;
    mapping (address => Comment[]) private commentsByAsset;
    mapping (string => mapping(address => Approval[])) private approvalsByAssetAndState;
    mapping (address => Approval[]) private approvalsByApprover;

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
        int index = indexOfApprovalsByAssetAndState(_asset, _state, _approver);
        require(index < 0, 'This approver already has an approval on this state for this asset');
        
        string[] memory actions = new string[](2);
        actions[0] = "Accept";
        actions[1] = "Reject";
        Approval memory approval = Approval(true, _approver, _approvalType, ApprovalState.PENDING, actions, _asset);
        approvalsByApprover[_approver].push(approval);
        approvalsByAssetAndState[_state][address(_asset)].push(approval);
    }

    function getApprovalsCount(IAsset _asset, string memory _state) public view returns(uint) {
        return approvalsByAssetAndState[_state][address(_asset)].length;
    }

    function getApproval(IAsset _asset, string memory _state, uint _index) public view 
        returns(address, string memory, ApprovalState, string memory, string memory, address) {
        
        Approval memory approval = approvalsByAssetAndState[_state][address(_asset)][_index];
        return (approval.approver, approval.approvalType, approval.status, approval.actions[0], 
                approval.actions[1], address(approval.asset));
    }

    function getApprovalsByApproverCount(address _approver) public view returns(uint) {
        return approvalsByApprover[_approver].length;
    }
    
    function getApprovalByApprover(address _approver, uint _index) public view 
        returns(address approver, string memory approvalType, ApprovalState status, 
                string memory action1, string memory action2, address asset) {
        
        Approval memory approval = approvalsByApprover[_approver][_index];
        return (approval.approver, approval.approvalType, approval.status, approval.actions[0], 
                approval.actions[1], address(approval.asset));
    }

    function getApprovalByAsset(IAsset _asset, string memory _state, address _approver) public view 
        returns(address, string memory, ApprovalState, string memory, string memory, address) {
        
        int index = indexOfApprovalsByAssetAndState(_asset, _state, _approver);
        if(index > -1) {
            return getApproval(_asset, _state, uint(index));
        }
        return (address(0), "", ApprovalState.PENDING, "", "", address(0));
    }

    function updateApprovalStatus(IAsset _asset, string memory _state, address _approver, ApprovalState _status) public {
        require(statesByName[_state].exist, 'State does not exist');
        int index = indexOfApprovalsByAssetAndState(_asset, _state, _approver);
        require(index > -1, 'Approval does not exist');
        approvalsByAssetAndState[_state][address(_asset)][uint(index)].status = _status; 
    }

    function indexOfApprovalsByAssetAndState(IAsset _asset, string memory _state, address _approver) internal view returns(int) {
        Approval[] memory approvalsArray = approvalsByAssetAndState[_state][address(_asset)];
        for(uint i = 0; i < approvalsArray.length; i++) {
            if(approvalsArray[i].exist && approvalsArray[i].approver == _approver) {
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

    function findAssetsByState(string memory state) public view returns (address[] memory) {
        return assetsByState[state];
    }

    function findStateByAsset(IAsset _asset) public view returns (string memory) {
        for(uint i = 0; i < states.length; i++) {
            if(isOn(states[i].name, _asset)) {
                return states[i].name;
            }
        }
    }

    function removeAssetFromState(State memory _state, IAsset _asset) private {
        if(bytes(_state.name).length > 0) {
            int i = assetsByState[_state.name].indexOf(address(_asset));
            if(i == 0 && assetsByState[_state.name].length == 1) {
                delete assetsByState[_state.name];
            } else if (i > 0) {
                assetsByState[_state.name].removeSorted(address(_asset));
            } else {
                revert('The asset is not on that state');
            }
        }
    }

    function isOn(string memory _stateName, IAsset _asset) internal view returns (bool) {
        return assetsByState[_stateName].indexOf(address(_asset)) > -1;
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
        assetsByState[currentTransition.targetState.name].add(address(_asset));

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
