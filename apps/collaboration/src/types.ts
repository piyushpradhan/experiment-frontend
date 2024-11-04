export type CursorType = {
  x: number
  y: number
  sender: string
  color: string
  username: string
}

export type CursorMap = {
  [senderID: string]: CursorType
}
