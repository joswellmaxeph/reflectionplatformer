export default class MainMenu extends Phaser.Scene {
  constructor() {
    super("MainMenu");
  }

  preload() {

  }

  create() {
    this.add.text(0, 0, 'Press Start');

    this.input.keyboard.on('keydown', () => {
      this.scene.start("MainScene");
    }, this);
  }
}
