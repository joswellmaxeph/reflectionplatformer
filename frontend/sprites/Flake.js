const MIN_SIZE_SNOW = 2;
const MAX_SIZE_SNOW = 4;
const MIN_SPEED_SNOW = 1;
const MAX_SPEED_SNOW = 2;
const MAX_X_VEL_SNOW = .5;

const MIN_SIZE_CHERRY = 3;
const MAX_SIZE_CHERRY = 5;
const MIN_SPEED_CHERRY = .5;
const MAX_SPEED_CHERRY = 1;
const MAX_X_VEL_CHERRY = 0;

const randomFallColor = () => {
  const colorIdx = Math.floor(Math.random() * fallColors.length);
  return fallColors[colorIdx];
}

export default class Flake {
  constructor(scene, x, y, type) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.pieces = [];
    this.loadType(type);
  }

  loadType(type) {
    this.type = type;
    for (let i = 0; i < this.pieces.length; i++) {
      this.pieces[i].destroy();
    }

    if (type === "Winter") {
      this.size = Math.random() * (MAX_SIZE_SNOW - MIN_SIZE_SNOW) + MIN_SIZE_SNOW;
      this.speed = Math.random() * (MAX_SPEED_SNOW - MIN_SPEED_SNOW) + MIN_SPEED_SNOW;
      const flake = this.scene.add.ellipse(this.x, this.y, this.size, this.size, 0xFFFFFF, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7);
      this.pieces.push(flake);
    } else if (type === "Spring") {
      if (Math.random() > .95) {
        this.size = Math.random() * (MAX_SIZE_CHERRY - MIN_SIZE_CHERRY) + MIN_SIZE_CHERRY;
        this.speed = Math.random() * (MAX_SPEED_CHERRY - MIN_SPEED_CHERRY) + MIN_SPEED_CHERRY;
        this.pieces.push(this.scene.add.ellipse(this.x, this.y, this.size, this.size, 0xFFB7C5, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7));
        this.pieces.push(this.scene.add.ellipse(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7));
        this.pieces.push(this.scene.add.ellipse(this.x + this.size * 0.5, this.y - this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7));
        this.pieces.push(this.scene.add.ellipse(this.x - this.size * 0.5, this.y + this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7));
        this.pieces.push(this.scene.add.ellipse(this.x + this.size * 0.5, this.y + this.size * 0.5, this.size, this.size, 0xFFD1DC, 1).setOrigin(0.5).setScrollFactor(0).setDepth(7));
      }
    } else if (type === "Fall") {
      if (Math.random() > .1) {
        this.speed = Math.random() * (.8 - .2) + .2;
        const maxSize = 8;
        const minSize = 4;
        this.size = Math.random() * (maxSize - minSize) + minSize;

        // pick a random leaf img from the spritesheet and add it as a piece
        const leafIdx = Math.floor(Math.random() * 9);
        this.pieces.push(this.scene.add.image(this.x, this.y, 'leaves', leafIdx).setOrigin(0.5).setScrollFactor(0).setDepth(7).setDisplaySize(this.size, this.size));
      }
    }
  }

  update(time, playerXVel, type) {
    if (this.type !== type) {
      this.loadType(type);
    }

    if (this.y > this.scene.scale.height) {
      const newX = -2000 + Math.random() * (this.scene.scale.width + 4000);
      this.y = 0;
      this.x = newX;
            for (let i = 0; i < this.pieces.length; i++) {
        const currentPiece = this.pieces[i];
        currentPiece.y -= this.scene.scale.height;
        currentPiece.x += newX;
        // currentPiece.setPosition(this.x, this.y);
      }
    } else {
      const ySpeedUpdate = this.speed;
      this.y += ySpeedUpdate;
      const extraAdd = -.2 * Math.random();
      const xSpeedUpdate = extraAdd - (playerXVel * 0.02);
      this.x += xSpeedUpdate;
      for (let i = 0; i < this.pieces.length; i++) {
        const currentPiece = this.pieces[i];
        currentPiece.x += xSpeedUpdate;
        currentPiece.y += ySpeedUpdate;
        // currentPiece.setPosition(this.x, this.y);
      }
    }
  }
}
