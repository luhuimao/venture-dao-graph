/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2023-01-06 11:00:10
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-03-02 16:25:09
 */
import { BigInt } from "@graphprotocol/graph-ts"
import {
    StewardManagementContract,
    ProposalProcessed,
    ProposalCreated
} from "../generated/StewardManagementContract/StewardManagementContract"
import { FlexStewardMangementProposal } from "../generated/schema";
// import { ethers } from "ethers";
export function handleProposalCreated(event: ProposalCreated): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = FlexStewardMangementProposal.load(event.params.proposalId.toString())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new FlexStewardMangementProposal(event.params.proposalId.toHex())

        // Entity fields can be set using simple assignments
    }

    // BigInt and BigDecimal math are supported

    // Entity fields can be set based on event parameters
    entity.daoAddr = event.params.daoAddr;
    entity.proposalId = event.params.proposalId;
    // entity.proposalIdUTF8String = ethers.toUtf8String(event.params.proposalId);
    entity.daoAddr = event.params.daoAddr;
    entity.stewardAddress = event.params.account;
    entity.creationTime = event.params.creationTime;
    entity.createTimeString = new Date(event.block.timestamp.toI64() * 1000).toISOString();
    entity.stopVoteTime = event.params.stopVoteTime;
    entity.stopVoteTimeString = new Date(event.params.stopVoteTime.toI64() * 1000).toISOString();
    entity.state = BigInt.fromI32(0);
    entity.stateInString = "Voting";
    entity.type = BigInt.fromI32(event.params.pType);
    entity.typeInString = event.params.pType == 0 ? "Steward In" : "Steward Out";

    // Entities can be written to the store with `.save()`
    entity.save()

}

export function handleProposalProcessed(event: ProposalProcessed): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = FlexStewardMangementProposal.load(event.params.proposalId.toString())
    // BigInt and BigDecimal math are supported
    if (entity) {   // Entity fields can be set based on event parameters
        entity.state = BigInt.fromI32(event.params.state);
        entity.stateInString = event.params.state == 1 ? "Passed" : "Failed";

        // Entities can be written to the store with `.save()`
        entity.save()
    }

}
