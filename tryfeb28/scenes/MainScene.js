const createAligned = (scene, count, texture, scrollFactor) => {
  const mtn1 = scene.add.image(0, 0, 'mtn1').setOrigin(0, 0).setScrollFactor(.25);
  mtn1.setScale(2);
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  preload() {
    this.load.image('tiles', 'public/assets/groundtiles.png');
    this.load.image('topdecimg', 'public/assets/topdec2.png');
    this.load.image('treeimg', 'public/assets/tree.png');
    this.load.tilemapTiledJSON('tilemap', 'public/assets/scene1.json');
    this.load.spritesheet('player', 'public/assets/p2.png', { frameWidth: 16, frameHeight: 32 });

    this.load.image('sky', 'public/assets/bgsky.png');

    this.load.image('sea', 'public/assets/seatry2.png');

    this.load.image('mtn1', 'public/assets/bgmtn1a.png');
    this.load.image('mtn2', 'public/assets/bgmtn2a.png');

  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const sky = this.add.image(width * .5, height * .5, 'sky').setScrollFactor(0, 0);
    sky.setScale(2);


    const mtn1 = this.add.image(0, 0, 'mtn1').setOrigin(0, 0).setScrollFactor(.25);
    mtn1.setScale(2);
    const mtn2 = this.add.image(0, 0, 'mtn2').setOrigin(0, 0).setScrollFactor(.5);
    mtn2.setScale(2);

    const sea = this.add.image(0, 0, 'sea').setOrigin(0, 0).setScrollFactor(.75);

    const map = this.make.tilemap({ key: 'tilemap'});
    const tileset = map.addTilesetImage('groundset', 'tiles');
    const tileset2 = map.addTilesetImage('topdec', 'topdecimg');
    const tileset3 = map.addTilesetImage('tree', 'treeimg');
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const ground = map.createLayer('ground', tileset);
    const topdecor = map.createLayer('topdecor', tileset2);
    const treedecor = map.createLayer('trees', tileset3);
    ground.setCollisionByProperty({ collides: true });

    this.player = this.physics.add.sprite(100, 100, 'player');
    this.player.body.setGravityY(300);
    this.player.setCollideWorldBounds(true);

      //  Our player animations, turning, walking left and walking right.
      this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'player', frame: 0 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(this.player, ground);


    this.cursors = this.input.keyboard.createCursorKeys();


    this.cameras.main.startFollow(this.player);
    // this.cameras.main.setLerp(.9, 0);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  update() {
    if (this.cursors.left.isDown)
    {
      this.player.flipX = true;
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
      this.player.flipX = false;
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    }
    else
    {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.onFloor())
    {
      this.player.setVelocityY(-330);
    }
  }
}
