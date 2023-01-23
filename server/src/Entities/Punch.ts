import { EntityType, Vector } from 'geem-core'
import { Entity } from './Entity'

export class Punch extends Entity {
  public vector: Vector

  constructor(id: string, x: number, y: number) {
    super(id, EntityType.PUNCH, { x, y })
    
    this.vector = new Vector(x, y)
  }
}