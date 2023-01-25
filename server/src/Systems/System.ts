import { Entity } from 'geem-core'
import { GameServer } from '../index'

export class System {
  public appliesTo(entity: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[], GameServer: GameServer): void {
    throw new Error('Not implemented')
  }
}
