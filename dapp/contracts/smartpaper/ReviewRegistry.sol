pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./PaperRegistry.sol"
import "./Paper.sol";

contract ReviewRegistry {

    address private owner;
    mapping(address => bool) private allowedCalls;

    PaperRegistry private paperRegistry;

    mapping(address => int) private revisionCount;
    mapping(address => int) private timesRevisorRight;
    mapping(address => int) private timesRevisorWrong;

    mapping(address => address[]) private paperAcceptedBy;
    mapping(address => address[]) private paperRejectedBy;

    constructor() public {
        this.owner = msg.sender;
    }

    function allowCallsFrom(address _address) external {
        require(msg.sender == owner, "Only owner can call this function");
        allowedCalls[_address] = true;
    }

    function contabilize(address _reviewer, address _paper, string calldata _identifier, bool _isAccepted) external returns(int) {
        bool calledFromPaper = (msg.sender == _paper && paperRegistry.contains(msg.sender));
        require(calledFromPaper || allowedCalls[msg.sender], "Contabilize must be called from allowed address or registered Paper");
        
        int factor = calculeFactor(_reviewer, _paper);
        revisionCount[_reviewer] = revisionCount[_reviewer] + 1;
        address[] memory reviewersWhoAccept = paperAcceptedBy[_paper];
        for (uint i=0; i<reviewersWhoAccept.length; i++) {
            if(_isAccepted) {
                timesRevisorRight[reviewersWhoAccept[i]] = timesRevisorRight[reviewersWhoAccept[i]] +1;
            } else {
                timesRevisorWrong[reviewersWhoAccept[i]] = timesRevisorWrong[reviewersWhoAccept[i]] +1;
            }
        }
        address[] memory reviewersWhoReject = paperAcceptedBy[_paper];
        for (uint i=0; i<reviewersWhoAccept.length; i++) {
            if(!_isAccepted) {
                timesRevisorRight[reviewersWhoReject[i]] = timesRevisorRight[reviewersWhoReject[i]] +1;
            } else {
                timesRevisorWrong[reviewersWhoReject[i]] = timesRevisorWrong[reviewersWhoReject[i]] +1;
            }
        }
        if(_isAccepted) {
            paperAcceptedBy[_paper].push(_reviewer)
        } else {
            paperRejectedBy[_paper].push(_reviewer)
        }

        return factor;
    }

    //calcule factor between 0 - 100 depending on number of reviews and number of rights and wrongs
    function calculeFactor(address _reviewer, address _paper) private returns(int) {
        int r = timesRevisorRight[_reviewer];
        int w = timesRevisorWrong[_reviewer];
        int n = revisionCount[_reviewer];

        int factor = 0
        if(n > 0) {
            factor = (r * 100) / (r + w);
        }
        return factor;
    }
}