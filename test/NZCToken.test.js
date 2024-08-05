const Nzc = artifacts.require('NZC');

async function errException(promise) {
	try {
		await promise;
	} catch (error) {
		return error.reason;
	}
	assert.fail('Expected throw not received');
}

contract('Nzc', (accounts) => {
	let contract;
	const [owner, user] = accounts;

	beforeEach(async () => {
		contract = await Nzc.new();
	});

	describe('Mint', () => {
		it('[SUCCESS] Should be able to mint token to another account from owner account', async () => {
			await contract.mint(user, 10000);

			const balance = await contract.balanceOf(user);

			assert.equal(balance, 10000);
		});
	});

	describe('Transfer', () => {
		it('[SUCCESS] Should transfer tokens between accounts', async () => {
			await contract.mint(user, 10000);

			await contract.transfer(owner, 10000, { from: user });

			const userBalance = await contract.balanceOf(user);
			const ownerBalance = await contract.balanceOf(owner);

			assert.equal(userBalance, 0);
			assert.equal(ownerBalance, 10000);
		});
	});

	describe('Paused', () => {
		it('[SUCCESS] Should not be transfer when contract status pasued', async () => {
			await contract.pause();

			const paused = await contract.paused.call();

			await errException(contract.transfer(owner, 10000, { from: user }));

			assert.isTrue(paused);
		});
	});
});
