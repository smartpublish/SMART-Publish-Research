var Researcher = artifacts.require("Researcher");
var Organization = artifacts.require("Organization");

module.exports = function(deployer) {
    deployer.deploy(Researcher);
    deployer.deploy(Organization);
};
