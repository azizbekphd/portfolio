import * as CANNON from "cannon-es";
import * as THREE from "three";
import CannonDebugger from "cannon-es-debugger";
import gameConfig from "../config/gameConfig";
import { GameController } from "../controllers/GameController";
import { ThreeCannonConverter } from "../utils/ThreeCannonConverter";
import { Decoration } from "../types/Decoration";

interface MazeGameUserEventHandlerParams {
  controller: GameController,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.Renderer,
}

type MazeGameUserEventHandler = ( e: any, params: MazeGameUserEventHandlerParams ) => void;

class MazeGameUserEventHandlers implements MazeGameUserEventHandlerParams {
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
    window.addEventListener( event, ( e ) => {
      fn( e, {
        controller: this.controller,
        camera: this.camera,
        renderer: this.renderer,
      } );
    } );
  }

  setupEvents () {
    this.addEventHandler( 'mousemove', this.onMouseMove );
    this.addEventHandler( 'touchmove', this.onTouchMove );
    this.addEventHandler( 'resize', this.onWindowResize );
    this.addEventHandler( 'scroll', this.onWindowScroll );
  }

  onMouseMove ( e: MouseEvent, that: MazeGameUserEventHandlerParams ) {
    that.controller.updatePointerCoords( e.x, e.y );
  }

  onTouchMove ( e: TouchEvent, that: MazeGameUserEventHandlerParams ) {
    e.preventDefault();
    const lastTouch = e.touches.item( e.touches.length - 1 );
    if ( lastTouch === null ) return;
    that.controller.updatePointerCoords( lastTouch.pageX, lastTouch.pageY );
  }

  onWindowResize ( e: UIEvent, that: MazeGameUserEventHandlerParams ) {
    e;
    that.camera.aspect = window.innerWidth / window.innerHeight;
    that.camera.updateProjectionMatrix();

    that.renderer.setSize( window.innerWidth, window.innerHeight );
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
  debugger: any;
  userEventsHandler?: MazeGameUserEventHandlers;

  controller: GameController;
  decorations: Decoration[];

  constructor ( controller: GameController ) {
    this.controller = controller;
    this.animate = this.animate.bind( this );

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer();
    this.world = new CANNON.World( {
      gravity: gameConfig.world.gravity,
    } );
    this.decorations = gameConfig.decorations;
    this.debugger = new ( CannonDebugger as any )( this.scene, this.world );
  }

  setup () {
    this.setupRenderer();
    this.setupCamera();
    this.setupEnvironment();
    this.setupWorld();
    this.setupGameBoard();
    this.setupBalls();
    this.setupDecoration();
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
    gameConfig.environment.objects.forEach( object => this.scene.add( object ) );
  }

  setupWorld () {
    const contactMaterial = new CANNON.ContactMaterial(
      this.controller.state.gameBoard.body.material!,
      this.controller.state.balls[0].body.material!,
      gameConfig.world.contactMaterials.gameBoardAndBall,
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

  setupDecoration () {
    this.decorations.forEach( decoration => {
      this.scene.add( decoration.display );
    } );
  }

  animate () {
	  requestAnimationFrame( this.animate );

    this.updateGameBoard();
    this.updateBalls();
    this.updateDecorations();

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

  updateDecorations () {
    this.decorations.forEach( decoration => {
      decoration.update();
    } )
  }

  run () {
    this.userEventsHandler = new MazeGameUserEventHandlers(
      this.controller, this.camera, this.renderer );
    this.userEventsHandler.setup();

    this.setup();
    this.animate();
  }
}

