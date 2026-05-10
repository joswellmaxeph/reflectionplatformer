export default class Lightbulb extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'lightbulb');
    config.scene.add.existing(this);
    this.setOrigin(0, .5);
    this.setDepth(1);

    this.anims.play('volt', true);
  }
}
