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
    this.load.image('skyr', 'public/assets/pinksky.png');
    this.load.image('skyy', 'public/assets/yellowsky.png');
    this.load.image('skyg', 'public/assets/greensky.png');

    this.load.image('sea', 'public/assets/seatry2.png');

    this.load.image('mtn1', 'public/assets/bgmtn1.png');
    this.load.image('mtn1r', 'public/assets/bgmtn1r.png');
    this.load.image('mtn1y', 'public/assets/bgmtn1y.png');
    this.load.image('mtn2', 'public/assets/bgmtn2.png');
    this.load.image('mtn2r', 'public/assets/bgmtn2r.png');
    this.load.image('mtn2y', 'public/assets/bgmtn2y.png');
    this.load.image('mtn2g', 'public/assets/bgmtn2g.png');
    this.load.image('mtn1g', 'public/assets/bgmtn1g.png');

    this.load.image('mask1', 'public/assets/mask1.png');
    this.load.image('mask2', 'public/assets/mask2.png');
    this.load.image('mask3', 'public/assets/mask3.png');
    this.load.image('mask4', 'public/assets/mask4.png');
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    let bgContainer1 = this.add.container(0, 0);
    let bgContainer2 = this.add.container(0, 0);
    let bgContainer3 = this.add.container(0, 0);
    let bgContainer4 = this.add.container(0, 0);

    const sky = this.add.image(width * .5, height * .5, 'sky').setScrollFactor(0, 0);
    sky.setScale(2);
    bgContainer1.add(sky);

    const skyr = this.add.image(width * .5, height * .5, 'skyr').setScrollFactor(0, 0);
    skyr.setScale(2);
    bgContainer2.add(skyr);

    const skyy = this.add.image(width * .5, height * .5, 'skyy').setScrollFactor(0, 0);
    skyy.setScale(2);
    bgContainer3.add(skyy);

    const skyg = this.add.image(width * .5, height * .5, 'skyg').setScrollFactor(0, 0);
    skyg.setScale(2);
    bgContainer4.add(skyg);

    const mtn1 = this.add.image(0, 0, 'mtn1').setOrigin(0, 0).setScrollFactor(.25);
    mtn1.setScale(2);
    bgContainer1.add(mtn1);
    const mtn2 = this.add.image(0, 0, 'mtn2').setOrigin(0, 0).setScrollFactor(.5);
    bgContainer1.add(mtn2);
    mtn2.setScale(2);

    const mtn1r = this.add.image(0, 0, 'mtn2r').setOrigin(0, 0).setScrollFactor(.25);
    mtn1r.setScale(2);
    bgContainer2.add(mtn1r);
    const mtn2r = this.add.image(0, 0, 'mtn1r').setOrigin(0, 0).setScrollFactor(.5);
    bgContainer2.add(mtn2r);
    mtn2r.setScale(2);

    const mtn1y = this.add.image(0, 0, 'mtn2y').setOrigin(0, 0).setScrollFactor(.25);
    mtn1y.setScale(2);
    bgContainer3.add(mtn1y);
    const mtn2y = this.add.image(0, 0, 'mtn1y').setOrigin(0, 0).setScrollFactor(.5);
    bgContainer3.add(mtn2y);
    mtn2y.setScale(2);

    const mtn1g = this.add.image(0, 0, 'mtn2g').setOrigin(0, 0).setScrollFactor(.25);
    mtn1g.setScale(2);
    bgContainer4.add(mtn1g);
    const mtn2g = this.add.image(0, 0, 'mtn1g').setOrigin(0, 0).setScrollFactor(.5);
    bgContainer4.add(mtn2g);
    mtn2g.setScale(2);

    //const sea = this.add.image(0, 0, 'sea').setOrigin(0, 0).setScrollFactor(.75);
    //bgContainer.add(sea);

    let maskImg = this.make.image({ x: 0, y: 0, key: "mask1", add:false }).setOrigin(0, 0).setDisplaySize(width, height);
    maskImg.setScrollFactor(0, 0);
    let mask = maskImg.createBitmapMask();
    bgContainer1.setMask(mask);

    let maskImg2 = this.make.image({ x: 0, y: 0, key: "mask2", add:false }).setOrigin(0, 0).setDisplaySize(width, height);
    maskImg2.setScrollFactor(0, 0);
    let mask2 = maskImg2.createBitmapMask();
    bgContainer2.setMask(mask2);

    let maskImg3 = this.make.image({ x: 0, y: 0, key: "mask3", add:false }).setOrigin(0, 0).setDisplaySize(width, height);
    maskImg3.setScrollFactor(0, 0);
    let mask3 = maskImg3.createBitmapMask();
    bgContainer3.setMask(mask3);

    let maskImg4 = this.make.image({ x: 0, y: 0, key: "mask4", add:false }).setOrigin(0, 0).setDisplaySize(width, height);
    maskImg4.setScrollFactor(0, 0);
    let mask4 = maskImg4.createBitmapMask();
    bgContainer4.setMask(mask4);

    const map = this.make.tilemap({ key: 'tilemap'});
    const tileset = map.addTilesetImage('groundset', 'tiles');
    const tileset2 = map.addTilesetImage('topdec', 'topdecimg');
    const tileset3 = map.addTilesetImage('tree', 'treeimg');
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const ground = map.createLayer('ground', tileset);
    bgContainer2.add(ground);
    const topdecor = map.createLayer('topdecor', tileset2);
    bgContainer1.add(topdecor);
    const treedecor = map.createLayer('trees', tileset3);
    bgContainer1.add(treedecor);
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
