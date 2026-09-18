import { test } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";

test("VotingDAO Smart Contract Suite", async (t) => {
  await t.test("Should create a proposal and verify initial state", async () => {
    const votingDAO = await hre.viem.deployContract("VotingDAO");

    // Create proposal with 30 minute voting window
    await votingDAO.write.createProposal(["Upgrade campus workstations", 30n]);

    const count = await votingDAO.read.proposalCount();
    assert.equal(count, 1n, "Proposal count should be 1");

    const proposal = await votingDAO.read.proposals([1n]);
    assert.equal(proposal[1], "Upgrade campus workstations");
    assert.equal(proposal[2], 0n, "Initial vote count must be 0");
    assert.equal(proposal[4], false, "Proposal should not be executed");
  });

  await t.test("Should allow accounts to vote and increment vote count", async () => {
    const votingDAO = await hre.viem.deployContract("VotingDAO");
    const [owner, voter1] = await hre.viem.getWalletClients();

    await votingDAO.write.createProposal(["Fund solar backup array", 60n]);

    // Vote from voter1 wallet
    await votingDAO.write.vote([1n], { account: voter1.account });

    const proposal = await votingDAO.read.proposals([1n]);
    assert.equal(proposal[2], 1n, "Vote count should increment to 1");

    const hasVoted = await votingDAO.read.hasVoted([1n, voter1.account.address]);
    assert.equal(hasVoted, true, "Voter status should be recorded");
  });

  await t.test("Should revert when an account votes twice", async () => {
    const votingDAO = await hre.viem.deployContract("VotingDAO");
    const [voter] = await hre.viem.getWalletClients();

    await votingDAO.write.createProposal(["Setup local testnet faucet", 60n]);

    // First vote succeeds
    await votingDAO.write.vote([1n], { account: voter.account });

    // Duplicate vote must throw
    await assert.rejects(
      async () => {
        await votingDAO.write.vote([1n], { account: voter.account });
      },
      /Already voted/
    );
  });
});