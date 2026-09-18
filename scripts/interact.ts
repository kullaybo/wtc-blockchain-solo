import { network } from "hardhat";
import hardhat from "hardhat";

async function main() {
  const contractAddress = "0xc70A9D5EB83d58A7f461b8F698CB12c052907378";
  
  console.log(`Connecting to VotingDAO at ${contractAddress} on Sepolia...`);

  // Access viem via the hardhat runtime environment object directly
  const votingDAO = await hardhat.viem.getContractAt("VotingDAO", contractAddress);

  // 1. Read initial proposal count
  const proposalCountBefore = await votingDAO.read.proposalCount();
  console.log(`Current Proposal Count: ${proposalCountBefore}`);

  // 2. Create a new testnet proposal
  console.log("Creating a new proposal on Sepolia...");
  const tx = await votingDAO.write.createProposal([
    "Testnet DAO Governance Upgrade",
    48n
  ]);
  console.log(`Proposal creation transaction hash: ${tx}`);

  // 3. Read updated proposal count
  const proposalCountAfter = await votingDAO.read.proposalCount();
  console.log(`Updated Proposal Count: ${proposalCountAfter}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});