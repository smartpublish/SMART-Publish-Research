var ArrayList = artifacts.require('ArrayList');
var HashSet = artifacts.require('HashSet');
var AssetFactory = artifacts.require("AssetFactory");
var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow');
var Paper = artifacts.require('Paper');

module.exports = function(deployer) {
    // Libraries
    deployer.deploy(ArrayList);
    deployer.link(ArrayList, HashSet);
    deployer.deploy(HashSet);
    
    // Application
    deployer.link(HashSet, PeerReviewWorkflow);
    deployer.link(HashSet, Paper);
    deployer.link(HashSet, AssetFactory);
    deployer.deploy(PeerReviewWorkflow);
    deployer.deploy(AssetFactory);

     // Assets
    // deployer.deploy(AssetFactory).then(function (factory) {
        // return deployer.deploy(Paper).then(function () {
            // Init Factory
        //    factory.register("paper", Paper.address);
        // });
    // });
};
