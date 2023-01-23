import { Entity } from 'geem-core'
import { Temporary } from '../Components/Temporary'
import { System } from './System'

export class TemporarySystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(Temporary)
  }

  public update(dt: number, entities: Entity[]): void {
    for (const entity of entities) {
      let ms = entity.getComponent(Temporary).ms
      ms -= dt

      if (ms <= 0) {
        //remove entity
      }
    }
  }
}