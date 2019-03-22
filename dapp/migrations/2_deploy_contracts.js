
var PaperRegistry = artifacts.require('PaperRegistry');
var ReviewRegistry = artifacts.require('ReviewRegistry');
var PaperFactory = artifacts.require('PaperFactory');

module.exports = async function(deployer) {

    await deployer.deploy(PaperRegistry)
    await deployer.deploy(ReviewRegistry, PaperRegistry.address)
    await deployer.deploy(PaperFactory, PaperRegistry.address, ReviewRegistry.address)

    // Libraries
 //   deployer.deploy(ArrayAddress);
 //   deployer.link(ArrayAddress, HashSet);
 //   deployer.deploy(HashSet);
 //   deployer.deploy(SetAddress);
    
    // Application
//    deployer.link(SetAddress, PeerReviewWorkflow);
//    deployer.link(HashSet, Contributable);
//    deployer.link(HashSet, Paper);
//    deployer.link(HashSet, AssetFactory);
//    deployer.deploy(PeerReviewWorkflow);

 //   deployer.deploy(Contributors).then(function() {
 //       return deployer.deploy(AssetFactory, Contributors.address)
 //   });
    
     // Assets
    // deployer.deploy(AssetFactory).then(function (factory) {
        // return deployer.deploy(Paper).then(function () {
            // Init Factory
        //    factory.register("paper", Paper.address);
        // });
};
