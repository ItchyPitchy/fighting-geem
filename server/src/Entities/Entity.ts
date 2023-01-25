import {
  EntityType, JSON, Vector,
} from 'geem-core'
import { Component } from '../Components/Component'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T

export class Entity {
  public readonly components: Component[] = []

  public position = new Vector(0, 0)

  constructor(
    public readonly id: string,
    public type: EntityType,
  ) {}

  public getComponent<T>(type: Constructor<T>): T {
    for (const component of this.components) {
      if (component instanceof type) {
        return component
      }
    }

    throw new Error('No component available, use Entity#hasComponent to check existance first.')
  }

  public addComponent(component: Component): void {
    this.components.push(component)
  }

  public addComponents(...components: Component[]): void {
    for (const component of components) {
      this.addComponent(component)
    }
  }

  public hasComponent(type: Constructor<Component>): boolean {
    for (const component of this.components) {
      if (component instanceof type) {
        return true
      }
    }

    return false
  }

  public hasComponents(...types: Constructor<Component>[]): boolean {
    for (const type of types) {
      if (!this.hasComponent(type)) {
        return false
      }
    }

    return true
  }

  public toJSON(): JSON {
    throw new Error('Entity#toJSON not implemented')
  }
}
