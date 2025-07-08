export interface ScoreStateObj {
  playerName: string
  score: number
  color: string
  id: string
}

export interface ScoreChangeEvent {
  playerName: string
  oldScore: number
  newScore: number
}
