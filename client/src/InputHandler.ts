import { Socket } from 'socket.io-client'

export class InputHandler {
  private keyDownHandler: (e: KeyboardEvent) => void

  constructor(socket: Socket) {
    const keyDownHandler = (e: KeyboardEvent) => {
      switch(e.key) {
      case 'ArrowUp': {
        socket.emit('moveUp')
        break
      }
      case 'ArrowDown': {
        socket.emit('moveDown')
        break
      }
      case 'ArrowLeft': {
        socket.emit('moveLeft')
        break
      }
      case 'ArrowRight': {
        socket.emit('moveRight')
        break
      }
      }
    }
    
    document.addEventListener('keydown', keyDownHandler)
    
    this.keyDownHandler = keyDownHandler
  }
}