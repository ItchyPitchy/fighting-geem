import { ComponentType } from 'geem-core'
import { Component } from './Component'

export class CameraFocus extends Component {
  public maxRange = 4

  public clientComponentOnly = true

  constructor() {
    super(ComponentType.CAMERA_FOCUS)
  }
}
