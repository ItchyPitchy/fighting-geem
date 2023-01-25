import { Socket } from 'socket.io-client'
import { InputAction } from 'geem-core'
import { Game } from './Game'

export class InputHandler {
  private readonly inputActions = new Set<InputAction>()
  private readonly socket: Socket

  constructor(socket: Socket, game: Game) {
    this.socket = socket

    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
    document.addEventListener('mousedown', this.onMouseDown.bind(this))
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.socket.emit("punch")
    } else if (event.buttons === 2) {
      this.inputActions.add(InputAction.SECONDARY_ATTACK)
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.inputActions.delete(InputAction.PRIMARY_ATTACK)
    } else if (event.buttons === 2) {
      this.inputActions.delete(InputAction.SECONDARY_ATTACK)
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'w') { 
      this.inputActions.add(InputAction.MOVEUP)
    } else if (event.key === 's') {
      this.inputActions.add(InputAction.MOVEDOWN)
    } else if (event.key === 'a') {
      this.inputActions.add(InputAction.MOVELEFT)
    } else if (event.key === 'd') {
      this.inputActions.add(InputAction.MOVERIGHT)
    } else if (event.key === 'space') {
      this.inputActions.add(InputAction.DODGE)
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'w') {
      this.inputActions.delete(InputAction.MOVEUP)
    } else if (event.key === 's') {
      this.inputActions.delete(InputAction.MOVEDOWN)
    } else if (event.key === 'a') {
      this.inputActions.delete(InputAction.MOVELEFT)
    } else if (event.key === 'd') {
      this.inputActions.delete(InputAction.MOVERIGHT)
    } else if (event.key === 'space') {
      this.inputActions.delete(InputAction.DODGE)
    }
  }

  public update(): void {
    if (this.inputActions.size === 0) return
    this.socket.emit('inputAction', Array.from(this.inputActions))
  }
}