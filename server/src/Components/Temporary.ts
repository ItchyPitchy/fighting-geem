import { ComponentType } from 'geem-core'
import { Component } from './Component'

export class Temporary extends Component {
  public ms: number

  constructor(ms: number) {
    super(ComponentType.TEMPORARY)
    
    this.ms = ms
  }
}