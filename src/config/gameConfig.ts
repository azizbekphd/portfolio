import * as THREE from "three";
import * as CANNON from "cannon-es";
import { GameBoard } from "../types/GameBoard";
import { Decoration, FixedDecorationPosition } from "../types/Decoration";

const gameConfig = {
  debug: false,

  timeStep: 1 / 60,

  environment: {
    objects: (() => {
      const objects: THREE.Object3D[] = [];

      const hemisphereLight = new THREE.HemisphereLight(
        new THREE.Color( 0x00c0ff ),
        new THREE.Color( 0x111100 ),
        .1,
      );
      hemisphereLight.castShadow = false;
      objects.push( hemisphereLight );
      
      const ambientLight = new THREE.AmbientLight(
        new THREE.Color( 0xffffff ),
        .2,
      );
      ambientLight.castShadow = false;
      objects.push( ambientLight );
      
      const sunlight = new THREE.PointLight(
        new THREE.Color( 0xffffe1 ),
        .7,
      );
      sunlight.position.set( -40, 40, 40 )
      sunlight.castShadow = true;
      sunlight.shadow.mapSize = new THREE.Vector2( 8192, 8192 );
      sunlight.shadow.radius = 1;
      objects.push( sunlight );

      return objects;
    })()
  },

  world: {
    gravity: new CANNON.Vec3( 0, 0, -9.81 ),

    contactMaterials: {
      gameBoardAndBall: {
        friction: 0.01,
        restitution: 0,
      },
    },
  },

  gameBoard: {
    cameraAngle: Math.PI / 4,

    cameraDistance: 17,

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
  },

  decorations: (() => {
    const objects: Decoration[] = [];

    const board = new Decoration( {
      position: new FixedDecorationPosition( {
        x: 0, y: 0, z: 0,
      } ),
      display: new THREE.Mesh(
        new THREE.TorusGeometry( Math.cos( Math.PI / 4 ) * 12, 1, 64, 4 ),
        new THREE.MeshPhysicalMaterial( {
          color: 0xffff00,
        } ),
      ),
      setupCallback: ( object ) => {
        object.rotateZ( Math.PI / 4 );
      },
      updateCallback: ( object ) => {
        object.position.setZ( -1 + Math.cos( Date.now() / 850 ) / 5 );
      }
    } );
    objects.push( board );

    return objects;
  })(),
}

export default gameConfig;

