type Exchange = {
  id: number
  name: string
  lastPrice: number
}

export type Db = {
  exchanges: Exchange[]
}

// This is mocked currently
export const db: Db = {
  exchanges: [
    { id: 1, name: 'LooksRare', lastPrice: 10 },
    { id: 2, name: 'X2Y2', lastPrice: 20 },
  ],
}
