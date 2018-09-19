pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Paper.sol";
import "../contracts/IAddress.sol";
import "../contracts/IPFSAddress.sol";

contract PaperTest {

    string constant title = "SMART Papers on Blockchain";
    string constant summary = "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.";

    function testCreatePaper() public {
        IAddress ipfsAddr = new IPFSAddress("/ipfs/hash/path/to/resource");
        Paper paper = new Paper(ipfsAddr,title,summary);

        Assert.equal(paper.getTitle(),title,"Paper title was not set right");
        Assert.equal(paper.getAbstract(),summary,"Paper abstract was not set right");
        Assert.equal(paper.getAddress(),ipfsAddr,"Paper address not match with IPFS Address");
    }

}