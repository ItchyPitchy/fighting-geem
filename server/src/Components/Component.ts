import { ComponentType } from 'geem-core'

export class Component {
  private type: ComponentType

  constructor(type: ComponentType) {
    this.type = type
  }
}