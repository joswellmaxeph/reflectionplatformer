import LevelScene from './LevelScene.js';

export default class TestNeighborhoodScene extends LevelScene {
  constructor() {
    const data = {};

    data.skyImgName = "sky"
    data.tileMapName = "neighborhoodtilemap";
    data.playerStartX = 100;
    data.playerStartY = 200;
    data.nextSceneThroughDoor = "TestMccIntScene";

    super("TestNeighborhoodScene", data);
  }
}
