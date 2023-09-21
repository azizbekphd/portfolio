import * as THREE from "three"
import { Game } from "../models/Game";

class DecorationPosition {}

export class FixedDecorationPosition extends DecorationPosition {
  coords: THREE.Vector3;

  constructor ( { ...coords }: { x: number, y: number, z: number } ) {
    super();
    this.coords = new THREE.Vector3( coords.x, coords.y, coords.z );
  }
}

interface DecorationCallback {
  ( object: THREE.Object3D, state?: Game ): any;
}

interface DecorationParams {
  position: DecorationPosition;
  display: THREE.Object3D;
  setupCallback?: DecorationCallback;
  updateCallback?: DecorationCallback;
}

export class Decoration implements DecorationParams {
  position: DecorationPosition;
  display: THREE.Object3D;
  setupCallback?: DecorationCallback;
  updateCallback?: DecorationCallback;

  constructor ( params: DecorationParams ) {
    this.position = params.position;
    this.display = params.display;
    this.setupCallback = params.setupCallback;
    this.updateCallback = params.updateCallback;

    this.init();
  }

  init () {
    if ( this.position instanceof FixedDecorationPosition ) {
      const coords = this.position.coords;
      this.display.position.set( coords.x, coords.y, coords.z );
    }

    if ( this.setupCallback ) {
      this.setupCallback( this.display );
    }
  }

  update ( controllerState: Game ) {
    if ( this.updateCallback ) {
      this.updateCallback( this.display, controllerState );
    }
  }
}

