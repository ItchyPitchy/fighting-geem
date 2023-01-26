import { Entity } from './Entities/Entity'
import { Physical } from './Components/Physical'
import { Vector3 } from 'three'

export class VelocitySystem {
  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(Physical)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      const physicalComponent = entity.getComponent(Physical)
      const weight = physicalComponent.weight
      const velocity = physicalComponent.velocity
      entity.object.position.add(new Vector3(
        velocity.clone().multiplyScalar(dt).x,
        velocity.clone().multiplyScalar(dt).y,
        0,
      ))
    }
  }
}
