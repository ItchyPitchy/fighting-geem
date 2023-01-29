import { ComponentType, Vector } from 'geem-core'
import { Component } from './Component'

export enum Movement {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export class ControlledMovement extends Component<ComponentType.CONTROLLED_MOVEMENT> {
  public movement = new Set<Movement>()

  public direction = new Vector(0, 0)

  public speed = 1

  constructor() {
    super(ComponentType.CONTROLLED_MOVEMENT)
  }

  public toJSON() {
    return {
      type: this.type,
      speed: this.speed,
      direction: {
        x: this.direction.x,
        y: this.direction.y,
      },
    }
  }
}
