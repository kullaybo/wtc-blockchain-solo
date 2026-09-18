import { test } from "node:test";
import assert from "node:assert/strict";
import hre from "hardhat";

test("VotingDAO - Core Functionality", async (t) => {
    
    await t.test("Should deploy and create a proposal successfully", async () => {
        // 1. Deploy the contract using Viem
        const votingDAO = await hre.viem.deployContract("VotingDAO");
        
        // 2. Create a proposal (10 minutes duration)
        // Note: Viem requires BigInts (adding 'n') for uint256 values
        await votingDAO.write.createProposal(["Fund the new WTC campus coffee machine", 10n]);
        
        // 3. Read the proposal count to ensure it incremented
        const count = await votingDAO.read.proposalCount();
        assert.equal(count, 1n, "Proposal count should be 1");
        
        // 4. Read the proposal details and verify
        const proposal = await votingDAO.read.proposals([1n]);
        
        // proposal returns a tuple (array) matching the struct:
        // [id, description, voteCount, deadline, executed]
        assert.equal(proposal[1], "Fund the new WTC campus coffee machine");
        assert.equal(proposal[2], 0n, "Initial vote count should be 0");
        assert.equal(proposal[4], false, "Should not be executed yet");
    });

});