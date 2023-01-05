import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  FlexDaoCreated,
  VintageDaoCreated
} from "../generated/SummonDao/SummonDao"

export function createFlexDaoCreatedEvent(
  daoAddr: Address,
  creator: Address
): FlexDaoCreated {
  let flexDaoCreatedEvent = changetype<FlexDaoCreated>(newMockEvent())

  flexDaoCreatedEvent.parameters = new Array()

  flexDaoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoAddr", ethereum.Value.fromAddress(daoAddr))
  )
  flexDaoCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return flexDaoCreatedEvent
}

export function createVintageDaoCreatedEvent(
  daoAddr: Address,
  creator: Address
): VintageDaoCreated {
  let vintageDaoCreatedEvent = changetype<VintageDaoCreated>(newMockEvent())

  vintageDaoCreatedEvent.parameters = new Array()

  vintageDaoCreatedEvent.parameters.push(
    new ethereum.EventParam("daoAddr", ethereum.Value.fromAddress(daoAddr))
  )
  vintageDaoCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return vintageDaoCreatedEvent
}
