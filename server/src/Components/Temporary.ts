import { ComponentType } from 'geem-core'
import { Component } from './Component'

export class Temporary extends Component {
  constructor(public ms: number) {
    super(ComponentType.TEMPORARY)
  }

  public toJSON() {
    return {
      type: this.type,
      ms: this.ms,
    }
  }
}