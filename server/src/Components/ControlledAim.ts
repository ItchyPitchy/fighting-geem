import { ComponentType, Vector } from 'geem-core'
import { Component } from './Component'

export class ControlledAim extends Component {
  public direction = new Vector(0, 0)

  constructor() {
    super(ComponentType.CONTROLLED_AIM)
  }

  public toJSON() {
    return {
      type: this.type,
      direction: {
        x: this.direction.x,
        y: this.direction.y
      },
    }
  }
}