export default class TitleSplash extends Phaser.Scene {
  constructor() {
    super("TitleSplash");
  }

  preload() {
    this.load.image('hyland', 'public/assets/hylandpixellogo.png');
    this.load.image('mcc', 'public/assets/mcc logo pixel.png');

    this.load.bitmapFont("pixelfont", "public/assets/fonts/pixelfont.png", "public/assets/fonts/pixelfont.xml");
    this.load.bitmapFont("pixelfontyellow", "public/assets/fonts/pixelfontyellow.png", "public/assets/fonts/pixelfont.xml");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    window.tryingAgain = false;

    const hyland = this.add.image(width * .5, height * .25, 'hyland');
    hyland.setScale(.25);

    const mcc = this.add.image(width * .5, height * .5, 'mcc');
    mcc.setScale(.25);

    const startMsg = `PRESS ${window.CONTROLLER ? "START" : "SPACE"}`;

    const pressStartText = this.add.bitmapText(width * .5, height * .75, 'pixelfontyellow', startMsg, 24).setOrigin(0.5);

    const blinkEvent = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        pressStartText.text = pressStartText.text === "" ? startMsg : "";
      }
    });

    this.movingOn = false;

    this.input.keyboard.on('keydown', (e) => {
      if (!window.CONTROLLER && e.keyCode != Phaser.Input.Keyboard.KeyCodes.SPACE) {
        return;
      }

      if (window.CONTROLLER && e.keyCode != Phaser.Input.Keyboard.KeyCodes.ENTER) {
        return;
      }

      if (this.movingOn) return;
      this.movingOn = true;
      blinkEvent.remove();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start("CharacterSelect");
      });
    }, this);

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
