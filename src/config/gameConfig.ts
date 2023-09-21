import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import * as CANNON from "cannon-es";
import { GameBoard } from "../types/GameBoard";
import { Decoration } from "../types/Decoration";
import { Game } from "../models/Game";

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

  postprocessors: (() => {

		const BLOOM_SCENE = 1;

		const bloomLayer = new THREE.Layers();
		bloomLayer.set( BLOOM_SCENE );

		const params = {
			threshold: 0,
			strength: 1,
			radius: 0.5,
			exposure: 1
		};
    const materials: { [ key: string ]: THREE.Material | THREE.Material[] } = {};
    const darkMaterial = new THREE.MeshBasicMaterial( { color: "black" } );

    return ( renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, controller: Game ) => {
      const postprocessors: {
        prerenderCallback?: ( obj: THREE.Object3D ) => any,
        setup?: () => any,
        composer: EffectComposer,
      }[] = [];

      const renderScene = new RenderPass( scene, camera );

		  const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      bloomPass.threshold = params.threshold;
			bloomPass.strength = params.strength;
			bloomPass.radius = params.radius;

		  const bloomComposer = new EffectComposer( renderer );
		  bloomComposer.renderToScreen = false;
		  bloomComposer.addPass( renderScene );
		  bloomComposer.addPass( bloomPass );

      postprocessors.push( {
        prerenderCallback: ( obj ) => {
          if ( ( obj as THREE.Mesh ).isMesh && bloomLayer.test( obj.layers ) === false ) {
		  			materials[ obj.uuid ] = ( obj as THREE.Mesh ).material;
		  			( obj as THREE.Mesh ).material = darkMaterial;
		  		}
        },
        composer: bloomComposer,
      } );

      const vertexShader = `
        varying vec2 vUv;

		  	void main() {
		  		vUv = uv;
		  		gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		  	}
      `;

      const fragmentShader = `
		  	uniform sampler2D baseTexture;
		  	uniform sampler2D bloomTexture;

		  	varying vec2 vUv;

		  	void main() {
		  		gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );
		  	}
      `;

		  const mixPass = new ShaderPass(
		  	new THREE.ShaderMaterial( {
		  		uniforms: {
		  			baseTexture: { value: null },
		  			bloomTexture: { value: bloomComposer.renderTarget2.texture }
		  		},
		  		vertexShader: vertexShader,
		  		fragmentShader: fragmentShader,
		  		defines: {}
		  	} ), 'baseTexture'
		  );
		  mixPass.needsSwap = true;

		  const outputPass = new OutputPass();

		  const finalComposer = new EffectComposer( renderer );
		  finalComposer.addPass( renderScene );
		  finalComposer.addPass( mixPass );
		  finalComposer.addPass( outputPass );

      postprocessors.push( {
        prerenderCallback: ( obj ) => {
				  if ( materials[ obj.uuid ] ) {
				  	( obj as THREE.Mesh ).material = materials[ obj.uuid ];
				  	delete materials[ obj.uuid ];
				  }
        },
        setup: () => {
          controller.balls.forEach( ball => {
            ball.display.layers.enable( BLOOM_SCENE );
          } );
        },
        composer: finalComposer,
      } );

      return postprocessors;
    }
  })(),

  decorations: (() => {
    const objects: Decoration[] = [];

    return objects;
  })(),
}

export default gameConfig;

