/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2022-12-14 11:38:25
 * @LastEditors: huhuimao
 * @LastEditTime: 2022-12-19 09:18:53
 */

import { BigInt } from "@graphprotocol/graph-ts"
import {
    FlexVesting,
    CancelVesting,
    CreateVesting,
    LogUpdateOwner,
    OwnershipTransferred,
    Withdraw
} from "../generated/FlexVesting/FlexVesting"
import { FlexVestEntity, UserVestInfo } from "../generated/schema"

export function handleCreateVesting(event: CreateVesting): void {
    let entity = FlexVestEntity.load(event.params.vestId.toString())

    // Entities only exist after they have been saved to the store;
    // `null` checks allow to create entities on demand
    if (!entity) {
        entity = new FlexVestEntity(event.params.vestId.toString())

        // Entity fields can be set using simple assignments
        // entity.count = BigInt.fromI32(0)
    }

    // BigInt and BigDecimal math are supported
    // entity.count = entity.count + BigInt.fromI32(1)

    // Entity fields can be set based on event parameters
    entity.vestId = event.params.vestId
    entity.recipient = event.params.recipient
    entity.proposalId = event.params.proposalId
    entity.cliffShares = event.params.cliffShares
    entity.stepShares = event.params.stepShares
    entity.tokenAddress = event.params.token
    entity.startTime = event.params.start
    entity.cliffDuration = event.params.cliffDuration
    entity.stepDuration = event.params.stepDuration
    entity.steps = event.params.steps
    entity.totalAmount = entity.stepShares * entity.steps + entity.cliffShares;
    entity.claimedAmount = BigInt.fromI32(0);
    // Entities can be written to the store with `.save()`
    entity.save()

    let userVestInfo = UserVestInfo.load(entity.proposalId.toString() + "-" + entity.recipient.toHexString());
    if (userVestInfo) {
        userVestInfo.created = true;
        userVestInfo.save();
    }

}


export function handleWithdraw(event: Withdraw): void {
    let entity = FlexVestEntity.load(event.params.vestId.toString())
    if (entity) {
        let vestingContract = FlexVesting.bind(event.address);
        let vestInfo = vestingContract.vests(event.params.vestId);
        entity.claimedAmount = vestInfo.getClaimed();
        entity.save();
    }
}
