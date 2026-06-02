export default class Message {
  constructor(scene, x, y, text, width, height, showA = false, moveWithCamera = false, fontSize = 12, subtitle = "") {
    this.scene = scene;
    this.text = text;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.showA = showA;
    this.moveWithCamera = moveWithCamera;

    this.border = this.scene.add
      .rectangle(
        this.x,
        this.y,
        this.width,
        this.height,
        0xffffff,
        1,
      )
      .setOrigin(0,  0);
    if (moveWithCamera) {
      this.border.setScrollFactor(0, 0);
    }
    this.border.setAlpha(0);
    this.border.setDepth(5);

    this.container = this.scene.add
      .rectangle(
        this.x + 5,
        this.y + 5,
        this.width - 10,
        this.height - 10,
        0x000000,
        1,
      )
      .setOrigin(0, 0);
    if (moveWithCamera) {
      this.container.setScrollFactor(0, 0);
    }
    this.container.setAlpha(0);
    this.container.setDepth(5);

    this.text = this.scene.add
      .bitmapText(
        this.x + this.width * 0.5,
        this.y + this.height * 0.5,
        "pixelfont",
        this.text,
        fontSize,
      )
      .setOrigin(0.5, 0.5);
    if (moveWithCamera) {
      this.text.setScrollFactor(0, 0);
    }
    this.text.setAlpha(0);
    this.text.setDepth(5);

    this.subtitle = this.scene.add
      .bitmapText(
        this.x + this.width * 0.5 + 50,
        this.y + this.height - 15,
        "pixelfontyellow",
        subtitle,
        12,
      )
      .setOrigin(0.5, 0.5);
    if (moveWithCamera) {
      this.subtitle.setScrollFactor(0, 0);
    }
    this.subtitle.setAlpha(0);
    this.subtitle.setDepth(5);

    this.aBtn = this.scene.add
      .image(this.x + this.width * 0.87, this.y + this.height * 0.78 + 20, "ABtn")
      .setOrigin(1, 1);
    if (moveWithCamera) {
      this.aBtn.setScrollFactor(0, 0);
    }
    this.aBtn.setAlpha(0);
    this.aBtn.setDepth(5);
  }

  fadeOutItem(item, time) {
    this.scene.tweens.add({
      targets: item,
      alpha: 0,
      duration: time,
    });
  }

  fadeInItem(item, time) {
    this.scene.tweens.add({
      targets: item,
      alpha: 1,
      duration: time,
    });
  }

  show(fadeInTime = 0) {
    if (this.scene.mirrored) {
      this.text.setScale(-1, 1);
      this.subtitle.setScale(-1, 1);
    } else {
      this.text.setScale(1, 1);
      this.subtitle.setScale(1, 1);
    }

    if (fadeInTime > 0) {
      this.fadeInItem(this.border, fadeInTime);
      this.fadeInItem(this.container, fadeInTime);
      this.fadeInItem(this.text, fadeInTime);
      this.fadeInItem(this.subtitle, fadeInTime);
      this.showA && this.fadeInItem(this.aBtn, fadeInTime);
    } else {
      this.border.setAlpha(1);
      this.container.setAlpha(1);
      this.text.setAlpha(1);
      this.subtitle.setAlpha(1);
      this.aBtn.setAlpha(this.showA ? 1 : 0);
    }
  }

  hide(fadeOutTime = 0) {
    if (fadeOutTime > 0) {
      this.fadeOutItem(this.border, fadeOutTime);
      this.fadeOutItem(this.container, fadeOutTime);
      this.fadeOutItem(this.text, fadeOutTime);
      this.fadeOutItem(this.aBtn, fadeOutTime);
      this.fadeOutItem(this.subtitle, fadeOutTime);
    } else {
      this.border.setAlpha(0);
      this.container.setAlpha(0);
      this.text.setAlpha(0);
      this.aBtn.setAlpha(0);
      this.subtitle.setAlpha(0);
    }
  }

  destroy() {
    this.border.destroy();
    this.container.destroy();
    this.text.destroy();
    this.aBtn.destroy();
    this.subtitle.destroy();
  }
}
