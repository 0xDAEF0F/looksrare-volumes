/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./api/context"




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenObjects {
  Exchange: { // root type
    id: string; // ID!
    name: string; // String!
    ticker: string; // String!
    tokenAddress: string; // String!
    tokenCap: number; // Int!
    tokenSupply: number; // Float!
  }
  ExchangeLog: { // root type
    dailyVolume: string; // String!
    dailyVolumeExcludingZeroFee?: number | null; // Float
    date: string; // String!
    exchangeId: string; // String!
    id: string; // ID!
    priceHigh?: number | null; // Float
    priceLow?: number | null; // Float
  }
  Query: {};
  VolumeByMonth: { // root type
    allVolume?: number | null; // Float
    currency?: string | null; // String
    volumeExcludingZeroFee?: number | null; // Float
    volumeInUSD?: number | null; // Float
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Exchange: { // field return type
    dailyLogs: Array<NexusGenRootTypes['ExchangeLog'] | null> | null; // [ExchangeLog]
    id: string; // ID!
    name: string; // String!
    ticker: string; // String!
    tokenAddress: string; // String!
    tokenCap: number; // Int!
    tokenSupply: number; // Float!
  }
  ExchangeLog: { // field return type
    dailyVolume: string; // String!
    dailyVolumeExcludingZeroFee: number | null; // Float
    date: string; // String!
    exchangeId: string; // String!
    id: string; // ID!
    priceHigh: number | null; // Float
    priceLow: number | null; // Float
  }
  Query: { // field return type
    exchange: NexusGenRootTypes['Exchange'] | null; // Exchange
    volume: NexusGenRootTypes['VolumeByMonth'] | null; // VolumeByMonth
  }
  VolumeByMonth: { // field return type
    allVolume: number | null; // Float
    currency: string | null; // String
    volumeExcludingZeroFee: number | null; // Float
    volumeInUSD: number | null; // Float
  }
}

export interface NexusGenFieldTypeNames {
  Exchange: { // field return type name
    dailyLogs: 'ExchangeLog'
    id: 'ID'
    name: 'String'
    ticker: 'String'
    tokenAddress: 'String'
    tokenCap: 'Int'
    tokenSupply: 'Float'
  }
  ExchangeLog: { // field return type name
    dailyVolume: 'String'
    dailyVolumeExcludingZeroFee: 'Float'
    date: 'String'
    exchangeId: 'String'
    id: 'ID'
    priceHigh: 'Float'
    priceLow: 'Float'
  }
  Query: { // field return type name
    exchange: 'Exchange'
    volume: 'VolumeByMonth'
  }
  VolumeByMonth: { // field return type name
    allVolume: 'Float'
    currency: 'String'
    volumeExcludingZeroFee: 'Float'
    volumeInUSD: 'Float'
  }
}

export interface NexusGenArgTypes {
  Query: {
    exchange: { // args
      ticker: string; // String!
    }
    volume: { // args
      month: number; // Int!
      year: number; // Int!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}