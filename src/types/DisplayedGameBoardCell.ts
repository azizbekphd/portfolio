import { GameBoardCell } from "../types/GameBoardCell";

type GameBoardCellNonEmptyDisplay = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  offset?: THREE.Vector3;
}

export type GameBoardCellDisplay = GameBoardCellNonEmptyDisplay | false;

abstract class GameBoardCellDisplayConstruction<T> {
  abstract display: T;
  protected abstract initDisplay(): T;
}

interface DisplayedGameBoardCell
    extends GameBoardCellDisplayConstruction<GameBoardCellDisplay>, GameBoardCell {}

class GameBoardCellDisplayIsEmpty extends Error {
  constructor ( message: string ) {
    super( message );
    this.name = "GameBoardCellDisplayIsEmpty";
  }
}

class DisplayedGameBoardCell {
  display: GameBoardCellDisplay = false;

  constructor () {
    this.initDisplay();
  }

  getNonEmptyDisplay (): GameBoardCellNonEmptyDisplay {
    if ( this.display === false ) {
      throw new GameBoardCellDisplayIsEmpty("Game board cell display is empty");
    }
    return this.display;
  }
}

export { DisplayedGameBoardCell };

