import menuBoardTemplate from "./config/menuBoardTemplate";
import { GameController } from "./controllers/GameController";
import { GameTemplateParser } from "./utils/GameTemplateParser";
import { MazeGameView } from "./views/MazeGame";

const gameModel = GameTemplateParser.fromStringTemplate( menuBoardTemplate );
const gameController = new GameController( gameModel );
const gameView = new MazeGameView( gameController );

gameView.run();

