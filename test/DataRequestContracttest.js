const DataRequestContract = artifacts.require("DataRequestContract");

contract("DataRequestContract", (accounts) => {
    let dataRequestContract;
    const gasPrice = web3.utils.toWei("20", "gwei");

    beforeEach(async () => {
        dataRequestContract = await DataRequestContract.new();
    });

    it("should create a new data request", async () => {
        const requestDataHash = web3.utils.sha3("Test Data Request");
        const result = await dataRequestContract.requestData(requestDataHash, { from: accounts[0], gasPrice });

        // 输出 gas 使用和 gas cost（ether）
        console.log("Gas used:", result.receipt.gasUsed);
        console.log("Gas cost (ether):", (result.receipt.gasUsed * gasPrice) / 1e18);  // Convert gasUsed to ether using 1e18

        // Your assert statements here
    });

    it("should lock the payment fee", async () => {
        const requestDataHash = web3.utils.sha3("Test Data Request");
        const resultRequest = await dataRequestContract.requestData(requestDataHash, { from: accounts[0], gasPrice });

        const requestId = 1;
        const resultLockFee = await dataRequestContract.lockFee(requestId, { from: accounts[0], value: web3.utils.toWei("1", "ether"), gasPrice });

        // 输出 gas 使用和 gas cost（ether）
        console.log("Gas used:", resultLockFee.receipt.gasUsed);
        console.log("Gas cost (ether):", (resultLockFee.receipt.gasUsed * gasPrice) / 1e18);  // Convert gasUsed to ether using 1e18

        // Your assert statements here
    });
});
