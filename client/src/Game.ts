import { EntityType, State } from 'geem-core'
import { Entity } from './Entities/Entity'
import { Socket } from 'socket.io-client'
import { AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { InputHandler } from './InputHandler'
import { Player } from './Entities/Player'

export class Game {
  private running = false
  private scene = new Scene()
  private camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  private renderer: WebGLRenderer
  private inputHandler: InputHandler
  private players: Mesh[] = []
  
  private entities: Entity[] = []

  constructor(canvas: HTMLCanvasElement, socket: Socket) {
    this.renderer = new WebGLRenderer({ canvas: canvas })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.position.set(0, 0, 5)
    this.camera.lookAt(0, 0, 0)

    const light = new AmbientLight(0x404040)
    this.scene.add(light)
    this.inputHandler = new InputHandler(socket)

    window.addEventListener('resize', this.onResize.bind(this))

    socket.on('state', (state: State) => {
      const objectsForDeletion = this.entities.filter((entity) => !state.entities.find((serverEntity) => serverEntity.id === entity.id))
      for (const objectForDeletion of objectsForDeletion) {
        const index = this.entities.indexOf(objectForDeletion)
        this.entities.splice(index, 1)
        this.scene.remove(objectForDeletion.object)
      }

      for (const serverEntity of state.entities) {
        const entity = this.entities.find(entity => serverEntity.id === entity.id)

        if (entity) {
          entity.object.position.set(serverEntity.position.x, serverEntity.position.y, 0)
        } else {
          switch (serverEntity.type) {
            case EntityType.PLAYER: {
              const geometry = new BoxGeometry(1, 1, 1)
              const material = new MeshBasicMaterial({ color: 0x00ff00 })
              const cube = new Mesh(geometry, material)
              cube.position.set(serverEntity.position.x, serverEntity.position.y, 0)
              
              this.entities.push(new Player(serverEntity.id, cube))
              this.scene.add(cube)

              break
            }
            case EntityType.PUNCH: {
              const geometry = new BoxGeometry(1, 1, 1)
              const material = new MeshBasicMaterial({ color: 0xff0000 })
              const cube = new Mesh(geometry, material)
              cube.position.set(serverEntity.position.x, serverEntity.position.y, 0)
              
              this.entities.push(new Player(serverEntity.id, cube))
              this.scene.add(cube)

              break
            }
          }
        }
      }
    })
  }

  public start() {
    this.running = true
    this.update()
  }

  public stop() {
    this.running = false
  }

  private update() {
    this.inputHandler.update()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.update.bind(this))
  }

  private onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }
}