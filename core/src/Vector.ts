export class Vector {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2))
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y
  }

  norm() {
    return {
      x: this.x / this.magnitude(),
      y: this.y / this.magnitude(),
    }
  }

  normalize() {
    const norm = this.norm()

    return new Vector(norm.x, norm.y)
  }
}