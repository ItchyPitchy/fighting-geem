import { Vector } from 'geem-core'
import { System } from './System'
import { Entity } from '../Entities/Entity'
import { ControlledMovement, Movement } from '../Components/ControlledMovement'
import { Physical } from '../Components/Physical'

export class ControlledMovementSystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(ControlledMovement)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      const controlledMovementComponent = entity.getComponent(ControlledMovement)
      const movement = controlledMovementComponent.movement

      const direction = new Vector(0, 0)
      const speed = controlledMovementComponent.speed

      if (movement.has(Movement.UP)) {
        direction.add(new Vector(0, 1))
      }

      if (movement.has(Movement.DOWN)) {
        direction.add(new Vector(0, -1))
      }

      if (movement.has(Movement.LEFT)) {
        direction.add(new Vector(-1, 0))
      }

      if (movement.has(Movement.RIGHT)) {
        direction.add(new Vector(1, 0))
      }

      controlledMovementComponent.direction = direction.clone().normalize()

      movement.clear()
    }
  }
}
