import { Socket } from 'socket.io-client'
import { InputAction, Vector } from 'geem-core'
import { Game } from './Game'

export class MouseMoveHandler {
  private readonly direction = new Vector(0, 0)

  private readonly socket: Socket

  constructor(socket: Socket, game: Game) {
    this.socket = socket

    document.addEventListener('mousemove', this.onMouseMove.bind(this))
  }

  private onMouseMove(event: MouseEvent): void {
    const x = event.clientX
    const y = event.clientY

    this.direction.set(x - window.innerWidth/2, window.innerHeight/2 - y)
  }

  public update(): void {
    if (!this.direction.length()) return
    this.socket.emit('mouseMoveAction', {x: this.direction.x, y: this.direction.y})
  }
}
