import { Ball } from "../types/Ball";
import { GameBoardHoleCell, GameBoardSpaceCell, GameBoardWallCell } from "../types/cellTypes"

const templateLetters = new Map<string, any[]>()

templateLetters.set( 'w', [ GameBoardWallCell ] );
templateLetters.set( ' ', [ GameBoardSpaceCell ] );
templateLetters.set( 'h', [ GameBoardHoleCell ] );
templateLetters.set( 'b', [ Ball, GameBoardSpaceCell ] );

export default templateLetters;

