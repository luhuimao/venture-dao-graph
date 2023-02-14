/*
 * @Descripttion: 
 * @version: 
 * @Author: huhuimao
 * @Date: 2023-01-05 19:50:32
 * @LastEditors: huhuimao
 * @LastEditTime: 2023-02-08 15:26:44
 */
import { BigInt } from "@graphprotocol/graph-ts"
import {
  SummonDao,
  FlexDaoCreated,
  VintageDaoCreated
} from "../generated/SummonDao/SummonDao"
import { DaoEntiy } from "../generated/schema"

export function handleFlexDaoCreated(event: FlexDaoCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = DaoEntiy.load(event.params.name)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new DaoEntiy(event.params.name);

    entity.daoAddr = event.params.daoAddr;
    entity.daoName = event.params.name;
    entity.creator = event.params.creator;
    entity.daoType = "flex";
    entity.createTimeStamp = event.block.timestamp;
    entity.createDateTime = new Date(event.block.timestamp.toI64() * 1000).toISOString();
  } else {
    entity.daoType = "flex";
  }
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
  // - contract.summonFlexDao(...)
  // - contract.summonVintageDao(...)
}

export function handleVintageDaoCreated(event: VintageDaoCreated): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = DaoEntiy.load(event.params.name)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new DaoEntiy(event.params.name)

    // Entity fields can be set using simple assignments
  }

  // BigInt and BigDecimal math are supported

  // Entity fields can be set based on event parameters
  entity.daoAddr = event.params.daoAddr;
  entity.daoName = event.params.name;
  entity.creator = event.params.creator;
  entity.daoType = "vintage";
  entity.createTimeStamp = event.block.timestamp;
  entity.createDateTime = new Date(event.block.timestamp.toI64() * 1000).toISOString();
  // Entities can be written to the store with `.save()`
  entity.save()
}
