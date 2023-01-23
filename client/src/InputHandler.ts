import { Socket } from 'socket.io-client'

export class InputHandler {
  private keyDownHandler: (e: KeyboardEvent) => void
  private mouseDownHandler: (e: MouseEvent) => void

  constructor(socket: Socket) {
    const keyDownHandler = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'w': {
          socket.emit('moveUp')
          break
        }
        case 's': {
          socket.emit('moveDown')
          break
        }
        case 'a': {
          socket.emit('moveLeft')
          break
        }
        case 'd': {
          socket.emit('moveRight')
          break
        }
      }
    }

    const mouseDownHandler = (e: MouseEvent) => {
      switch(e.buttons) {
        case 1: {
          socket.emit('punch')
          break
        }
      }
    }
    
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('mousedown', mouseDownHandler)
    
    this.keyDownHandler = keyDownHandler
    this.mouseDownHandler = mouseDownHandler
  }
}