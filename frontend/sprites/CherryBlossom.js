const MIN_SIZE = 3;
const MAX_SIZE = 5;
const MIN_SPEED = .5;
const MAX_SPEED = 1;
const MAX_X_VEL = 0;

export default class CherryBlossom {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.size = Math.random() * (MAX_SIZE - MIN_SIZE) + MIN_SIZE;
    this.speed = Math.random() * (MAX_SPEED - MIN_SPEED) + MIN_SPEED;
    this.ySpeed = Math.random() / 5;
   
    this.centerCircle = this.scene.add.ellipse(this.x, this.y, this.size, this.size, 0xFFB7C5, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
    this.petal1 = this.scene.add.ellipse(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
    this.petal2 = this.scene.add.ellipse(this.x + this.size * 0.5, this.y - this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
    this.petal3 = this.scene.add.ellipse(this.x - this.size * 0.5, this.y + this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
    this.petal4 = this.scene.add.ellipse(this.x + this.size * 0.5, this.y + this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
  }

  update(time, playerXVel) {
    if (this.y > this.scene.scale.height) {
      const newX = -2000 + Math.random() * (this.scene.scale.width + 4000);
      this.y = 0;
      this.x = newX;
    } else {
      this.y += this.speed; // Fall speed
      const extraAdd = -1 * this.ySpeed;
      this.x += extraAdd - (playerXVel * 0.02); // Sway left and right, and be affected by player movement
      this.centerCircle.setPosition(this.x, this.y);
      this.petal1.setPosition(this.x - this.size * 0.5, this.y - this.size * 0.5);
      this.petal2.setPosition(this.x + this.size * 0.5, this.y - this.size * 0.5);
      this.petal3.setPosition(this.x - this.size * 0.5, this.y + this.size * 0.5);
      this.petal4.setPosition(this.x + this.size * 0.5, this.y + this.size * 0.5);
    }
  }
}
