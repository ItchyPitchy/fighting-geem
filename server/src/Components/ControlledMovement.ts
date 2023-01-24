import { ComponentType } from 'geem-core'
import { Component } from './Component'

export enum Movement {
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export class ControlledMovement extends Component {
  public movement = new Set<Movement>()
  public speed = 1

  constructor() {
    super(ComponentType.CONTROLLED_MOVEMENT)
  }

  public toJSON() {
    return {
      speed: this.speed
    }
  }
}