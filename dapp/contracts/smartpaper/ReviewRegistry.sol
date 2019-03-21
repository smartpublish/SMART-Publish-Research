pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./Paper.sol";

contract ReviewRegistry {

    mapping(address => int) private revisionCount;
    mapping(address => int) private timesRevisorRight;
    mapping(address => int) private timesRevisorWrong;

    mapping(address => address[]) private paperAcceptedBy;
    mapping(address => address[]) private paperRejectedBy;

    function contabilize(address _reviewer, address _paper, string calldata _identifier, bool _isAccepted) external returns(int) {
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

        return factor;
    }

    //calcule factor between 0 - 100 depending on number of reviews and number of rights and wrongs
    function calculeFactor(address _reviewer, address _paper) internal returns(int) {
        return 0;
    }
}