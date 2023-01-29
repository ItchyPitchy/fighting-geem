import { Vector3 } from 'three'
import { ControlledMovement } from '../Components/ControlledMovement'
import { Entity } from '../Entities/Entity'
import { Game } from '../Game'

export class ControlledMovementSystem {
  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(ControlledMovement)
  }

  public update(dt: number, entities: Entity[], game: Game): void {
    for (const entity of entities) {
      const controlledMovement = entity.getComponent(ControlledMovement)
      const direction = controlledMovement.direction
      const speed = controlledMovement.speed

      entity.object.position.add(new Vector3(direction.clone().multiplyScalar(speed).multiplyScalar(dt).x, direction.clone().multiplyScalar(speed).multiplyScalar(dt).y, 0))
    }
  }
}
