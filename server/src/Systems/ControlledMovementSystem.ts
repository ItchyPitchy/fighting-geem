import { Entity, Vector } from 'geem-core'
import { ControlledMovement, Movement } from '../Components/ControlledMovement'
import { System } from './System'

export class ControlledMovementSystem extends System {
  constructor() {
    super()
  }

  public appliesTo(gameObject: Entity): boolean {
    return gameObject.hasComponent(ControlledMovement)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      const controlledMovementComponent = entity.getComponent(ControlledMovement)
      const movement = controlledMovementComponent.movement
      if (movement.size === 0) return;
      
      let direction = new Vector(0, 0)
      const speed = controlledMovementComponent.speed;
      
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

      
      if (direction.length() > 0) {
        entity.position.add(direction.normalize().multiplyScalar(speed).multiplyScalar(dt * 0.001))
      }
      movement.clear()
    }
  }
}