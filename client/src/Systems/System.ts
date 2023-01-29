import { Game } from '../Game'
import { Entity } from '../Entities/Entity'

export class System {
  public appliesTo(entity: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[], Game: Game): void {
    throw new Error('Not implemented')
  }
}
