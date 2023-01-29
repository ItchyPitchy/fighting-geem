import { InputAction, Vector } from 'geem-core'
import { Game } from '../Game'
import { System } from './System'
import { Entity } from '../Entities/Entity'
import { ControlledMovement } from '../Components/ControlledMovement'

export class InputHandlerSystem extends System {
  private readonly inputActions = new Set<InputAction>()

  constructor() {
    super()

    document.addEventListener('keydown', this.onKeyDown.bind(this))
    document.addEventListener('keyup', this.onKeyUp.bind(this))
    document.addEventListener('mousedown', this.onMouseDown.bind(this))
  }

  public appliesTo(entity: Entity): boolean {
    return entity.hasComponent(ControlledMovement)
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.inputActions.add(InputAction.PRIMARY_ATTACK)
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (event.buttons === 1) {
      this.inputActions.delete(InputAction.PRIMARY_ATTACK)
    } else if (event.buttons === 2) {
      this.inputActions.delete(InputAction.SECONDARY_ATTACK)
    }
  }

  private onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'w') {
      this.inputActions.add(InputAction.MOVEUP)
    } else if (event.key === 's') {
      this.inputActions.add(InputAction.MOVEDOWN)
    } else if (event.key === 'a') {
      this.inputActions.add(InputAction.MOVELEFT)
    } else if (event.key === 'd') {
      this.inputActions.add(InputAction.MOVERIGHT)
    } else if (event.key === 'space') {
      this.inputActions.add(InputAction.DODGE)
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'w') {
      this.inputActions.delete(InputAction.MOVEUP)
    } else if (event.key === 's') {
      this.inputActions.delete(InputAction.MOVEDOWN)
    } else if (event.key === 'a') {
      this.inputActions.delete(InputAction.MOVELEFT)
    } else if (event.key === 'd') {
      this.inputActions.delete(InputAction.MOVERIGHT)
    } else if (event.key === 'space') {
      this.inputActions.delete(InputAction.DODGE)
    }
  }

  public update(dt: number, filteredEntities: Entity[], game: Game): void {
    if (this.inputActions.size === 0) return

    for (const entity of filteredEntities) { //Make movement feel instant
      if (entity.id === game.socket.id) {
        const controlledMovement = entity.getComponent(ControlledMovement)

        const direction = new Vector(0, 0)

        if (this.inputActions.has(InputAction.MOVEUP)) {
          direction.add(new Vector(0, 1))
        }

        if (this.inputActions.has(InputAction.MOVEDOWN)) {
          direction.add(new Vector(0, -1))
        }

        if (this.inputActions.has(InputAction.MOVELEFT)) {
          direction.add(new Vector(-1, 0))
        }

        if (this.inputActions.has(InputAction.MOVERIGHT)) {
          direction.add(new Vector(1, 0))
        }

        controlledMovement.direction = direction.normalize().clone()
      }
    }

    game.socket.emit('inputAction', Array.from(this.inputActions))

    if (this.inputActions.has(InputAction.PRIMARY_ATTACK)) {
      game.socket.emit('punch')
      this.inputActions.delete(InputAction.PRIMARY_ATTACK)
    }
  }
}
