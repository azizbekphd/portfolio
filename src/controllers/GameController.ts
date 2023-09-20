import * as CANNON from "cannon-es";
import gameConfig from "../config/gameConfig";
import { Game } from "../models/Game";

export class GameController {
  state: Game;
  cache: {
    rotationRange: Vec2,
  };

  constructor (gameModel: Game) {
    this.state = gameModel;
    this.cache = {
      rotationRange: {
        x: gameConfig.gameBoard.rotationLimit.maxX -
          gameConfig.gameBoard.rotationLimit.minX,
        y: gameConfig.gameBoard.rotationLimit.maxY -
          gameConfig.gameBoard.rotationLimit.minY,
      }
    }
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
    const targetAngle = Math.atan2( pointer.y, pointer.x )
    const target: Vec2 = {
      x: Math.cos( targetAngle ),
      y: Math.sin( targetAngle ),
    };
    const toLimit: Vec2 = {
      x: ( ( target.x > 0 ? rotationLimit.maxX : rotationLimit.minX ) -
          rotation.x ) / this.cache.rotationRange.x,
      y: ( ( target.y > 0 ? rotationLimit.maxY : rotationLimit.minY ) -
          rotation.y ) / this.cache.rotationRange.y,
    }
    const direction: Vec2 = {
      x: Math.sign( pointer.x ) * target.x * toLimit.x,
      y: Math.sign( pointer.y ) * target.y * toLimit.y,
    };
    const rotationStep = gameConfig.gameBoard.rotationStep;
    const newRotation: Vec2 = {
      x: rotation.x + ( direction.x - rotation.x ) * rotationStep.x,
      y: rotation.y + ( direction.y - rotation.y ) * rotationStep.y,
    };

    this.state.gameBoard.body.quaternion.toEuler( rotation );
    this.state.gameBoard.setQuaternionFromEuler( newRotation.x, newRotation.y, 0 );
  }
}

