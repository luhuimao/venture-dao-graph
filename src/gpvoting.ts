/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2023-01-06 11:00:10
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-01-18 08:57:29
 */
import { BigInt } from "@graphprotocol/graph-ts"
import {
    GPVotingContract,
    SubmitVote,
    StartNewVotingForProposal
} from "../generated/GPVotingContract/GPVotingContract"
import { VintageVotesEntity } from "../generated/schema"

export function handleStartNewVotingForProposal(event: StartNewVotingForProposal): void {

}

export function handleSubmitVote(event: SubmitVote): void {
    // Entities can be loaded from the store using a string ID; this ID
    // needs to be unique across all entities of the same type
    let entity = VintageVotesEntity.load(event.transaction.hash.toHex())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new VintageVotesEntity(event.transaction.hash.toHex())

        // Entity fields can be set using simple assignments
    }

    // BigInt and BigDecimal math are supported

    // Entity fields can be set based on event parameters
    entity.daoAddr = event.params.daoAddr;
    entity.proposalId = event.params.proposalId;
    entity.voter = event.params.voter;
    entity.voteValue = event.params.voteValue;
    entity.votingWeight = event.params.votingWeight;
    entity.nbYes = event.params.nbYes;
    entity.nbNo = event.params.nbNo;
    entity.votedTimeStamp = event.params.blocktime;
    entity.votedDateTime = new Date(event.params.blocktime.toI64()).toISOString();
    // Entities can be written to the store with `.save()`
    entity.save()
}
