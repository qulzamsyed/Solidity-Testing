const QToken = artifacts.require("QToken");

module.exports = function (deployer) {
  deployer.deploy(QToken,"QToken","Q",100000000);
};
