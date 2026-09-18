import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const VotingDAOModule = buildModule("VotingDAOModule", (m) => {
  const votingDAO = m.contract("VotingDAO");
  return { votingDAO };
});

export default VotingDAOModule;