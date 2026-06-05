import LevelScene from './LevelScene.js';

export default class NeighborhoodScene extends LevelScene {
  constructor() {
    const data = {};

    data.skyImgName = "skytry2"
    data.tileMapName = "wintertest3";
    data.playerStartX = 259;
    data.playerStartY = -10;
    data.bgImgName = "mtn1";
    data.nextSceneThroughDoor = "MccInteriorScene";
    data.instructionsString = ` . . . YOU ARE BORN
    IN THE WINTER . . . `;

    super("NeighborhoodScene", data);
  }

  create() {
    super.create();
    window.scene = "MainScene";
    const width = this.scale.width;
    const height = this.scale.height;

    this.map.addTilesetImage('groundset', 'tiles');

    // const grassfront = this.add.image(0, 5, "GrassFront").setOrigin(0, 0).setScrollFactor(1.125);
    // grassfront.setDepth(5);

    // const sidewalklong = this.add.image(0, 48, "SidewalkLong").setOrigin(0, 0).setScrollFactor(1);
    // sidewalklong.setDepth(.75);
    // const street = this.add.image(0, 32, "Street").setOrigin(0, 0).setScrollFactor(1);
    // street.setDepth(.5);
    // const streetTop = this.add.image(0, 32, "StreetTop").setOrigin(0, 0).setScrollFactor(1);
    // streetTop.setDepth(.2);

    // const buildings = this.add.image(0, 0, "wintertest3img").setOrigin(0, 0).setScrollFactor(1);
    // buildings.setDepth(1);

    // const terminalTower = this.add.image(780, 40, "TERMINAL").setOrigin(0, 0).setScrollFactor(.75);
    // terminalTower.setDepth(.02);

    // const keyTower = this.add.image(970, 20, "KEY").setOrigin(0, 0).setScrollFactor(.75);
    // keyTower.setDepth(.01);

    // const huntington = this.add.image(855, 90, "HUNTINGTON").setOrigin(0, 0).setScrollFactor(.75);
    // huntington.setDepth(.02);

    // const csuRhodes = this.add.image(1055, 100, "CSU").setOrigin(0, 0).setScrollFactor(.75);
    // csuRhodes.setDepth(.03);

    // const fog = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.59)
    // .setOrigin(0, 0)
    // .setScrollFactor(0, 0)
    // .setDepth(.04);

    // const fog2 = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.59)
    // .setOrigin(0, 0)
    // .setScrollFactor(0, 0)
    // .setDepth(.1);
  }
}
