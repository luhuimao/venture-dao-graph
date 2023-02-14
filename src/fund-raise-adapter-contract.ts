/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2022-11-22 15:32:03
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-01-18 08:56:41
 */
import { BigInt } from "@graphprotocol/graph-ts"
import {
  FundRaiseAdapterContract,
  ProposalCreated,
  proposalExecuted
} from "../generated/FundRaiseAdapterContract/FundRaiseAdapterContract"
import { VintageFundRaiseProposal } from "../generated/schema"

export function handleProposalCreated(event: ProposalCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = VintageFundRaiseProposal.load(event.params.proposalId.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new VintageFundRaiseProposal(event.params.proposalId.toHex())
  }

  // BigInt and BigDecimal math are supported
  // entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.proposalId = event.params.proposalId;
  entity.daoAddress = event.params.daoAddr;

  const fundRaiseContract = FundRaiseAdapterContract.bind(event.address);
  const fundRaiseProposalInfo = fundRaiseContract.Proposals(event.params.daoAddr, event.params.proposalId);

  entity.acceptTokenAddr = fundRaiseProposalInfo.getAcceptTokenAddr();
  entity.fundRaiseTarget = fundRaiseProposalInfo.getFundRaiseTarget();
  entity.fundRaiseMaxAmount = fundRaiseProposalInfo.getFundRaiseMaxAmount();
  entity.lpMinDepositAmount = fundRaiseProposalInfo.getLpMinDepositAmount();
  entity.lpMaxDepositAmount = fundRaiseProposalInfo.getLpMaxDepositAmount();
  entity.fundRaiseStartTime = fundRaiseProposalInfo.getTimesInfo().fundRaiseStartTime;
  entity.fundRaiseEndTime = fundRaiseProposalInfo.getTimesInfo().fundRaiseEndTime;
  entity.fundEndTime = fundRaiseProposalInfo.getTimesInfo().fundRaiseEndTime.plus(fundRaiseProposalInfo.getTimesInfo().fundTerm);
  entity.redemptPeriod = fundRaiseProposalInfo.getTimesInfo().redemptPeriod;
  entity.redemptDuration = fundRaiseProposalInfo.getTimesInfo().redemptDuration;
  entity.state = BigInt.fromI32(0);
  entity.createDateTime = new Date(event.block.timestamp.toI64() * 1000).toISOString();
  // Entities can be written to the store with `.save()`
  entity.save()
}

export function handleproposalExecuted(event: proposalExecuted): void {
  let entity = VintageFundRaiseProposal.load(event.params.proposalId.toHex())
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity) {
    entity.state = BigInt.fromI32(event.params.state);
    entity.save();
  }
}
