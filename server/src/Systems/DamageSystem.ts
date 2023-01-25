import { System } from './System'
import { Entity } from '../Entities/Entity'

export class DamageSystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[]): void {
    throw new Error('Not implemented')
  }
}
