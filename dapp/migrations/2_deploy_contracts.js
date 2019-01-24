var ArrayAddress = artifacts.require('ArrayAddress');
var SetAddress = artifacts.require('SetAddress');
var HashSet = artifacts.require('HashSet');
var AssetFactory = artifacts.require("AssetFactory");
var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow');
var Paper = artifacts.require('Paper');
var Contributors = artifacts.require('Contributors');
var Contributable = artifacts.require('Contributable');

module.exports = function(deployer) {
    // Libraries
    deployer.deploy(ArrayAddress);
    deployer.link(ArrayAddress, HashSet);
    deployer.deploy(HashSet);
    deployer.deploy(SetAddress);
    
    // Application
    deployer.link(SetAddress, PeerReviewWorkflow);
    deployer.link(HashSet, Contributable);
    deployer.link(HashSet, Paper);
    deployer.link(HashSet, AssetFactory);
    deployer.deploy(PeerReviewWorkflow);

    deployer.deploy(Contributors).then(function() {
        return deployer.deploy(AssetFactory, Contributors.address)
    });
    
     // Assets
    // deployer.deploy(AssetFactory).then(function (factory) {
        // return deployer.deploy(Paper).then(function () {
            // Init Factory
        //    factory.register("paper", Paper.address);
        // });
};
