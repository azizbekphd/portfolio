export enum GameBoardCellCategory {
  space,
  wall,
  hole,
}

export class GameBoardCell {
  category: GameBoardCellCategory = GameBoardCellCategory.space;
}

