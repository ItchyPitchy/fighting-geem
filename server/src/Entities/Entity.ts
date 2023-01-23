import { EntityType } from 'geem-core'

export type Constructor<T> = new (...args: any[]) => T

// TODO: Use or remove interface??
export interface EntityInterface {
  id: string
  type: EntityType
  position: {
    x: number
    y: number
  }

  getComponent<T>(type: Constructor<T>): T
  addComponent(component: object): void
  addComponents(components: object[]): void
  hasComponent(type: Constructor<object>): boolean
  hasComponents(...type: Constructor<object>[]): boolean
}

export class Entity {
  private readonly components: object[] = []
  public id: string
  public type: EntityType // TODO: Rename EntityType
  public position: {
    x: number
    y: number
  }

  constructor(id: string, type: EntityType, position: { x: number, y: number }) {
    this.id = id
    this.type = type
    this.position = position
  }

  public getComponent<T>(type: Constructor<T>): T {
    for (const component of this.components) {
      if (component instanceof type) {
        return component as unknown as T
      }
    }

    throw 'No component available, use Entity#hasComponent to check existance first.'
  }

  public addComponent(component: object): void {
    this.components.push(component)
  }

  public addComponents(...components: object[]): void {
    for (const component of components) {
      this.addComponent(component)
    }
  }

  public hasComponent(type: Constructor<object>): boolean {
    for (const component of this.components) {
      if (component instanceof type) {
        return true
      }
    }

    return false
  }

  public hasComponents(...types: Constructor<object>[]): boolean {
    for (const type of types) {
      if (!this.hasComponent(type)) {
        return false
      }
    }

    return true
  }
}