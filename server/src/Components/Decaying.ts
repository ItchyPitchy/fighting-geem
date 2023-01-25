import { ComponentType } from 'geem-core'
import { Component } from './Component'

export class Decaying extends Component {
  constructor(public ms: number, public callBack: () => void) {
    super(ComponentType.DECAYING)
  }

  public toJSON() {
    return {
      type: this.type,
      ms: this.ms,
    }
  }
}