/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2022-11-22 15:32:03
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-01-17 13:48:28
 */
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
    FlexFundingAdapterContract,
    ProposalCreated,
    ProposalExecuted
} from "../generated/FlexFundingAdapterContract/FlexFundingAdapterContract"
import { FlexFundingProposal } from "../generated/schema"

export function handleProposalCreated(event: ProposalCreated): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = FlexFundingProposal.load(event.params.proposalId.toHex())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new FlexFundingProposal(event.params.proposalId.toHex())
    }

    // BigInt and BigDecimal math are supported
    // entity.count = entity.count + BigInt.fromI32(1)
    let flexFundingContract = FlexFundingAdapterContract.bind(event.address);
    let proposalInfo = flexFundingContract.Proposals((event.params.daoAddress),
        event.params.proposalId);

    // Entity fields can be set based on event parameters
    entity.proposalId = event.params.proposalId
    entity.daoAddress = event.params.daoAddress;
    entity.proposer = event.params.proposer;
    entity.tokenAddress = proposalInfo.getFundingInfo().tokenAddress;
    entity.minFundingAmount = proposalInfo.getFundingInfo().minFundingAmount;
    entity.maxFundingAmount = proposalInfo.getFundingInfo().maxFundingAmount;
    entity.escrow = proposalInfo.getFundingInfo().escrow;
    entity.returnTokenAddr = proposalInfo.getFundingInfo().returnTokenAddr;
    entity.returnTokenAmount = proposalInfo.getFundingInfo().returnTokenAmount;
    entity.price = proposalInfo.getFundingInfo().price;
    entity.minReturnAmount = proposalInfo.getFundingInfo().minReturnAmount;
    entity.maxReturnAmount = proposalInfo.getFundingInfo().maxReturnAmount;
    entity.approverAddr = proposalInfo.getFundingInfo().approverAddr;
    entity.recipientAddr = proposalInfo.getFundingInfo().tokenAddress;
    entity.vestingStartTime = proposalInfo.getVestInfo().vestingStartTime;
    entity.vestingCliffDuration = proposalInfo.getVestInfo().vestingCliffDuration;
    entity.vestingStepDuration = proposalInfo.getVestInfo().vestingStepDuration;
    entity.vestingSteps = proposalInfo.getVestInfo().vestingSteps;
    entity.vestingCliffLockAmount = proposalInfo.getVestInfo().vestingCliffLockAmount;
    entity.fundRaiseType = BigInt.fromI32(proposalInfo.getFundRaiseInfo().fundRaiseType);
    entity.fundRaiseStartTime = proposalInfo.getFundRaiseInfo().fundRaiseStartTime;
    entity.fundRaiseEndTime = proposalInfo.getFundRaiseInfo().fundRaiseEndTime;
    entity.minDepositAmount = proposalInfo.getFundRaiseInfo().minDepositAmount;
    entity.maxDepositAmount = proposalInfo.getFundRaiseInfo().maxDepositAmount;
    entity.backerIdentification = proposalInfo.getFundRaiseInfo().backerIdentification;
    entity.bType = BigInt.fromI32(proposalInfo.getFundRaiseInfo().bakckerIdentificationInfo.bType);
    entity.bChainId = proposalInfo.getFundRaiseInfo().bakckerIdentificationInfo.bChainId;
    entity.bTokanAddr = proposalInfo.getFundRaiseInfo().bakckerIdentificationInfo.bTokanAddr;
    entity.bTokenId = proposalInfo.getFundRaiseInfo().bakckerIdentificationInfo.bTokenId;
    entity.bMinHoldingAmount = proposalInfo.getFundRaiseInfo().bakckerIdentificationInfo.bMinHoldingAmount;
    entity.priorityDeposit = proposalInfo.getFundRaiseInfo().priorityDeposit;
    entity.pPeriod = proposalInfo.getFundRaiseInfo().priorityDepositInfo.pPeriod;
    entity.pPeriods = proposalInfo.getFundRaiseInfo().priorityDepositInfo.pPeriods;
    entity.pType = BigInt.fromI32(proposalInfo.getFundRaiseInfo().priorityDepositInfo.pType);
    entity.pChainId = proposalInfo.getFundRaiseInfo().priorityDepositInfo.pChainId;
    entity.pTokenAddr = proposalInfo.getFundRaiseInfo().priorityDepositInfo.pTokenAddr;
    entity.pTokenId = proposalInfo.getFundRaiseInfo().priorityDepositInfo.pTokenId;
    entity.pMinHolding = proposalInfo.getFundRaiseInfo().priorityDepositInfo.pMinHolding;
    entity.tokenRewardAmount = proposalInfo.getProposerRewardInfo().tokenRewardAmount;
    entity.cashRewardAmount = proposalInfo.getProposerRewardInfo().cashRewardAmount;
    entity.startVoteTime = proposalInfo.getStartVoteTime();
    entity.stopVoteTime = proposalInfo.getStopVoteTime();
    entity.state = BigInt.fromI32(proposalInfo.getState());
    entity.createDateTime = new Date(event.block.timestamp.toI64() * 1000).toISOString();
    // Entities can be written to the store with `.save()`
    entity.save()

    // Note: If a handler doesn't require existing field values, it is faster
    // _not_ to load the entity from the store. Instead, create it fresh with
    // `new Entity(...)`, set the fields that should be updated and save the
    // entity back to the store. Fields that were not set or unset remain
    // unchanged, allowing for partial updates to be applied.

    // It is also possible to access smart contracts from mappings. For
    // example, the contract that has emitted the event can be connected to
    // with:
    //
    // let contract = Contract.bind(event.address)
    //
    // The following functions can then be called on this contract to access
    // state variables and other data:
    //
    // - contract.Proposals(...)
    // - contract.isActiveGeneralPartner(...)
    // - contract.isActiveMember(...)
    // - contract.latestProposalId(...)
    // - contract.previousProposalId(...)
    // - contract.proposalIds(...)
}

export function handleproposalExecuted(event: ProposalExecuted): void {
    let entity = FlexFundingProposal.load(event.params.proposalId.toHex())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (entity) {
        entity.state = BigInt.fromI32(event.params.state);
        entity.save();
    }
}
