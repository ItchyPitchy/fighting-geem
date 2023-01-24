import { Entity } from 'geem-core'
import { System } from './System'

export class VelocitySystem extends System {
  constructor() {
    super()
  }

  public appliesTo(gameObject: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[]): void {
  }
}