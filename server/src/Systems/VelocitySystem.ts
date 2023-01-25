import { Entity } from 'geem-core'
import { Physical } from '../Components/Physical'
import { System } from './System'

export class VelocitySystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(Physical)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      const physicalComponent = entity.getComponent(Physical)
      const weight = physicalComponent.weight
      const velocity = physicalComponent.velocity

      entity.position.add(velocity.clone().multiplyScalar(dt * 0.001))
    }
  }
}