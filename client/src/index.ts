import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from 'geem-core'
import { ControlledMovementSystem } from './Systems/ControlledMovementSystem'
import { Game } from './Game'
import { InputHandlerSystem } from './Systems/InputHandlerSystem'
import { MouseMoveHandlerSystem } from './Systems/MouseMoveHandlerSystem'
import { VelocitySystem } from './Systems/MovementSystem'
import { CameraHandlerSystem } from './Systems/CameraHandlerSystem'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000')

socket.on('connect', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const game = new Game(canvas, socket)
  game.addSystem(new CameraHandlerSystem())
  game.addSystem(new InputHandlerSystem())
  game.addSystem(new MouseMoveHandlerSystem())
  game.addSystem(new ControlledMovementSystem())
  game.addSystem(new VelocitySystem())
  game.start()
})

socket.connect()
