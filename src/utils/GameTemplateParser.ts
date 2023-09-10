import * as CANNON from "cannon-es";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import gameConfig from "../config/gameConfig";
import templateLetters from "../config/templateLetters";
import { Game } from "../models/Game";
import { Ball } from "../types/Ball";
import { DisplayedGameBoardCell } from "../types/DisplayedGameBoardCell";
import { GameBoard } from "../types/GameBoard";
import { ThreeCannonConverter } from "./ThreeCannonConverter";

class InvalidCharacterInTemplateError extends Error {
  constructor ( message: string ) {
    super( message );
    this.name = "InvalidCharacterInTemplateError";
  }
}

export class GameTemplateParser {
  static letterToObjects ( letter: string ): Array<DisplayedGameBoardCell | Ball> {
    if ( !templateLetters.has( letter ) ) {
      throw new InvalidCharacterInTemplateError( "Unknown character: " + letter );
    }
    const entityTypes = templateLetters.get( letter );
    return entityTypes!.map<DisplayedGameBoardCell | Ball>( t => new t() );
  }

  public static fromStringTemplate ( template: string ): Game {
    const cellsSource = template.split( "\n" ).map(
      e => e.split( "" )
    );
    const cells: DisplayedGameBoardCell[] = [];
    const balls: Ball[] = [];
    cellsSource.forEach(
      ( row, j, arrJ ) => row.forEach(
        ( letter, i, arrI ) => {
          const objects = GameTemplateParser.letterToObjects( letter );
          objects.forEach( object => {
            if ( object instanceof DisplayedGameBoardCell ) {
              if ( object.display === false ) return;
              object.display.geometry.translate(
                ( i - arrI.length / 2 + 0.5 ),
                -( j - arrJ.length / 2 + 0.5 ),
                0
              );
              if ( object.display.offset ) {
                object.display.geometry.translate( ...object.display.offset.toArray() );
              }
              cells.push( object );
            } else if ( object instanceof Ball ) {
              object.body.position.set(
                ( i - arrI.length / 2 + 0.5 ),
                -( j - arrJ.length / 2 + 0.5 ),
                0
              );
              balls.push( object );
            }
          } );
        }
      )
    );
    const mergedCellsGeometry = BufferGeometryUtils.mergeBufferGeometries(
      cells.map( cell => cell.getNonEmptyDisplay().geometry )
    );

    const mesh = new THREE.Mesh( mergedCellsGeometry, gameConfig.gameBoard.material );
    const body = ThreeCannonConverter.MeshToBody( mesh, {
      type: CANNON.BODY_TYPES.KINEMATIC,
      material: new CANNON.Material( 'ground' ),
      angularFactor: new CANNON.Vec3( 1, 1, 0 ),
    } );
    const gameBoard = new GameBoard(
      mesh,
      body,
    );
    if ( gameConfig.gameBoard.beforeCreated ) {
      gameConfig.gameBoard.beforeCreated( gameBoard )
    }
    return new Game( gameBoard, balls );
  }
}

