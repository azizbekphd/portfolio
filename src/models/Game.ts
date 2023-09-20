import { Ball } from "../types/Ball";
import { GameBoard } from "../types/GameBoard";
import { Vec2 } from "../types/Vec2";

export class Game {
  pointer: Vec2;
  gameBoard: GameBoard;
  balls: Ball[]

  constructor ( gameBoard: GameBoard, balls: Ball[], pointer: Vec2 ) {
    this.pointer = pointer;
    this.gameBoard = gameBoard;
    this.balls = balls;
  }
}
