import { io } from 'socket.io-client'
import { Game } from './Game'

const socket = io('http://localhost:3000')

socket.on('connect', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement
  const game = new Game(canvas, socket)
  game.start()
})

socket.connect()
