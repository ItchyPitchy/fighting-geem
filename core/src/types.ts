export type JSON = { [key: string]: string | number | boolean | JSON[] | JSON }

export enum EntityType {
  PLAYER,
  PUNCH,
}

export enum ComponentType {
  TEMPORARY,
}

interface Component {
  type: ComponentType
}

export interface TemporaryDto extends Component {
  type: ComponentType.TEMPORARY
}

export type ComponentDto = TemporaryDto

interface Entity {
  id: string
  position: {
    x: number
    y: number
  },
  type: EntityType
  components: ComponentDto
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
