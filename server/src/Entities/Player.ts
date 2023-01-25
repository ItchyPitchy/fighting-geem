import { EntityType } from 'geem-core'
import { ControlledAim } from '../Components/ControlledAim'
import { ControlledMovement } from '../Components/ControlledMovement'
import { Entity } from './Entity'

export class Player extends Entity {
  constructor(id: string) {
    super(id, EntityType.PLAYER)

    this.addComponent(new ControlledMovement())
    this.addComponent(new ControlledAim())
  }

  public toJSON() {
    return {
      id: this.id,
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      type: this.type,
      components: this.components.map((component) => component.toJSON()),
    }
  }
}
