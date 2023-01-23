import { Object3D } from 'three'
import { Entity } from './Entity'

export class Player extends Entity {
  constructor(id: string, object: Object3D) {
    super(id, object)

    // this.addComponent()
  }
}