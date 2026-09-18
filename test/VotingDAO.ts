import { expect } from "chai";
import hre from "hardhat";

describe("VotingDAO Smart Contract Suite", function () {
  it("Should create a proposal and verify initial state", async function () {
    const votingDAO = await hre.viem.deployContract("VotingDAO");

    await votingDAO.write.createProposal(["Upgrade campus workstations", 30n]);

    const count = await votingDAO.read.proposalCount();
    expect(count).to.equal(1n, "Proposal count should be 1");

    const proposal = await votingDAO.read.proposals([1n]);
    expect(proposal[1]).to.equal("Upgrade campus workstations");
    expect(proposal[2]).to.equal(0n, "Initial vote count must be 0");
    expect(proposal[4]).to.be.false;
  });

  it("Should allow accounts to vote and increment vote count", async function () {
    const votingDAO = await hre.viem.deployContract("VotingDAO");
    const walletClients = await hre.viem.getWalletClients();
    const voter1 = walletClients[1]; // Use the second default wallet

    await votingDAO.write.createProposal(["Fund solar backup array", 60n]);

    // Vote from voter1 wallet
    await votingDAO.write.vote([1n], { account: voter1.account });

    const proposal = await votingDAO.read.proposals([1n]);
    expect(proposal[2]).to.equal(1n, "Vote count should increment to 1");

    const hasVoted = await votingDAO.read.hasVoted([1n, voter1.account.address]);
    expect(hasVoted).to.be.true;
  });

  it("Should revert when an account votes twice", async function () {
    const votingDAO = await hre.viem.deployContract("VotingDAO");
    const walletClients = await hre.viem.getWalletClients();
    const voter1 = walletClients[1];

    await votingDAO.write.createProposal(["Setup local testnet faucet", 60n]);

    // First vote succeeds
    await votingDAO.write.vote([1n], { account: voter1.account });

    // Duplicate vote must throw
    await expect(
      votingDAO.write.vote([1n], { account: voter1.account })
    ).to.be.rejectedWith("Already voted");
  });
});