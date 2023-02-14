/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2022-11-16 17:00:56
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-01-17 13:48:31
 */
import {
  ProposalCreated as ProposalCreatedEvent,
  ProposalExecuted as ProposalExecutedEvent,
  StartVote as handleStartVoteEvent,
  DistributeFundContractV2
} from "../generated/DistributeFundContractV2/DistributeFundContractV2"
import { VintageFundingProposal } from "../generated/schema"
import { bigInt, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"

export function handleProposalCreated(event: ProposalCreatedEvent): void {

  let entity = VintageFundingProposal.load(event.params.proposalId.toString())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new VintageFundingProposal(event.params.proposalId.toString())
    // Entity fields can be set using simple assignments
    // entity.count = BigInt.fromI32(0)
  }

  let distributeV2Contract = DistributeFundContractV2.bind(event.address);
  const vintageFundingProposalInfo = distributeV2Contract.
    distributions(event.params.daoAddr,
      event.params.proposalId);
  entity.proposalId = event.params.proposalId
  entity.daoAddress = event.params.daoAddr;
  entity.projectTokenAddress = vintageFundingProposalInfo.getTokenAddr();
  entity.projectTeamAddress = vintageFundingProposalInfo.getRecipientAddr();
  entity.approveOwnerAddress = vintageFundingProposalInfo.getApproveOwnerAddr();
  entity.tradingOffTokenAmount = vintageFundingProposalInfo.getTradingOffTokenAmount();
  entity.requestedFundAmount = vintageFundingProposalInfo.getRequestedFundAmount();
  entity.inQueueTimestamp = vintageFundingProposalInfo.getInQueueTimestamp();
  entity.voteStartingTimestamp = vintageFundingProposalInfo.getProposalStartVotingTimestamp();
  entity.voteEndTimestamp = vintageFundingProposalInfo.getProposalStopVotingTimestamp();
  entity.proposalExecuteTimestamp = vintageFundingProposalInfo.getProposalExecuteTimestamp();
  entity.vestingStartTIme = vintageFundingProposalInfo.getVestInfo().vestingStartTime;
  entity.vestingCliffDuration = vintageFundingProposalInfo.getVestInfo().vestingCliffDuration;
  entity.vestingStepDuration = vintageFundingProposalInfo.getVestInfo().vestingStepDuration;
  entity.vestingSteps = vintageFundingProposalInfo.getVestInfo().vestingSteps;
  entity.vestingCliffLockAmount = vintageFundingProposalInfo.getVestInfo().vestingCliffLockAmount;
  entity.state = BigInt.fromI32(0);
  entity.createDateTime = new Date(event.block.timestamp.toI64() * 1000).toISOString();

  entity.save()
}

export function handleProposalExecuted(event: ProposalExecutedEvent): void {
  let proposalEntity = VintageFundingProposal.load(event.params.proposalID.toString())
  if (proposalEntity) {
    proposalEntity.state = event.params.state;
    proposalEntity.proposalExecuteTimestamp = event.block.timestamp;
    proposalEntity.save();
  }
}

export function handleStartVote(event: handleStartVoteEvent): void {
  let entity = VintageFundingProposal.load(event.params.proposalID.toString())
  if (entity) {
    entity.state = BigInt.fromI32(event.params.state);
    entity.voteStartingTimestamp = event.params.startVoteTime;
    entity.voteEndTimestamp = event.params.stopVoteTime;
    entity.save();
  }
}