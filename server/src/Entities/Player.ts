import { EntityType } from 'geem-core'
import { Entity } from './Entity'

export class Player extends Entity {
  constructor(id: string) {
    super(id, EntityType.PLAYER)
  }

  public toJSON() {
    return {
      id: this.id,
      position: {
        x: this.position.x,
        y: this.position.y
      },
      type: this.type,
      components: this.components.map((component) => component.toJSON())
    }
  }
}