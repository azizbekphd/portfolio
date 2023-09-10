import * as CANNON from "cannon-es";
import gameConfig from "../config/gameConfig";
import { Game } from "../models/Game";

export class GameController {
  state: Game;

  constructor (gameModel: Game) {
    this.state = gameModel;
  }

  rotateGameBoardByPointerCoords ( x: number, y: number ) {
    this.state.gameBoard.rotate(
      ( ( y / window.innerHeight ) * 2 - 1 ),
      ( ( x / window.innerWidth ) * 2 - 1 ),
      0,
    );

    // this.state.gameBoard.rotate(
    //   ( ( y / window.innerHeight ) * 2 - 1 ),
    //   ( ( x / window.innerWidth ) * 2 - 1 ),
    //   0 );
  }
}

