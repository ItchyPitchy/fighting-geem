import { Entity } from 'geem-core'
import { GameServer } from '..'
import { Decaying } from '../Components/Decaying'
import { System } from './System'

export class DecaySystem extends System {
  constructor() {
    super()
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(Decaying)
  }

  public update(dt: number, entities: Entity[], GameServer: GameServer): void {
    for (const entity of entities) {
      const decayingComponent = entity.getComponent(Decaying)
      const callBack = decayingComponent.callBack

      decayingComponent.ms = decayingComponent.ms - dt

      if (decayingComponent.ms <= 0) {
        callBack()
      }
    }
  }
}