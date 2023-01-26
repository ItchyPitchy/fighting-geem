import { Object3D } from 'three'
import { Component } from '../Components/Component'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T

export class Entity {
  public components: Component[] = []

  constructor(
    public readonly id: string,
    public object: Object3D,
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
}
