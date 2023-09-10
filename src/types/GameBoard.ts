import * as CANNON from "cannon-es";
import * as THREE from "three";
import { DisplayedBody } from "./DisplayedBody";

export class GameBoard implements DisplayedBody {
  display: THREE.Mesh;
  body: CANNON.Body;

  constructor ( display: THREE.Mesh, body: CANNON.Body ) {
    this.display = display;
    this.body = body;
  }

  rotate( x: number, y: number, z: number ) {
    this.body.quaternion.setFromEuler( x, y, z )
    // this.body.angularVelocity = new CANNON.Vec3( x, y, z );
  }
}

