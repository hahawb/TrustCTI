const DataAccessControlContract = artifacts.require("DataAccessControlContract");

contract("DataAccessControlContract", (accounts) => {
    let dataAccessControlContract;

    // 引入AccessDecision枚举类型
    const AccessDecision = {
        Full: 0,
        Authorized: 1,
        Restricted: 2
    };

    beforeEach(async () => {
        dataAccessControlContract = await DataAccessControlContract.new();
    });

    it("should check access for consumer with different ReputationLevels and SensitivityLevels", async () => {
        const consumerAddress = accounts[0];

        // 模拟设置消费者信誉等级为 ReputationLevel.H
        await dataAccessControlContract.setConsumerReputation(consumerAddress, 0 /* ReputationLevel.H */, { from: accounts[0] });

        // 模拟不同信誉和敏感度组合的访问决策
        const testCase = { reputationLevel: 0 /* ReputationLevel.H */, sensitivityLevel: 0 /* SensitivityLevel.High */, expectedDecision: 0 /* AccessDecision.Full */ };

        const { logs } = await dataAccessControlContract.CheckReputation(testCase.sensitivityLevel, { from: consumerAddress });

        // 断言事件被触发
        assert.equal(logs[0].event, "AccessDecisionMade", "AccessDecisionMade event should be emitted");

        // 获取访问决策结果
        const actualDecision = logs[0].args.decision.toNumber();
        assert.equal(actualDecision, testCase.expectedDecision, `Unexpected access decision for reputation ${testCase.reputationLevel} and sensitivity ${testCase.sensitivityLevel}`);

        // 输出模拟结果
        console.log(`Simulated Reputation Level: ${testCase.reputationLevel}, Sensitivity Level: ${testCase.sensitivityLevel}, Access Decision: ${Object.keys(AccessDecision).find(key => AccessDecision[key] === actualDecision)}`);
    });

    // 输出 gas 使用和 gas cost（ether）
    after(async () => {
        const { gasUsed } = await web3.eth.getTransactionReceipt(dataAccessControlContract.transactionHash);
        const gasPrice = 20; // 替换为实际测试中使用的 gas 价格

        const gasCost = gasUsed * gasPrice / 1e9; // 将 gas 转换为 ether

        console.log("Gas Used:", gasUsed);
        console.log("Gas Cost (Ether):", gasCost);
    });
});
