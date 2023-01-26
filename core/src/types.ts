export type JSON = { [key: string]: string | number | boolean | JSON[] | JSON }

export enum InputAction {
  MOVEUP,
  MOVEDOWN,
  MOVELEFT,
  MOVERIGHT,
  PRIMARY_ATTACK,
  SECONDARY_ATTACK,
  DODGE
}

export enum EntityType {
  PLAYER,
  PUNCH,
}

export enum ComponentType {
  DECAYING,
  CONTROLLED_MOVEMENT,
  CONTROLLED_AIM,
  PHYSICAL
}

interface Component {
  type: ComponentType
}

export interface DecayingDto extends Component {
  type: ComponentType.DECAYING,
}

export interface PhysicalDto extends Component {
  type: ComponentType.PHYSICAL,
  velocity: { x: number, y: number },
  weight: number
}

export interface ControlledMovement extends Component {
  type: ComponentType.CONTROLLED_MOVEMENT,
  speed: number,
  direction: { x: number, y: number }
}

export type ComponentDto = DecayingDto | PhysicalDto | ControlledMovement

interface Entity {
  id: string
  position: {
    x: number
    y: number
  },
  type: EntityType
  components: ComponentDto[]
}

export interface PlayerDto extends Entity {
  type: EntityType.PLAYER
}

export interface PunchDto extends Entity {
  type: EntityType.PUNCH
}

export type EntityDto = PlayerDto | PunchDto

export interface StateDto {
  players: string[]
  entities: EntityDto[]
}
