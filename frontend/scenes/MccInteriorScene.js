import LevelScene from './LevelScene.js';

export default class MccInteriorScene extends LevelScene {
  constructor() {
    const data = {};

    data.skyImgName = "sky"
    data.tileMapName = "mcctilemap";
    data.playerStartX = 100;
    data.playerStartY = 200;
    data.bgImgName = "mccdecor";
    data.nextSceneThroughDoor = "GameOverScene";
    data.startDark = .2;
    data.bulbLight = .05;
    data.instructionsString = `You are now inside the
Midtown Collaboration Center!
    
Your new goal is to make it to
Hyland's classroom.

There, you can learn all about coding
(including making games like this one).

Press ${window.CONTROLLER ? "A" : "SPACE"} to begin. Good luck!`

    super("MccInteriorScene", data);
  }

  create() {
    super.create();
    const width = this.scale.width;
    const height = this.scale.height;

    const plats = this.add.image(0, -8, "mccplats").setOrigin(0, 0).setScrollFactor(1);
    plats.setDepth(.25);

    const fog = this.add.rectangle(0, 0, width, height, 0x000000, .3)
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)
    .setDepth(.1);

    const mccfrontfrontfulll = this.add.image(0, 22, "MccFrontFrontFull").setOrigin(0, 0).setScrollFactor(1.125);
    mccfrontfrontfulll.setDepth(5);

    // const street = this.add.image(0, 15, "Behind2").setOrigin(0, 0).setScrollFactor(1);
    // street.setDepth(.24);

    // const street2 = this.add.image(0, 25, "Behind3").setOrigin(0, 0).setScrollFactor(.9);
    // street2.setDepth(.23);

  }
}
