import { GameServer } from '..'
import { System } from './System'
import { Entity } from '../Entities/Entity'
import { Decaying } from '../Components/Decaying'

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
      decayingComponent.s = decayingComponent.s - dt
      
      if (decayingComponent.s <= 0) {
        callBack()
      }
    }
  }
}
