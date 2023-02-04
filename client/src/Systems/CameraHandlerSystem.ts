import { Entity } from '../Entities/Entity'
import { Vector3 } from 'three'
import { System } from './System'
import { CameraFocus } from '../Components/CameraFocus'
import { Game } from '../Game'

export class CameraHandlerSystem extends System {
  private offset = new Vector3()

  private direction = false

  private maxRange = 0

  constructor() {
    super()

    document.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  public onMouseMove(event: MouseEvent) {
    // eslint-disable-next-line max-len
    const direction = new Vector3(Math.min(Math.max((event.pageX - innerWidth / 2) / 100, -this.maxRange), this.maxRange), Math.min(Math.max((innerHeight / 2 - event.pageY) / 100, -this.maxRange), this.maxRange))
    this.offset.set(direction.x, direction.y, direction.z)
    this.direction = direction.x > 0
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(CameraFocus)
  }

  public update(dt: number, entities: Entity[], game: Game): void {
    console.log(entities)
    for (const entity of entities) {
      const cameraFocusComponent = entity.getComponent(CameraFocus)
      this.maxRange = cameraFocusComponent.maxRange

      if (!this.direction) {
        entity.object.rotation.y = Math.PI / -2
      } else {
        entity.object.rotation.y = Math.PI / 2
      }

      game.camera.position.lerp(new Vector3(entity.object.position.x + this.offset.x, entity.object.position.y + this.offset.y, game.camera.position.z), 0.5)
    }
  }
}
