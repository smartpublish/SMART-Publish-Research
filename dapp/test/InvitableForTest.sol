pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "../contracts/support/Invitable.sol";

contract InvitableForTest is Invitable {

    function createInvitationFromTest(bytes32 _hashedCode, uint256 _expires) public {
        createInvitation(_hashedCode, _expires);
    }

    function consumeInvitationFromTest(string memory code) public {
        consumeInvitation(code);
    }

    function performKeccak256FromTest(string memory code) public pure returns (bytes32) {
        return performKeccak256(code);
    }

    function getInvitation(bytes32 _hashedCode) public view returns (bytes32, uint256) {
        Invitation memory invitation = invitations[_hashedCode];
        return (invitation.hashedCode, invitation.expires);
    }

}

contract TestInvitable {
    InvitableForTest invitable;
    function beforeEach() public {
        invitable = new InvitableForTest();
    }
    function testCreateInvitation() public {
        bytes32 hashedCode = invitable.performKeccak256FromTest('Test code');
        invitable.createInvitationFromTest(hashedCode, 1545207458);
        bytes32 hashCodeFromInvitable;
        uint256 expiresFromInvitable;
        (hashCodeFromInvitable, expiresFromInvitable) = invitable.getInvitation(hashedCode);
        Assert.equal(hashCodeFromInvitable, hashedCode, "Hashcodes should match");
        Assert.isNotZero(expiresFromInvitable, "Expires date should has a value");
    }
}