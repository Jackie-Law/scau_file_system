var FileSystem = artifacts.require("./FileSystem.sol");

module.exports = function(deployer) {
  deployer.deploy(FileSystem);
};
