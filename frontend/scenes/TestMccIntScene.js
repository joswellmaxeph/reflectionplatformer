import LevelScene from './LevelScene.js';

export default class TestMccIntScene extends LevelScene {
  constructor() {
    const data = {};

    data.skyImgName = "sky"
    data.tileMapName = "mcctilemap";
    data.playerStartX = 100;
    data.playerStartY = 400;
    data.nextSceneThroughDoor = "GameOverScene";

    super("TestMccIntScene", data);
  }
}
