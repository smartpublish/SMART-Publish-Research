var Ownable = artifacts.require("./support/Ownable.sol");
var Pausable = artifacts.require("./support/Pausable.sol");
var Versionable = artifacts.require("./support/Versionable.sol");
var Researcher = artifacts.require("./Researcher.sol");
var Researchers = artifacts.require("./Researchers.sol");

module.exports = function(deployer) {
  deployer.deploy(Ownable);
  deployer.link(Ownable, Pausable);
  deployer.deploy(Pausable);
  deployer.link(Ownable, Versionable);
  deployer.link(Pausable, Versionable);
  deployer.deploy(Pausable);
  deployer.link(Ownable, Researcher);
  deployer.deploy(Researcher);
  deployer.link(Versionable, Researchers);
  deploy.deploy(Researchers);
};
