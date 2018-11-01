var AssetFactory = artifacts.require("AssetFactory");
var PeerReviewWorkflow = artifacts.require('PeerReviewWorkflow');

module.exports = function(deployer) {
     // Assets
    deployer.deploy(AssetFactory).then(function (factory) {
        // return deployer.deploy(Paper).then(function () {
            // Init Factory
        //    factory.register("paper", Paper.address);
        // });
    });
    deployer.deploy(PeerReviewWorkflow);
};
