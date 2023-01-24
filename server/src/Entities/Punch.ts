import { EntityType, Vector } from 'geem-core'
import { Entity } from './Entity'

export class Punch extends Entity {
  constructor(id: string) {
    super(id, EntityType.PUNCH)
  }
}