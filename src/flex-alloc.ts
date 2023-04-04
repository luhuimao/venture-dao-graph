/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2022-11-16 17:01:41
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-03-24 09:08:35
 */
import {
    AllocateToken as AllocateTokenEvent,
    ConfigureDao as ConfigureDaoEvent,
    FlexAllocationAdapterContract
} from "../generated/FlexAllocationAdapterContract/FlexAllocationAdapterContract"
import {
    ConfigureDao,
    FlexFundingProposal,
    FlexVestingEligibleUsers,
    FlexUserVestInfo
} from "../generated/schema"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"

export function handleAllocateToken(event: AllocateTokenEvent): void {
    let entity = FlexVestingEligibleUsers.load(event.params.proposalId.toString())
    if (!entity) {
        entity = new FlexVestingEligibleUsers(event.params.proposalId.toString())
    }

    entity.proposalId = event.params.proposalId
    entity.proposer = event.params.proposer

    let tem: Bytes[] = [];

    if (event.params.lps.length > 0) {
        for (var j = 0; j < event.params.lps.length; j++) {
            tem.push(event.params.lps[j])
        }
    }
    entity.lps = tem;
    entity.save()


    let flexFundingProposalEntity = FlexFundingProposal.load(event.params.proposalId.toString())
    if (flexFundingProposalEntity) {
        const vestingStartTime = flexFundingProposalEntity!.vestingStartTime;
        const vestingCliffEndTime = flexFundingProposalEntity!.vestingCliffEndTime;
        const vestingInterval = flexFundingProposalEntity!.vestingInterval;
        const vestingEndTime = flexFundingProposalEntity!.vestingEndTime;

        let allocContract = FlexAllocationAdapterContract.bind(event.address);

        for (var i = 0; i < entity.lps.length; i++) {
            let flexUserVestInfo = new FlexUserVestInfo(entity.proposalId.toString() + "-" + entity.lps[i].toHexString());
            flexUserVestInfo.daoAddr = event.params.daoAddr;
            flexUserVestInfo.fundingProposalId = event.params.proposalId;
            flexUserVestInfo.recipient = entity.lps[i];
            let vestInfo = allocContract.vestingInfos(
                event.params.daoAddr,
                flexUserVestInfo.fundingProposalId,
                Address.fromBytes(flexUserVestInfo.recipient)
            );
            flexUserVestInfo.vestingStartTime = vestingStartTime;
            flexUserVestInfo.vestingCliffEndTime = vestingCliffEndTime;
            flexUserVestInfo.vestingInterval = vestingInterval;
            flexUserVestInfo.vestingEndTime = vestingEndTime;
            flexUserVestInfo.totalAmount = vestInfo.getTokenAmount();
            flexUserVestInfo.created = false;

            flexUserVestInfo.save();
        }
    }

}

export function handleConfigureDao(event: ConfigureDaoEvent): void {
    let entity = new ConfigureDao(
        event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
    entity.gpAllocationBonusRadio = event.params.gpAllocationBonusRadio
    entity.riceStakeAllocationRadio = event.params.riceStakeAllocationRadio
    entity.save()
}
