const ScoreVerificationContract1 = artifacts.require('ScoreVerificationContract1');

contract('ScoreVerificationContract1', (accounts) => {
    const user = accounts[0];

    it('should upload hashed scores and compare hashes', async () => {
        const scoreContractInstance = await ScoreVerificationContract1.new(user, { from: user });

        // Upload hashed scores
        await scoreContractInstance.submitHashedScores(
            web3.utils.sha3('CS'),
            web3.utils.sha3('DQ'),
            web3.utils.sha3('OT'),
            web3.utils.sha3('DS'),
            web3.utils.sha3('DI'),
            { from: user }
        );

        // Upload plain scores
        await scoreContractInstance.submitPlainScores(7, 8, 9, 6, 5, { from: user });

        // Compare hashes
        await scoreContractInstance.compareHashes(7, 8, 9, 6, 5, { from: user });

        // Ensure that the event was emitted
        const events = await scoreContractInstance.getPastEvents('ScoresMatched', { fromBlock: 0, toBlock: 'latest' });
        assert.equal(events.length, 1, 'ScoresMatched event not emitted');
    });
});
