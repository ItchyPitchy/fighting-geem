import { io, Socket } from 'socket.io-client'
import { ClientToServerEvents, ServerToClientEvents } from 'geem-core'
import { Game } from './Game'

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io('http://localhost:3000')

socket.on('connect', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const game = new Game(canvas, socket)
  game.start()
})

socket.connect()
