import { Vector } from 'geem-core'
import { ControlledAim } from '../Components/ControlledAim'
import { Entity } from '../Entities/Entity'
import { System } from './System'

export class ControlledAimSystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(ControlledAim)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      const controlledAimComponent = entity.getComponent(ControlledAim)
      const direction = controlledAimComponent.direction

    }
  }
}
