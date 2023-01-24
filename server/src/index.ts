import { Server } from 'socket.io'
import { InputAction, State } from 'geem-core'
import { Punch } from './Entities/Punch'
import { DamageSystem } from './Systems/DamageSystem'
import { VelocitySystem } from './Systems/VelocitySystem'
import { Temporary } from './Components/Temporary'
import { Player } from './Entities/Player'
import { ControlledMovement, Movement } from './Components/ControlledMovement'
import { ControlledMovementSystem } from './Systems/ControlledMovementSystem'

const systems = [
  new DamageSystem(),
  new VelocitySystem(),
  new ControlledMovementSystem()
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

  state.players.push(socket.id)

  const entity = new Player(socket.id)
  state.entities.push(entity)

  entity.addComponent(new ControlledMovement())

  console.log(state.entities)

  socket.on('inputAction', (inputActions) => {
    for (const inputAction of inputActions) {
      if (entity.hasComponent(ControlledMovement)) {
        const controlledMovementComponent = entity.getComponent(ControlledMovement)
        if (inputAction === InputAction.MOVEUP) { controlledMovementComponent.movement.add(Movement.UP)} 
        else if (inputAction === InputAction.MOVEDOWN) { controlledMovementComponent.movement.add(Movement.DOWN) } 
        else if (inputAction === InputAction.MOVELEFT) { controlledMovementComponent.movement.add(Movement.LEFT) }
        else if (inputAction === InputAction.MOVERIGHT) { controlledMovementComponent.movement.add(Movement.RIGHT) }
      }
    }
  })

  socket.on('punch', () => {
    const player = state.entities.find((obj) => obj.id === socket.id)
    const id = (Math.random() * 10000).toString()

    if (player) {
      const entity = new Punch(id)
      entity.position.set(player.position.x, player.position.y)
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
let lastFrameTimestamp = Date.now()

const animFrame = () => {
  const fns = funcs.slice()
  funcs.length = 0

  const t = Date.now()
  const dt = t - lastFrameTimestamp
  lastFrameTimestamp = t
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
    const filteredEntities = state.entities.filter(entity => system.appliesTo(entity))

    system.update(dt, filteredEntities)
  }

  requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop)

setInterval(() => { // Sync loop  
  io.emit('state', state)
}, 60)

io.listen(3000)