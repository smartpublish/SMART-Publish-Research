const PaperRegistry = artifacts.require('PaperRegistryCentral');
const ReviewRegistry = artifacts.require('ReviewRegistryCentral');
const PaperFactory = artifacts.require('PaperFactory');
const PaperAPI = artifacts.require('PaperAPI');

module.exports = async function(deployer) {
    await deployer.deploy(PaperRegistry)
    await deployer.deploy(ReviewRegistry, PaperRegistry.address)
    await deployer.deploy(PaperFactory, PaperRegistry.address, ReviewRegistry.address)
    await deployer.deploy(PaperAPI, PaperFactory.address)
};
