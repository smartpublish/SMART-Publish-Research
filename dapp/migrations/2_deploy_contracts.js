var ContributorFactory = artifacts.require("ContributorFactory");
var Researcher = artifacts.require("Researcher");
var Organization = artifacts.require("Organization");

var AssetFactory = artifacts.require("AssetFactory");
var Paper = artifacts.require("Paper");

module.exports = function(deployer) {
    // Contributors
    deployer.deploy(ContributorFactory);
    deployer.deploy(Researcher);
    deployer.deploy(Organization);

    // Assets
    deployer.deploy(AssetFactory);
    deployer.deploy(Paper);
};
