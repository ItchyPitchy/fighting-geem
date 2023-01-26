import { System } from './System'
import { Entity } from '../Entities/Entity'
import { Physical } from '../Components/Physical'
import { ControlledMovement } from '../Components/ControlledMovement'

export class MovementSystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(ControlledMovement)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      const controlledMovement = entity.getComponent(ControlledMovement)
      const direction = controlledMovement.direction
      const speed = controlledMovement.speed
      entity.position.add(direction.clone().multiplyScalar(speed).multiplyScalar(dt))
    }
  }
}
