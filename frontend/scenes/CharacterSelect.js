export default class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  preload() {
    this.load.image('hyland', 'public/assets/hylandpixellogo.png');
    this.load.image('mcc', 'public/assets/mcc logo pixel.png');

    this.playerSpriteSheets = [];
    for (let i = 1; i <= 8; i++) {
      const pName = `player${i}`;
      this.playerSpriteSheets.push(pName);
    }

    this.load.bitmapFont("pixelfont", "public/assets/fonts/pixelfont.png", "public/assets/fonts/pixelfont.xml");
    this.load.bitmapFont("pixelfontyellow", "public/assets/fonts/pixelfontyellow.png", "public/assets/fonts/pixelfont.xml");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.selectedIdx = 0;

    const welcomeText = this.add.bitmapText(width * .5, height * .1, 'pixelfont', 'MCC PLATFORMER', 20).setOrigin(0.5);
    const instructionText = this.add.bitmapText(width * .5, height * .15, 'pixelfont', 'Choose a character to begin.', 10).setOrigin(0.5);

    this.playerPortraits = this.physics.add.group({immovable: true, allowGravity: false});

    const selectorWidth = 3;
    const borderSpace = 10;
    const boxWidth = (width / 5) - borderSpace;
    const boxHeight = 100;

    this.selectorBox = this.add.rectangle((width / 5), 140, boxWidth + selectorWidth * 2, boxHeight + selectorWidth * 2, 0xFFFFFF).setOrigin(.5, .5).setScrollFactor(0, 0);

    for (let i = 0; i < 8; i++) {
      const x = (1 + i % 4) * (width / 5);
      const y = 140 + (110 * Math.floor(i / 4));
      this.add.rectangle(x, y, boxWidth, boxHeight, 0x555555).setOrigin(.5, .5).setScrollFactor(0, 0);

      this.playerPortraits.add(this.physics.add.sprite(x, y, this.playerSpriteSheets[i]).setOrigin(.5, .5).setScale(2.5));
    }

    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.movingOn = false;

    this.leftKey.on('down', () => {
      if (!this.movingOn && this.selectedIdx % 4 !== 0) {
        this.selectedIdx--;
      }
    });

    this.rightKey.on('down', () => {
      if (!this.movingOn && this.selectedIdx % 4 !== 3) {
        this.selectedIdx++;
      }
    });

    this.upKey.on('down', () => {
      if (!this.movingOn && this.selectedIdx >= 4) {
        this.selectedIdx -= 4;
      }
    });

    this.downKey.on('down', () => {
      if (!this.movingOn && this.selectedIdx < 4) {
        this.selectedIdx += 4;
      }
    });

    this.spaceBar.on('down', () => {
      if (this.movingOn) return;
      this.movingOn = true;
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start("NeighborhoodScene", {playerSpriteName: this.playerSpriteSheets[this.selectedIdx]});
      });
    });

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }

  update() {
    const width = this.scale.width;
    this.selectorBox.x = (1 + (this.selectedIdx % 4)) * (width / 5);
    this.selectorBox.y = 140 + (110 * Math.floor(this.selectedIdx / 4));
  }
}
