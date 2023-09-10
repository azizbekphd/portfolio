import * as CANNON from "cannon-es";
import * as THREE from "three";
import gameConfig from "../config/gameConfig";
import { ThreeCannonConverter } from "../utils/ThreeCannonConverter";
import { DisplayedBody } from "./DisplayedBody";

export class Ball implements DisplayedBody {
  display: THREE.Mesh;
  body: CANNON.Body;

  constructor () {
    const ballConfig = gameConfig.ball;
    const geometry = new THREE.IcosahedronGeometry( ballConfig.radius, 8 );
    const material = new THREE.MeshStandardMaterial( );
    const mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = true;

    this.display = mesh;
    this.body = new CANNON.Body( {
      shape: new CANNON.Sphere(
        ThreeCannonConverter.TNumberToQNumber( ballConfig.radius ) ),
      mass: ballConfig.mass,
      material: new CANNON.Material( 'ball' ),
    } );
  }
}

