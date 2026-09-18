import hardhat from "hardhat";

async function main() {
  const contractAddress = "0xc70A9D5EB83d58A7f461b8F698CB12c052907378";
  
  console.log(`Connecting to VotingDAO at ${contractAddress} on Sepolia...`);
  const votingDAO = await hardhat.viem.getContractAt("VotingDAO", contractAddress);

  // 1. Read the latest proposal count
  const proposalCount = await votingDAO.read.proposalCount();
  console.log(`Current Total Proposals: ${proposalCount}`);

  if (proposalCount === 0n) {
    console.log("No proposals found to vote on!");
    return;
  }

  const targetProposalId = proposalCount; // Vote on the most recent proposal
  console.log(`Targeting Proposal ID: ${targetProposalId} for voting...`);

  // 2. Cast a vote on the proposal
  console.log("Submitting vote transaction to Sepolia...");
  const tx = await votingDAO.write.vote([targetProposalId]);
  console.log(`Vote transaction hash: ${tx}`);

  // 3. Fetch proposal details to confirm the vote incremented
  const proposal = await votingDAO.read.proposals([targetProposalId]);
  console.log(`Proposal Description: ${proposal[1]}`);
  console.log(`Updated Vote Count: ${proposal[2]}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});