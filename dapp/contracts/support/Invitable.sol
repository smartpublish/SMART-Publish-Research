pragma solidity ^0.5.0;

contract Invitable {

    struct Invitation {
        bytes32  hashedCode;
        uint256 expires;
        bool isUsed;
    }

    event InvitationCreated(address assetAddress, bytes32 hashCode);

    mapping(bytes32 => Invitation) internal invitations;

    function createInvitation(bytes32 _hashedCode, uint256 _expiresInSeconds) internal {
        invitations[_hashedCode] = Invitation(_hashedCode, _expiresInSeconds, false);
        emit InvitationCreated(address(this), _hashedCode);
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

contract InvitableForTest is Invitable {

    function createInvitationFromTest(bytes32 _hashedCode, uint256 _expires) public {
        createInvitation(_hashedCode, _expires);
    }

    function consumeInvitationFromTest(string memory code) public {
        consumeInvitation(code);
    }

    function performKeccak256FromTest(string memory code) public returns (bytes32) {
        return performKeccak256(code);
    }

}