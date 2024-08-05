const Nzc_Contract = artifacts.require('NZC');

module.exports = (deployer) => {
	deployer.deploy(Nzc_Contract);
};
