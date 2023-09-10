import * as THREE from "three";
import * as CANNON from "cannon-es";

export interface DisplayedBody {
  display: THREE.Mesh;
  body?: CANNON.Body;
}

