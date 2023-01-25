import { ComponentType, JSON } from 'geem-core'

export class Component {
  constructor(public readonly type: ComponentType) {}

  public toJSON(): JSON {
    throw new Error('Component#toJSON not implemented')
  }
}
