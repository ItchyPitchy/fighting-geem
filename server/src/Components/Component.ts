import { ComponentDto, ComponentType } from 'geem-core'

export class Component<T extends ComponentType = ComponentType> {
  constructor(public readonly type: T) {}

  public toJSON(): ComponentDto {
    throw new Error('Component#toJSON not implemented')
  }
}
