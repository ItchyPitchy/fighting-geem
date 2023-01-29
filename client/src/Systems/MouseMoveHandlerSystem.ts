import { Vector } from 'geem-core'
import { Game } from '../Game'
import { System } from '../Systems/System'
import { Entity } from '../Entities/Entity'

export class MouseMoveHandlerSystem extends System {
  private readonly direction = new Vector(0, 0)

  constructor() {
    super()

    document.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  public appliesTo(entity: Entity) {
    return false
  }

  private onMouseMove(event: MouseEvent): void {
    const x = event.clientX
    const y = event.clientY

    this.direction.set(x - window.innerWidth/2, window.innerHeight/2 - y)
  }

  public update(dt: number, entities: Entity[], game: Game): void {
    if (!this.direction.length()) return
    game.socket.emit('mouseMoveAction', {x: this.direction.x, y: this.direction.y})
  }
}
