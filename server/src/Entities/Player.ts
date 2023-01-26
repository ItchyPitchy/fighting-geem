import { EntityType, Vector } from 'geem-core'
import { ControlledAim } from '../Components/ControlledAim'
import { ControlledMovement } from '../Components/ControlledMovement'
import { Physical } from '../Components/Physical'
import { Entity } from './Entity'

export class Player extends Entity {
  constructor(id: string) {
    super(id, EntityType.PLAYER)

    this.addComponents(
      new ControlledMovement(),
      new ControlledAim(),
      new Physical(1, new Vector(0, 0)),
    )
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
