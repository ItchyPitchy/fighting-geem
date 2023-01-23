import { Entity } from 'geem-core'
import { System } from './System'

export class DamageSystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[]): void {
    console.log('Damagesystem ran')
  }
}