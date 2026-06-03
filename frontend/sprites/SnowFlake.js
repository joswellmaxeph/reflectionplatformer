const MIN_SIZE = 2;
const MAX_SIZE = 4;
const MIN_SPEED = 1;
const MAX_SPEED = 2;
const MAX_X_VEL = .5;

export default class SnowFlake {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    
    this.flake = this.scene.add.ellipse(this.x, this.y, this.size, this.size, 0xFFFFFF, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
  }

  update(time, playerXVel) {
    if (this.flake.y > this.scene.scale.height) {
      const newX = -500 + Math.random() * (this.scene.scale.width + 1000);
      this.flake.y = 0;
      this.flake.x = newX;
    } else {
      this.flake.y += this.speed; // Fall speed
      const extraAdd = Math.random() * -1 * MAX_X_VEL;
      this.flake.x += extraAdd - (playerXVel * 0.02); // Sway left and right, and be affected by player movement
    }
  }
}