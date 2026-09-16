// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract VotingDAO {
    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCount;
        uint256 deadline;
        bool executed;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    event ProposalCreated(uint256 indexed id, string description, uint256 deadline);
    event Voted(uint256 indexed proposalId, address indexed voter);
    event ProposalExecuted(uint256 indexed id);

    function createProposal(string calldata _description, uint256 _durationInMinutes) external returns (uint256) {
        require(_durationInMinutes > 0, "Duration must be greater than 0");

        proposalCount++;
        uint256 deadline = block.timestamp + (_durationInMinutes * 1 minutes);

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            voteCount: 0,
            deadline: deadline,
            executed: false
        });

        emit ProposalCreated(proposalCount, _description, deadline);
        return proposalCount;
    }

    function vote(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];

        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!hasVoted[_proposalId][msg.sender], "Already voted");

        proposal.voteCount++;
        hasVoted[_proposalId][msg.sender] = true;

        emit Voted(_proposalId, msg.sender);
    }

    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];

        require(_proposalId > 0 && _proposalId <= proposalCount, "Proposal does not exist");
        require(block.timestamp >= proposal.deadline, "Voting is still active");
        require(!proposal.executed, "Proposal already executed");

        proposal.executed = true;

        emit ProposalExecuted(_proposalId);
    }
}