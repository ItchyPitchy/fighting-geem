import { Entity } from 'geem-core'

export class System {
  public appliesTo(entity: Entity): boolean {
    return false
  }

  public update(dt: number, entities: Entity[]): void {
    throw new Error('Not implemented')
  }
}
