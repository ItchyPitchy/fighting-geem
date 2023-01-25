import { Object3D } from 'three'

export type Constructor<T> = new (...args: any[]) => T

export class Entity {
  private readonly components: object[] = []

  public id: string

  public object: Object3D

  constructor(id: string, object: Object3D) {
    this.id = id
    this.object = object
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
