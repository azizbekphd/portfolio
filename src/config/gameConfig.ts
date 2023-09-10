import * as THREE from "three";
import { GameBoard } from "../types/GameBoard";

const gameConfig = {
  debug: false,

  timeStep: 1 / 60,

  gameBoard: {
    material: new THREE.MeshPhysicalMaterial({
      color: 0xffff00
    }),

    beforeCreated: ( gameBoard: GameBoard ) => {
      gameBoard.display.castShadow = true;
      gameBoard.display.receiveShadow = true;
    },

    rotationLimit: {
      x: Math.PI / 3,
      y: Math.PI / 3,
    }
  },

  ball: {
    radius: 0.4,
    mass: 1,
  }
}

export default gameConfig;

