export default class Monster extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, 'MonstersImg');
    this.startX = config.x;
    this.setDepth(1);

    this.startingX = config.x;
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);
    this.setOrigin(0, .5);
    this.anims.play('move', true);
    this.body.setGravityY(300);
    this.setCollideWorldBounds(true);

    this.vel = -80;
    this.fallen = false;
  }

  update() {
    this.setCollideWorldBounds(true);
    if (this.fallen) {
      this.setVelocityX(0);
      return;
    }

    if (this.body.blocked.left) {
      this.vel = 80;
    } else if (this.body.blocked.right) {
      this.vel = -80;
    }
    
    this.setVelocityX(this.vel);
  }

  fall() {
    this.fallen = true;
    this.body.enable = false;
    this.anims.play('fall', false);
    this.on('animationcomplete', () => {
      this.destroy();
    });
  }
}
