import { EntityType } from 'geem-core'
import { Entity } from './Entity'

export class Player extends Entity {
  constructor(id: string, position: { x: number, y: number }) {
    super(id, EntityType.PLAYER, position)

    // this.addComponent()
  }

  public serialize() {
    return {
      id: this.id,
      position: this.position,
      type: this.type,
    }
  }
}