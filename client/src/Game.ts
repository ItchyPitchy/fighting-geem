import {
  ComponentType, EntityType, Vector, ServerToClientEvents, ClientToServerEvents,
} from 'geem-core'
import { Entity } from './Entities/Entity'
import { Socket } from 'socket.io-client'
import {
  AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer,
} from 'three'
import { Player } from './Entities/Player'
import { ControlledMovement } from './Components/ControlledMovement'
import { Physical } from './Components/Physical'
import { System } from './Systems/System'

export class Game {
  private scene = new Scene()

  private camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  private renderer: WebGLRenderer

  private lastFrame = Date.now()

  private entities: Entity[] = []

  private systems: System[] = []

  public readonly socket: Socket<ServerToClientEvents, ClientToServerEvents>

  constructor(canvas: HTMLCanvasElement, socket: Socket<ServerToClientEvents, ClientToServerEvents>) {
    this.socket = socket
    this.renderer = new WebGLRenderer({ canvas: canvas })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.position.set(0, 0, 5)
    this.camera.lookAt(0, 0, 0)

    const light = new AmbientLight(0x404040)
    this.scene.add(light)

    window.addEventListener('resize', this.onResize.bind(this))

    socket.on('state', (state) => {
      const objectsForDeletion = this.entities.filter((entity) => !state.entities.find((serverEntity) => serverEntity.id === entity.id))
      for (const objectForDeletion of objectsForDeletion) {
        const index = this.entities.indexOf(objectForDeletion)
        this.entities.splice(index, 1)
        this.scene.remove(objectForDeletion.object)
      }

      for (const serverEntity of state.entities) {
        const entity = this.entities.find((entity) => serverEntity.id === entity.id)
        // if entity exists already,
        // check which components it has on server side, add new component based on component typeif its missing,
        // add component values,
        // if client-entity has component and missing on server, remove component.

        if (entity) {

          if (socket.id !== serverEntity.id) {
            if (entity.object.position.manhattanDistanceTo(new Vector3(serverEntity.position.x, serverEntity.position.y, 0)) > 0.02) { // SYNC POSITION IF DIFFERENCE TOO BIG
              entity.object.position.set(serverEntity.position.x, serverEntity.position.y, 0)
              console.log('hard synced position')
            }
          } else {
            if (entity.object.position.manhattanDistanceTo(new Vector3(serverEntity.position.x, serverEntity.position.y, 0)) > 0.4) { // SYNC POSITION IF DIFFERENCE TOO BIG
              entity.object.position.set(serverEntity.position.x, serverEntity.position.y, 0)
              console.log('hard synced position')
            }
          }

          entity.components = entity.components.filter((component) => serverEntity.components.find((x) => x.type === component.type))

          for (const serverEntityComponent of serverEntity.components) {
            switch (serverEntityComponent.type) {
              case ComponentType.CONTROLLED_MOVEMENT:
                if (!entity.hasComponent(ControlledMovement)) {
                  const controlledMovement = new ControlledMovement()
                  controlledMovement.direction = new Vector(serverEntityComponent.direction.x, serverEntityComponent.direction.y)
                  controlledMovement.speed = serverEntityComponent.speed
                  entity.addComponent(controlledMovement)
                } else {
                  const controlledMovement = entity.getComponent(ControlledMovement)
                  controlledMovement.direction = new Vector(serverEntityComponent.direction.x, serverEntityComponent.direction.y)
                  controlledMovement.speed = serverEntityComponent.speed
                }
                break
              case ComponentType.PHYSICAL:
                if (!entity.hasComponent(Physical)) {
                  entity.addComponent(new Physical(serverEntityComponent.weight, new Vector(serverEntityComponent.velocity.x, serverEntityComponent.velocity.y)))
                } else {
                  const physical = entity.getComponent(Physical)
                  physical.weight = serverEntityComponent.weight
                  physical.velocity.set(serverEntityComponent.velocity.x, serverEntityComponent.velocity.y)
                }
                break
            }
          }

        } else {
          // if entity doesnt exist, create entity based on entity type,
          // check for components and add based on component type,
          // add correct values to components.
          // add entity to scene and push entityobject to entity array

          let entity: Entity | null = null
          switch (serverEntity.type) {
            case EntityType.PLAYER: {
              const geometry = new BoxGeometry(1, 1, 1)
              const material = new MeshBasicMaterial({ color: 0x00ff00 })
              entity = new Player(serverEntity.id, new Mesh(geometry, material))

              break
            }
            case EntityType.PUNCH: {
              const geometry = new BoxGeometry(1, 1, 1)
              const material = new MeshBasicMaterial({ color: 0xff0000 })
              entity = new Player(serverEntity.id, new Mesh(geometry, material))

              break
            }
          }

          if (entity) {
            for (const serverEntityComponent of serverEntity.components) {
              switch (serverEntityComponent.type) {
                case ComponentType.CONTROLLED_MOVEMENT:
                  entity.addComponent(new ControlledMovement())
                  break
                case ComponentType.PHYSICAL:
                  entity.addComponent(new Physical(serverEntityComponent.weight, new Vector(serverEntityComponent.velocity.x, serverEntityComponent.velocity.y)))
                  break
              }
            }

            entity.object.position.set(serverEntity.position.x, serverEntity.position.y, 0)
            this.scene.add(entity.object)
            this.entities.push(entity)
          }
        }
      }
    })
  }

  public start() {
    this.update()
  }

  private update() {
    const now = Date.now()
    const dt = now - this.lastFrame

    for (const system of this.systems) {
      const filteredEntities = this.entities.filter((entity) => system.appliesTo(entity))
      system.update(dt * 0.001, filteredEntities, this)
    }

    this.lastFrame = now
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.update.bind(this))
  }

  public addSystem(system: System) {
    this.systems.push(system)
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)
  }

  private onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }
}
