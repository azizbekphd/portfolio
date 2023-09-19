import * as THREE from "three";
import { GameBoard } from "../types/GameBoard";

const gameConfig = {
  debug: false,

  timeStep: 1 / 60,

  gameBoard: {
    cameraAngle: Math.PI / 4,

    cameraDistance: 15,

    material: new THREE.MeshPhysicalMaterial({
      color: 0xffff00
    }),

    beforeCreated: ( gameBoard: GameBoard ) => {
      gameBoard.display.castShadow = true;
      gameBoard.display.receiveShadow = true;
    },

    rotationLimit: {
      minX: - Math.PI / 3,
      minY: - Math.PI / 3,
      maxX: Math.PI / 3,
      maxY: Math.PI / 3,
    },

    rotationVelocityBase: {
      x: 2,
      y: 2,
    },

    maxRotationVelocity: {
      x: 2,
      y: 2,
    }
  },

  ball: {
    radius: 0.4,
    mass: 10,
  }
}

export default gameConfig;

