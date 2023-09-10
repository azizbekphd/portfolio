import { Ball } from "../types/Ball";
import { GameBoard } from "../types/GameBoard";

export class Game {
  gameBoard: GameBoard;
  balls: Ball[]

  constructor ( gameBoard: GameBoard, balls: Ball[] ) {
    this.gameBoard = gameBoard;
    this.balls = balls;
  }
}
