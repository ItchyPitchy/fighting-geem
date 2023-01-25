import { Entity } from '../../server/src/Entities/Entity'

export type JSON = { [key: string]: string | number | boolean | JSON[] | JSON }

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
  CONTROLLED_MOVEMENT
}

export enum InputAction {
  MOVEUP,
  MOVEDOWN,
  MOVELEFT,
  MOVERIGHT,
  PRIMARY_ATTACK,
  SECONDARY_ATTACK,
  DODGE
}