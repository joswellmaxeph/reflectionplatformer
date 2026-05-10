import LevelScene from './LevelScene.js';

export default class NeighborhoodScene extends LevelScene {
  constructor() {
    const data = {};

    data.skyImgName = "sky"
    data.tileMapName = "neighborhoodtilemap";
    data.playerStartX = 100;
    data.playerStartY = 200;
    data.bgImgName = "neighborhooddecor";
    data.nextSceneThroughDoor = "MccInteriorScene";
    data.instructionsString = `Welcome to Midtown!

Your goal is to make it to the MCC.

Use LEFT and RIGHT to move.

Press ${window.CONTROLLER ? "A" : "SPACE"} to jump.

Avoid the monsters (or jump on them).

Collect light bulbs.

Watch the timer.

Press ${window.CONTROLLER ? "A" : "SPACE"} to begin. Good luck!`;

    super("NeighborhoodScene", data);
  }

  create() {
    super.create();
    const width = this.scale.width;
    const height = this.scale.height;

    const grassfront = this.add.image(0, 5, "GrassFront").setOrigin(0, 0).setScrollFactor(1.125);
    grassfront.setDepth(5);

    const sidewalklong = this.add.image(0, 48, "SidewalkLong").setOrigin(0, 0).setScrollFactor(1);
    sidewalklong.setDepth(.75);
    const street = this.add.image(0, 32, "Street").setOrigin(0, 0).setScrollFactor(1);
    street.setDepth(.5);
    const streetTop = this.add.image(0, 32, "StreetTop").setOrigin(0, 0).setScrollFactor(1);
    streetTop.setDepth(.2);

    const buildings = this.add.image(0, -12, "Buildings").setOrigin(0, 0).setScrollFactor(1);
    buildings.setDepth(.25);

    const terminalTower = this.add.image(780, 40, "TERMINAL").setOrigin(0, 0).setScrollFactor(.75);
    terminalTower.setDepth(.02);

    const keyTower = this.add.image(970, 20, "KEY").setOrigin(0, 0).setScrollFactor(.75);
    keyTower.setDepth(.01);

    const huntington = this.add.image(855, 90, "HUNTINGTON").setOrigin(0, 0).setScrollFactor(.75);
    huntington.setDepth(.02);

    const csuRhodes = this.add.image(1055, 100, "CSU").setOrigin(0, 0).setScrollFactor(.75);
    csuRhodes.setDepth(.03);

    const fog = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.59)
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(.04);

    const fog2 = this.add.rectangle(0, 0, width, height, 0xFFFFFF, 0.59)
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(.1);
  }
}
