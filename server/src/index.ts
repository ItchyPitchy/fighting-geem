import { Server } from 'socket.io'
import { State } from 'geem-core'
import { Punch } from './Entities/Punch'
import { DamageSystem } from './Systems/DamageSystem'
import { VelocitySystem } from './Systems/VelocitySystem'
import { Temporary } from './Components/Temporary'
import { Player } from './Entities/Player'

const systems = [
  new DamageSystem(),
  new VelocitySystem()
]

const io = new Server({ 
  cors: {
    origin: 'http://localhost:1234',
    methods: ['GET', 'POST'],
  }
})

const state: State = {
  players: [],
  entities: [],
}

io.on('connection', (socket) => {
  console.log('connected state', state)
  const entity = new Player(socket.id, { x: 0, y: 0 })

  state.entities.push(entity)
  state.players.push(socket.id)

  socket.on('moveUp', () => {
    entity.position.y += 0.2
  })

  socket.on('moveDown', () => {
    entity.position.y -= 0.2
  })

  socket.on('moveLeft', () => {
    entity.position.x -= 0.2
  })

  socket.on('moveRight', () => {
    entity.position.x += 0.2
  })

  socket.on('punch', () => {
    const player = state.entities.find((obj) => obj.id === socket.id)
    const id = (Math.random() * 10000).toString()

    if (player) {
      const entity = new Punch(id, player.position.x, player.position.y)
      entity.addComponent(new Temporary(1000))
      
      state.entities.push(entity)
    }
  })

  socket.on('disconnect', () => {
    const player = state.players.find((playerId) => playerId === socket.id)
    const playerGameObject = state.entities.find((entity) => entity.id === socket.id)
    
    if (player) {
      state.players = state.players.filter((playerId) => playerId !== player)
    }

    if (playerGameObject) {
      state.entities = state.entities.filter((entity) => entity.id !== playerGameObject.id)
    }
  })
})

const fps = 60
const funcs: any[] = []
const skip = Symbol('skip')
const start = Date.now()
let time = start

const animFrame = () => {
  const fns = funcs.slice()
  funcs.length = 0

  const t = Date.now()
  const dt = t - start
  const t1 = 1e3 / fps

  for(const f of fns)
    if(f !== skip) f(dt)

  while(time <= t + t1 / 4) time += t1
  setTimeout(animFrame, time - t)
}

const requestAnimationFrame = (func: any) => {
  funcs.push(func)
  return funcs.length - 1
}

const cancelAnimationFrame = (id: number) => {
  funcs[id] = skip
}

animFrame()

const gameLoop = (dt: number) => {
  for (const system of systems) {
    const filteredEntities = state.entities.filter(gameObject => system.appliesTo(gameObject))

    system.update(dt, filteredEntities)
  }

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)



// setInterval(() => { // Game loop
// }, 1000 / 60)

setInterval(() => { // Sync loop  
  io.emit('state', state)
}, 60)


io.listen(3000)