export default class Portal extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.img);
    config.scene.add.existing(this);
    this.setOrigin(0, .5);
    this.setDepth(1);
  }
}
