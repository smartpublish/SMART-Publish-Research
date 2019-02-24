pragma solidity ^0.5.0;

contract Invitable {

    struct Invitation {
        bytes32  hashedCode;
        uint256 expires;
        bool isUsed;
    }

    event InvitationCreated(address indexed asset, bytes32 hashCode, uint256 expires);

    mapping(bytes32 => Invitation) internal invitations;

    function createInvitation(bytes32 _hashedCode, uint256 _expiresInSeconds) internal {
        invitations[_hashedCode] = Invitation(_hashedCode, _expiresInSeconds, false);
        emit InvitationCreated(address(this), _hashedCode, _expiresInSeconds);
    }

    function consumeInvitation(string memory code) internal {
        bytes32 hashedCode = performKeccak256(code);
        Invitation memory invitation = invitations[hashedCode];
        require(invitation.isUsed == false, "Invitation already used or not valid");
        require(invitation.expires > block.timestamp, "Invitation has expired");
        invitations[hashedCode] = Invitation(hashedCode, invitation.expires, true);
    }

    function performKeccak256(string memory code) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(code));
    }
}
