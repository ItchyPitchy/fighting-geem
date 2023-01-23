import { Entity } from '../../server/src/Entities/Entity'

export type State = {
  players: string[]
  entities: Entity[]
}

export enum EntityType {
  PLAYER,
  PUNCH,
}

export enum ComponentType {
  TEMPORARY,
}
