export type State = {
  players: Player[]
}

export type Player = {
  id: string
  position: {
    x: number
    y: number
  }
}