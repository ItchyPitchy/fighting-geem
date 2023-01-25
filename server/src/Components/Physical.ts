import { ComponentType, Vector } from 'geem-core'
import { Component } from './Component'

export class Physical extends Component {
  constructor(public weight: number, public velocity: Vector) {
    super(ComponentType.PHYSICAL)
  }

  public toJSON() {
    return {
      type: this.type,
      weight: this.weight,
      velocity: {
        x: this.velocity.x,
        y: this.velocity.y
      }
    }
  }
}