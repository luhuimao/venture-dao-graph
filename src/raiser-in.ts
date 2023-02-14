/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2023-01-06 11:00:10
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-01-07 15:13:39
 */
import { BigInt } from "@graphprotocol/graph-ts"
import {
    GPDaoOnboardingAdapterContract,
    ProposalProcessed,
    ProposalCreated
} from "../generated/GPDaoOnboardingAdapterContract/GPDaoOnboardingAdapterContract"
import { VintageRiaserInProposal } from "../generated/schema"

export function handleProposalCreated(event: ProposalCreated): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = VintageRiaserInProposal.load(event.params.proposalId.toHex())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new VintageRiaserInProposal(event.params.proposalId.toHex())

        // Entity fields can be set using simple assignments
    }

    // BigInt and BigDecimal math are supported

    // Entity fields can be set based on event parameters
    entity.daoAddr = event.params.daoAddr;
    entity.proposalId = event.params.proposalId;

    entity.daoAddr = event.params.daoAddr
    entity.proposalId = event.params.proposalId
    entity.applicant = event.params.applicant
    entity.creationTime = event.params.creationTime
    entity.stopVoteTime = event.params.stopVoteTime
    entity.state = BigInt.fromI32(0);
    entity.stateInString = "Voting";


    // Entities can be written to the store with `.save()`
    entity.save()

}

export function handleProposalProcessed(event: ProposalProcessed): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = VintageRiaserInProposal.load(event.params.proposalId.toHex())
    // BigInt and BigDecimal math are supported
    if (entity) { // Entity fields can be set based on event parameters
        entity.state = BigInt.fromI32(event.params.state);
        entity.stateInString = event.params.state == 1 ? "Passed" : "Failed";

        // Entities can be written to the store with `.save()`
        entity.save()
    }

}
