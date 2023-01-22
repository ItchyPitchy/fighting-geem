import { Server } from 'socket.io'
import { State } from 'geem-core'

const io = new Server({ 
  cors: {
    origin: 'http://localhost:1234',
    methods: ['GET', 'POST'],
  }
})

const state: State = {
  players: [],
}

io.on('connection', (socket) => {
  const player = {
    id: socket.id,
    position: {
      x: 0,
      y: 0,
    }
  }

  state.players.push(player)

  socket.emit('joined', state)

  socket.on('moveUp', () => {
    console.log(socket.id + 'moveUp')

    player.position.y += 0.2
  })

  socket.on('moveDown', () => {
    console.log(socket.id + 'moveDown')

    player.position.y -= 0.2
  })

  socket.on('moveLeft', () => {
    console.log(socket.id + 'moveLeft')

    player.position.x -= 0.2
  })

  socket.on('moveRight', () => {
    console.log(socket.id + 'moveRight')

    player.position.x += 0.2
  })

  socket.on('disconnect', () => {
    const player = state.players.find((player) => player.id === socket.id)
		
    io.emit('disconnected', socket.id)

    if (player) {
      state.players.splice(state.players.indexOf(player), 1)
    }
  })
})

setInterval(() => {
  io.emit('state', state)
}, 30)

io.listen(3000)