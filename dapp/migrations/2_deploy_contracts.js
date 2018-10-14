var AssetFactory = artifacts.require("AssetFactory");
var Paper = artifacts.require("Paper");
var PaperWorkflow = artifacts.require("PaperWorkflow");

module.exports = function(deployer) {
     // Assets
    deployer.deploy(AssetFactory).then(function (factory) {
        return deployer.deploy(Paper).then(function () {
            // Init Factory
            factory.register("paper", Paper.address);
        });
    });
    deployer.deploy(PaperWorkflow);
};
