import * as THREE from "three";
import { DisplayedGameBoardCell, GameBoardCellDisplay } from "./DisplayedGameBoardCell";
import { GameBoardCellCategory } from "./GameBoardCell";

export class GameBoardHoleCell extends DisplayedGameBoardCell {
  category: GameBoardCellCategory = GameBoardCellCategory.space;
  
  initDisplay (): GameBoardCellDisplay {
    this.display = false;
    return this.display;
  }
}

export class GameBoardSpaceCell extends DisplayedGameBoardCell {
  category: GameBoardCellCategory = GameBoardCellCategory.wall;
  
  initDisplay (): GameBoardCellDisplay {
    const geometry = new THREE.BoxGeometry( 1, 1, .1 );
    const material = new THREE.MeshPhysicalMaterial();
    const offset = new THREE.Vector3( 0, 0, -1.05 );
    this.display = {
      geometry,
      material,
      offset,
    }
    return this.display;
  }
}

export class GameBoardWallCell extends DisplayedGameBoardCell {
  category: GameBoardCellCategory = GameBoardCellCategory.wall;
  
  initDisplay (): GameBoardCellDisplay {
    const wallHeight = 1.1 + Math.random() / 3
    const geometry = new THREE.BoxGeometry( 1, 1, wallHeight );
    const material = new THREE.MeshPhysicalMaterial();
    const offset = new THREE.Vector3( 0, 0, ( wallHeight / 2 ) - 1.1 );
    this.display = {
      geometry,
      material,
      offset,
    }
    return this.display;
  }
}

