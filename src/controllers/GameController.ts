import * as CANNON from "cannon-es";
import gameConfig from "../config/gameConfig";
import { Game } from "../models/Game";

export class GameController {
  state: Game;

  constructor (gameModel: Game) {
    this.state = gameModel;
  }

  updatePointerCoords ( x: number, y: number ) {
    this.state.pointer = {
      x: ( ( y / window.innerHeight ) * 2 - 1 ),
      y: ( ( x / window.innerWidth ) * 2 - 1 ),
    };
  }

  updateGameBoardOnRender () {
    const rotation = new CANNON.Vec3( 0, 0, 0 );
    this.state.gameBoard.body.quaternion.toEuler( rotation );
    const rotationLimit = gameConfig.gameBoard.rotationLimit;
    const pointer = this.state.pointer;
    const rotationBase = gameConfig.gameBoard.rotationVelocityBase;
    const maxRotationVelocity = gameConfig.gameBoard.maxRotationVelocity;
    const angularDistance = new CANNON.Vec3(
      ( ( pointer.x > 0 ? rotationLimit.maxX : rotationLimit.minX ) - rotation.x ) /
        ( rotationLimit.maxX - rotationLimit.minX ),
      ( ( pointer.y > 0 ? rotationLimit.maxY : rotationLimit.minY ) - rotation.y ) /
        ( rotationLimit.maxY - rotationLimit.minY ),
      0,
    );
    const angularVelocity: Vec2 = {
      x: Math.min( Math.abs( pointer.x ) * angularDistance.x * rotationBase.x,
                  maxRotationVelocity.x ),
      y: Math.min( Math.abs( pointer.y ) * angularDistance.y * rotationBase.y,
                  maxRotationVelocity.y ),
    }

    this.state.gameBoard.setAngularVelocity(
      angularVelocity.x,
      angularVelocity.y,
      0,
    );
    this.state.gameBoard.body.quaternion.toEuler( rotation );
    this.state.gameBoard.setQuaternionFromEuler( rotation.x, rotation.y, 0 );
  }
}

