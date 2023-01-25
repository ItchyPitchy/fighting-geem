import { GameServer } from '../index'
import { Entity } from '../Entities/Entity'

export class System {
  public appliesTo(entity: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[], GameServer: GameServer): void {
    throw new Error('Not implemented')
  }
}
