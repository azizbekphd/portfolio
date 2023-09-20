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
      minX: - Math.PI / 5,
      minY: - Math.PI / 5,
      maxX: Math.PI / 5,
      maxY: Math.PI / 5,
    },

    rotationStep: {
      x: 0.03,
      y: 0.03,
    },

    angularVelosityBase: {
      x: 2,
      y: 2,
    },

    maxRotationVelocity: {
      x: 10,
      y: 10,
    }
  },

  ball: {
    radius: 0.4,
    mass: 100,
  }
}

export default gameConfig;

