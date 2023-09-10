import * as CANNON from "cannon-es";
import * as THREE from "three";

export class ThreeCannonConverter {
  static MeshToBody ( mesh: THREE.Mesh,
                 options: CANNON.BodyOptions ): CANNON.Body {
    const geometry = mesh.geometry;
    let vertices
    if (geometry.index === null) {
        vertices = geometry.attributes.position.array
    } else {
        vertices = geometry.clone().toNonIndexed().attributes.position.array
    }
    const indices = Object.keys(vertices).map(Number)
    const shape = new CANNON.Trimesh(vertices, indices)
    const body = new CANNON.Body( options );
    body.addShape( shape );
    body.position.x = mesh.position.x;
    body.position.y = mesh.position.y;
    body.position.z = mesh.position.z;
    return body;
  }

  static Vec3ToVector3 ( vec3: CANNON.Vec3 ): THREE.Vector3 {
    return new THREE.Vector3( vec3.x, vec3.y, vec3.z );
  }
  
  static CQuaternionToTQuaternion (
    quaternion: CANNON.Quaternion ): THREE.Quaternion {
      return new THREE.Quaternion(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w,
      );
  }

  static TNumberToQNumber ( num: number ): number {
    return num;
  }
}

