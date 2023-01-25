import { Server } from 'socket.io'
import { InputAction } from 'geem-core'
import { Punch } from './Entities/Punch'
import { Player } from './Entities/Player'
import { ControlledMovement, Movement } from './Components/ControlledMovement'
import { ControlledMovementSystem } from './Systems/ControlledMovementSystem'
import { System } from './Systems/System'
import { DecaySystem } from './Systems/DecaySystem'
import { VelocitySystem } from './Systems/VelocitySystem'
import { Decaying } from './Components/Decaying'
import { Entity } from './Entities/Entity'
import { Physical } from './Components/Physical'
import { ControlledAim } from './Components/ControlledAim'

interface State {
  players: string[]
  entities: Entity[]
}

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

  for (const f of fns)
    if (f !== skip) f(dt)

  while (time <= t + t1 / 4) time += t1
  setTimeout(animFrame, time - t)
}

animFrame()

const requestAnimationFrame = (func: any) => {
  funcs.push(func)
  return funcs.length - 1
}

const cancelAnimationFrame = (id: number) => {
  funcs[id] = skip
}

export class GameServer {
  private running = false

  private io = new Server({
    cors: {
      origin: 'http://localhost:1234',
      methods: [ 'GET', 'POST' ],
    },
  })

  private systems: System[] = []

  private state: State = {
    players: [],
    entities: [],
  }

  private update(dt: number) {
    if (!this.running) return

    for (const system of this.systems) {
      const filteredEntities = this.state.entities.filter((entity) => system.appliesTo(entity))

      system.update(dt, filteredEntities, this)
    }

    requestAnimationFrame(this.update.bind(this))
  }

  public addSystem(system: System) {
    this.systems.push(system)
  }

  public addEntity(entity: Entity) {
    this.state.entities.push(entity)
  }

  public removeEntity(entity: Entity) {
    this.state.entities = this.state.entities.filter((e) => e.id !== entity.id)
  }

  public start() {
    this.running = true
    this.io.listen(3000)

    this.io.on('connection', (socket) => {
      console.log('connected state', this.state)
      this.state.players.push(socket.id)

      const entity = new Player(socket.id)
      this.state.entities = [ ...this.state.entities, entity ]
      console.log(this.state.entities)

      socket.on('inputAction', (inputActions) => {
        if (!entity.hasComponent(ControlledMovement)) return

        const controlledMovementComponent = entity.getComponent(ControlledMovement)

        for (const inputAction of inputActions) {
          if (inputAction === InputAction.MOVEUP) {
            controlledMovementComponent.movement.add(Movement.UP)
          } else if (inputAction === InputAction.MOVEDOWN) {
            controlledMovementComponent.movement.add(Movement.DOWN)
          } else if (inputAction === InputAction.MOVELEFT) {
            controlledMovementComponent.movement.add(Movement.LEFT)
          } else if (inputAction === InputAction.MOVERIGHT) {
            controlledMovementComponent.movement.add(Movement.RIGHT)
          }
        }
      })

      socket.on('mouseMoveAction', (direction) => {
        const controlledAimComponent = entity.getComponent(ControlledAim)
        controlledAimComponent.direction.set(direction.x, direction.y)
      })

      socket.on('disconnect', () => {
        const player = this.state.players.find((playerId) => playerId === socket.id)
        const playerGameObject = this.state.entities.find((entity) => entity.id === socket.id)

        if (player) {
          this.state.players = this.state.players.filter((playerId) => playerId !== player)
        }

        if (playerGameObject) {
          this.removeEntity(playerGameObject)
        }
      })

      socket.on('punch', () => {
        const player = this.state.entities.find((obj) => obj.id === socket.id)
        const id = (Math.random() * 10000).toString()

        if (player) {
          const entity = new Punch(id)

          if (!player.hasComponent(ControlledAim)) return

          const controlledAimComponent = player.getComponent(ControlledAim)

          entity.position.set(player.position.x, player.position.y)
          entity.addComponent(new Physical(0, controlledAimComponent.direction.clone().normalize()))
          entity.addComponent(new Decaying(2000, () => this.removeEntity(entity)))

          this.state.entities.push(entity)
        }
      })

      setInterval(() => { // Sync loop
        this.io.emit('state', this.state)
      }, 60)

      this.update(0.14)
    })
  }

  public stop() {
    this.running = false
  }
}

const gameServer = new GameServer()
gameServer.addSystem(new ControlledMovementSystem())
gameServer.addSystem(new DecaySystem())
gameServer.addSystem(new VelocitySystem())
gameServer.start()
