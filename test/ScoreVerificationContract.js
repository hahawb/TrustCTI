const truffleAssert = require("truffle-assertions");
const ScoreVerificationContract = artifacts.require("ScoreVerificationContract");

contract("ScoreVerificationContract", accounts => {
  const user = accounts[0];
  const CS = 8;
  const DQ = 9;
  const OT = 7;
  const DS = 10;
  const DI = 6;

  const hashedCS = web3.utils.soliditySha3(CS.toString());
  const hashedDQ = web3.utils.soliditySha3(DQ.toString());
  const hashedOT = web3.utils.soliditySha3(OT.toString());
  const hashedDS = web3.utils.soliditySha3(DS.toString());
  const hashedDI = web3.utils.soliditySha3(DI.toString());

  const gasPrice = web3.utils.toWei("20", "gwei");

  it("should store hashed scores and return gas cost", async () => {
    const instance = await ScoreVerificationContract.new(user);
    const tx = await instance.submitHashedScores(hashedCS, hashedDQ, hashedOT, hashedDS, hashedDI, { from: user, gasPrice: gasPrice });

    truffleAssert.eventEmitted(tx, "HashedScoresSubmitted");

    // Wait for confirmation and retrieve transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(tx.tx);

    const gasUsed = receipt.gasUsed;
    const gasCost = await calculateGasCost(gasUsed, gasPrice);
    
    console.log("Gas used for submitHashedScores:", gasUsed);
    console.log("Gas cost (ether) for submitHashedScores:", gasCost);
  });

  it("should store plain scores and return gas cost", async () => {
    const instance = await ScoreVerificationContract.new(user);
    const tx = await instance.submitPlainScores(CS, DQ, OT, DS, DI, { from: user, gasPrice: gasPrice });

    truffleAssert.eventEmitted(tx, "PlainScoresSubmitted");

    // Wait for confirmation and retrieve transaction receipt
    const receipt = await web3.eth.getTransactionReceipt(tx.tx);

    const gasUsed = receipt.gasUsed;
    const gasCost = await calculateGasCost(gasUsed, gasPrice);

    console.log("Gas used for submitPlainScores:", gasUsed);
    console.log("Gas cost (ether) for submitPlainScores:", gasCost);
  });

  

  // Helper function to calculate gas cost
  async function calculateGasCost(gasUsed, gasPrice) {
    return gasUsed * gasPrice / 1e18; // Convert gas to ether
  }
});