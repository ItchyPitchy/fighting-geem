import { State } from 'geem-core'
import { Socket } from 'socket.io-client'
import { AmbientLight, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { InputHandler } from './InputHandler'

export class Game {
  private running = false
  private scene = new Scene()
  private camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  private renderer: WebGLRenderer
  private inputHandler: InputHandler
  private players: Mesh[] = []

  constructor(canvas: HTMLCanvasElement, socket: Socket) {
    this.renderer = new WebGLRenderer({ canvas: canvas })
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    this.camera.position.set(0, 0, 5)
    this.camera.lookAt(0, 0, 0)

    const light = new AmbientLight(0x404040)
    this.scene.add(light)
    this.inputHandler = new InputHandler(socket)

    socket.on('joined', (state: State) => {
      for (const player of state.players) {
        const geometry = new BoxGeometry(1, 1, 1)
        const material = new MeshBasicMaterial({ color: 0x00ff00 })
        const cube = new Mesh(geometry, material)
        cube.position.set(player.position.x, player.position.y, 0)
        cube.name = player.id
        this.players.push(cube)
        this.scene.add(cube)
      }
    })

    socket.on('state', (state: State) => {
      console.log(state.players.length)
      for (const player of state.players) {
        const mesh = this.players.find(x => x.name === player.id)
                
        if (mesh) {
          mesh.position.set(player.position.x, player.position.y, 0)
        } else {
          const geometry = new BoxGeometry(1, 1, 1)
          const material = new MeshBasicMaterial({ color: 0x00ff00 })
          const cube = new Mesh(geometry, material)
          cube.position.set(player.position.x, player.position.y, 0)
          cube.name = player.id
          this.players.push(cube)
          this.scene.add(cube) 
        }
      }
    })

    socket.on('disconnected', (id: string) => {
      const index = this.players.findIndex((x) => x.name === id)

      const [player] = this.players.splice(index, 1)

      this.scene.remove(player)
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
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.update.bind(this))
  }
}