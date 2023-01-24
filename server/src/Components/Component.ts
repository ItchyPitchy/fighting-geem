import { ComponentType, JSON } from 'geem-core'

export class Component {
  constructor(protected readonly type: ComponentType) {}

  public toJSON(): JSON {
    throw new Error('Component#toJSON not implemented')
  }
}