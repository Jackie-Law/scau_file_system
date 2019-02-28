var BackupContract = artifacts.require("./BackupContract.sol");

module.exports = function(deployer) {
    deployer.deploy(BackupContract);
};  