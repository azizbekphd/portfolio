import * as CANNON from "cannon-es";
import * as THREE from "three";
import CannonDebugger from "cannon-es-debugger";
import gameConfig from "../config/gameConfig";
import { GameController } from "../controllers/GameController";
import { ThreeCannonConverter } from "../utils/ThreeCannonConverter";

type MazeGameUserEventHandler = ( e: UIEvent, controller: GameController ) => void;

class MazeGameUserEventHandlers {
  controller: GameController;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;

  constructor ( controller: GameController, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer ) {
    this.controller = controller;
    this.camera = camera;
    this.renderer = renderer;
  }

  setup () {
    this.setupEvents();
  }

  addEventHandler ( event: keyof WindowEventMap, fn: MazeGameUserEventHandler ) {
    const that = this;
    window.addEventListener( event, ( e ) => {
      that.onMouseMove( e );
    } );
  }

  setupEvents () {
    this.addEventHandler( 'mousemove', this.onMouseMove );
    this.addEventHandler( 'touchmove', this.onTouchMove );
    this.addEventHandler( 'resize', this.onWindowResize );
    this.addEventHandler( 'scroll', this.onWindowScroll );
  }

  onMouseMove ( e: MouseEvent ) {
    this.controller.updatePointerCoords( e.x, e.y );
  }

  onTouchMove ( e: TouchEvent ) {
    e.preventDefault();
    const lastTouch = e.touches.item( e.touches.length - 1 );
    if ( lastTouch === null ) return;
    this.controller.updatePointerCoords( lastTouch.pageX, lastTouch.pageY );
  }

  onWindowResize ( e: UIEvent ) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  onWindowScroll ( e: UIEvent ) {
    e.preventDefault();
  }
}

export class MazeGameView {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  world: CANNON.World;
  debugger: CannonDebugger;
  userEventsHandler?: MazeGameUserEventHandlers;

  controller: GameController;

  constructor ( controller: GameController ) {
    this.controller = controller;
    this.animate = this.animate.bind( this );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.world = new CANNON.World( {
      gravity: new CANNON.Vec3( 0, 0, -9.81 ),
    } );
    this.debugger = new CannonDebugger( this.scene, this.world );
  }

  setup () {
    this.setupRenderer();
    this.setupCamera();
    this.setupEnvironment();
    this.setupWorld();
    this.setupGameBoard();
    this.setupBalls();
  }

  setupRenderer () {
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    document.body.appendChild( this.renderer.domElement );
  }

  setupCamera () {
    const cameraAngle = gameConfig.gameBoard.cameraAngle;
    const cameraDistance = gameConfig.gameBoard.cameraDistance;
    this.camera.position.z = Math.cos( cameraAngle ) * cameraDistance;
    this.camera.position.y = - Math.sin( cameraAngle ) * cameraDistance;
    this.camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
  }

  setupEnvironment () {
    const hemisphereLight = new THREE.HemisphereLight(
      new THREE.Color( 0x00c0ff ),
      new THREE.Color( 0x111100 ),
      .1,
    );
    hemisphereLight.castShadow = false;
    this.scene.add( hemisphereLight );
    
    const ambientLight = new THREE.AmbientLight(
      new THREE.Color( 0xffffff ),
      .2,
    );
    ambientLight.castShadow = false;
    this.scene.add( ambientLight );
    
    const sunlight = new THREE.PointLight(
      new THREE.Color( 0xffffe1 ),
      .7,
    );
    sunlight.position.set( -40, 40, 40 )
    sunlight.castShadow = true;
    sunlight.shadow.mapSize = new THREE.Vector2( 8192, 8192 );
    sunlight.shadow.radius = 1;
    this.scene.add( sunlight );
  }

  setupWorld () {
    const contactMaterial = new CANNON.ContactMaterial(
      this.controller.state.gameBoard.body.material!,
      this.controller.state.balls[0].body.material!, {
        friction: 0.02,
        restitution: 0,
      }
    );
    this.world.addContactMaterial( contactMaterial );
  }

  setupGameBoard () {
    this.scene.add( this.controller.state.gameBoard.display );
    this.world.addBody( this.controller.state.gameBoard.body );
  }

  setupBalls () {
    this.controller.state.balls.forEach(
      ball => {
        this.scene.add( ball.display );
        this.world.addBody( ball.body );
      }
    )
  }

  animate () {
	  requestAnimationFrame( this.animate );

    this.updateGameBoard();
    this.updateBalls();

    if ( gameConfig.debug ) {
      this.debugger.update();
    }
    this.world.step( gameConfig.timeStep );
	  this.renderer.render( this.scene, this.camera );
  }

  updateGameBoard () {
    this.controller.updateGameBoardOnRender();

    this.controller.state.gameBoard.display.position.copy(
      ThreeCannonConverter.Vec3ToVector3(
        this.controller.state.gameBoard.body.position ) );
    this.controller.state.gameBoard.display.quaternion.copy(
      ThreeCannonConverter.CQuaternionToTQuaternion(
        this.controller.state.gameBoard.body.quaternion ) );
  }

  updateBalls () {
    this.controller.state.balls.forEach(
      ball => {
        ball.display.position.copy(
          ThreeCannonConverter.Vec3ToVector3(
            ball.body.position ) );
        ball.display.quaternion.copy(
          ThreeCannonConverter.CQuaternionToTQuaternion(
            ball.body.quaternion ) );
      }
    )
  }

  run () {
    this.userEventsHandler = new MazeGameUserEventHandlers(
      this.controller, this.camera, this.renderer );
    this.userEventsHandler.setup();

    this.setup();
    this.animate();
  }
}

