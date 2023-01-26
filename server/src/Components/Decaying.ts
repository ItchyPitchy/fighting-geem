import { ComponentType } from 'geem-core'
import { Component } from './Component'

export class Decaying extends Component {
  constructor(public s: number, public callBack: () => void) {
    super(ComponentType.DECAYING)
  }

  public toJSON() {
    return {
      type: this.type,
      s: this.s,
    }
  }
}
