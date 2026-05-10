import Lightbulb from '../sprites/Lightbulb.js';
import Monster from '../sprites/Monster.js';

export default class LevelScene extends Phaser.Scene {
  constructor(levelSceneName, data) {
    super(levelSceneName);

    this.skyImgName = data.skyImgName || "sky";
    this.bgImgName = data.bgImgName || "neighborhooddecor";
    this.tileMapName = data.tileMapName || "neighborhoodtilemap";
    this.playerStartX = data.playerStartX || 100;
    this.playerStartY = data.playerStartY || 200;
    this.nextSceneThroughDoor = data.nextSceneThroughDoor || "MccInteriorScene";
    this.startDark = data.startDark || .5;
    this.bulbLight = data.bulbLight || .05;
    this.instructionsString = data.instructionsString || `Welcome to Midtown!

Your goal is to make it to the MCC.

Use LEFT and RIGHT to move.

Press ${window.CONTROLLER ? "A" : "SPACE"} to jump.

Avoid the monsters (or jump on them).

Collect light bulbs.

Watch the timer.

Good luck!`;
  }

  init(data) {
    this.playerSpriteName = data.playerSpriteName || "player1";
    this.currentScore = data.currentScore || 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.movingOn = false;
    this.spaceDown = false;

    this.bulbCount = 0;

    const sky = this.add.image(width * .5, height * .5, this.skyImgName).setScrollFactor(0, 0);
    sky.setDepth(.001)
    sky.setScale(2);

    const map = this.make.tilemap({ key: this.tileMapName});
    const tileset = map.addTilesetImage('groundset', 'tiles');
    const mccSideTileset = map.addTilesetImage('MccSideTileset', 'MccSideImg');
    const hylandClassroomTileset = map.addTilesetImage('HylandClassroomTileset', 'HylandClassroom3');
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels, true, true, false, true);

    
    const bgBasic = this.add.image(0, 0, this.bgImgName).setOrigin(0, 0).setScrollFactor(.84);
    bgBasic.setDepth(.05);

    const ground = map.createLayer('ground', tileset);
    ground.setDepth(0);
    const lightbulbsLayer = map.getObjectLayer('lightbulbs')['objects'];
    const monstersObjectLayer = map.getObjectLayer('MonstersLayer');
    const monstersLayer = monstersObjectLayer ? monstersObjectLayer['objects'] : [];
    const doorsLayer = map.getObjectLayer('DoorsLayer')['objects'];
    const enemyWallsObjectLayer = map.getObjectLayer('EnemyWallsLayer');
    const enemyWallsLayer = enemyWallsObjectLayer ? enemyWallsObjectLayer['objects'] : [];

    const mccSideLayer = map.createLayer('MccSideLayer', mccSideTileset);
    mccSideLayer.setDepth(1);
    mccSideLayer.y -= 5;
    const hylandClassroomLayer = map.createLayer('HylandClassroomLayer', hylandClassroomTileset);
    hylandClassroomLayer && hylandClassroomLayer.setDepth(1);
    ground.setCollisionByProperty({ collides: true });
    for (let i = 0; i < ground.layer.data.length; i++) {
      for (let j = 0; j < ground.layer.data[i].length; j++) {
        const tile = ground.layer.data[i][j];
        tile.collideDown = false;
        tile.collideUp = true;
        tile.collideLeft = true;
        tile.collideRight = true;
      }
    }

    this.player = this.physics.add.sprite(this.playerStartX, this.playerStartY, this.playerSpriteName);
    this.player.body.setGravityY(300);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(1.1);

    this.anims.remove('left');
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(this.playerSpriteName, { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.remove('jump');
    this.anims.create({
        key: 'jump',
        frames: [ { key: this.playerSpriteName, frame: 1 } ],
        frameRate: 20
    });

    this.anims.remove('turn');
    this.anims.create({
        key: 'turn',
        frames: [ { key: this.playerSpriteName, frame: 0 } ],
        frameRate: 20
    });

    this.anims.remove('right');
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers(this.playerSpriteName, { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    this.overlay = this.add.rectangle(0, 0, width, height, 0x000000, this.startDark)
      .setOrigin(0, 0)
      .setScrollFactor(0, 0)
      .setDepth(.9)

    this.bulbs = this.physics.add.group({immovable: true, allowGravity: false});
    this.enemyWalls = this.physics.add.group({immovable: true, allowGravity: false});
    this.monsters = this.physics.add.group();
    this.physics.add.collider(this.monsters, ground);
    
    this.anims.remove('volt');
    this.anims.create({
      key: 'volt',
      frames: this.anims.generateFrameNumbers('lightbulb', { start: 0, end: 7 }),
      frameRate: 2,
      repeat: -1
    });
    
    this.anims.remove('move');
    this.anims.create({
      key: 'move',
      frames: this.anims.generateFrameNumbers('MonsterImg', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.remove('fall');
    this.anims.create({
      key: 'fall',
      frames: this.anims.generateFrameNumbers('MonsterImg', { frames: [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3] }),
      frameRate: 12,
    });

    monstersLayer.forEach(monsterObj => {
      const {x, y} = monsterObj;
      const newMonster = new Monster({scene:this,x,y});
      this.monsters.add(newMonster);
    });

    lightbulbsLayer.forEach(lightbulbObj => {
      const {x, y} = lightbulbObj;
      this.bulbs.add(new Lightbulb({scene:this,x,y}));
    });

    enemyWallsLayer.forEach(enemyWallObj => {
      const {x, y, width, height} = enemyWallObj;
      const wall = this.add.rectangle(x, y, width, height, 0x000000, 0).setOrigin(0, 0);
      this.enemyWalls.add(wall);
    });

    doorsLayer.forEach(doorObj => {
      const {x, y, width, height, properties} = doorObj;
      const door = this.add.rectangle(x + width / 2, y + height / 2, width, height, 0x000000, 0).setOrigin(.5, .5);
      door.setDepth(2)
      this.physics.add.existing(door, true);
      
      this.physics.add.overlap(this.player, door, () => {
        if (this.movingOn) return;
        this.timeTicking = false;
        this.currentScore = this.currentScore + this.timeLimit;
        this.movingOn = true;
        door.setFillStyle(0x000000, 1);
        this.player.setVelocityX(Phaser.Math.Linear(160, 0, .7));
        this.player.anims.play('turn');
        this.player.setAlpha(Phaser.Math.Linear(1, 0, .5));
        
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start(this.nextSceneThroughDoor, {playerSpriteName: this.playerSpriteName, currentScore: this.currentScore, win: true});
        });
      });
    });

    this.physics.add.collider(this.player, ground);
    this.bulbAmount = 100;
    this.bulbCollider = this.physics.add.collider(this.player, this.bulbs, (p, b) => { b.destroy(); this.bulbCount++; this.currentScore += this.bulbAmount; });
    this.bulbCollider.overlapOnly = true;

    this.physics.add.collider(this.enemyWalls, this.monsters);

    this.monsterCollider = this.physics.add.collider(this.player, this.monsters, (p, m) => {
      if (p.y < (m.y-32)) {
        this.currentScore += 200;
        m.fall();
        p.setVelocityY(-200);
        m.on('animationcomplete', () => {
          m.destroy();
        });
      } else {
        if (this.movingOn) return;
        this.movingOn = true;
        this.timeTicking = false;
        this.player.body.enable = false;
        this.player.anims.play('turn');
        
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start("GameOverScene", {playerSpriteName: this.playerSpriteName, currentScore: this.currentScore, win: false, lossReason: "a monster got you!"});
        });
      }
    });

    if (window.CRT) {
      this.scoreText = this.add.bitmapText(50, 20, "pixelfontblack", "", 12).setOrigin(0, 0).setScrollFactor(0, 0);
      this.timeText = this.add.bitmapText(width - 50, 20, "pixelfontblack", "", 12).setOrigin(1, 0).setScrollFactor(0, 0);
    } else {
      const topBarRect = this.add.rectangle(0, 0, width, 20, 0x000000, 1).setOrigin(0, 0).setScrollFactor(0, 0);
      topBarRect.setDepth(2);
      this.scoreText = this.add.bitmapText(10, 5, "pixelfont", "", 12).setOrigin(0, 0).setScrollFactor(0, 0);
      this.timeText = this.add.bitmapText(width - 10, 5, "pixelfont", "", 12).setOrigin(1, 0).setScrollFactor(0, 0);
    }
    
    this.scoreText.setDepth(3);
    this.timeText.setDepth(3);
    this.timeLimit = 600;
    this.timeTicking = true;
    
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.timer = this.time.addEvent({
      delay: 100, 
      loop: true,
      callback: () => {
        if (this.timeTicking && !this.instructionsShowing) {
          this.timeLimit--;
        }
        
        this.timeText.text = `00:${(this.timeLimit / 10).toFixed(1).padStart(4, '0')}`;

        if (this.timeLimit === 0) {
          if (this.movingOn) return;
          this.movingOn = true;
          this.timeTicking = false;
          this.player.setVelocityX(0);
          this.player.anims.play('turn');
          
          this.cameras.main.fadeOut(1000, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("GameOverScene", {playerSpriteName: this.playerSpriteName, currentScore: this.currentScore, win: false, lossReason: "you ran out of time!"});
          });
        }
      }
    });

    this.instructionsShowing = !window.tryingAgain;
    if (!this.instructionsShowing) return;

    const instructionsEdge = 50;

    this.instructionsRectBorder = this.add.rectangle(instructionsEdge, instructionsEdge, width-(instructionsEdge*2), height-(instructionsEdge*2), 0xFFFFFF, 1).setOrigin(0, 0).setScrollFactor(0, 0);
    this.instructionsRectBorder.setDepth(4);

    this.instructionsRect = this.add.rectangle(instructionsEdge+5, instructionsEdge+5, width-((instructionsEdge+5)*2), height-((instructionsEdge+5)*2), 0x000000, 1).setOrigin(0, 0).setScrollFactor(0, 0);
    this.instructionsRect.setDepth(4);

    this.instructionsText = this.add.bitmapText(width* .5, height * .5, "pixelfont", this.instructionsString, 12).setOrigin(.5, .5).setScrollFactor(0, 0);
    this.instructionsText.setDepth(4);

    this.aBtn = this.add.image(width * .87, height * .78 + 20, 'ABtn').setOrigin(1, 1).setScrollFactor(0, 0);
    this.aBtn.setAlpha(window.CONTROLLER ? 1 : 0);
    this.aBtn.setDepth(4);
  }

  update() {
    this.scoreText.setText(`SCORE: ${this.currentScore}`);

    if (this.instructionsShowing) {
      if (this.cursors.space.isDown) {
        this.spaceDown = true;
      }

      if (this.spaceDown == true && this.cursors.space.isUp) {
        this.spaceDown = false;
        this.instructionsShowing = false;
        this.instructionsRectBorder.destroy();
        this.instructionsRect.destroy();
        this.instructionsText.destroy();
        this.aBtn.destroy();
      }

      return;
    }

    const runVelocity = 160 * (this.cursors.shift.isDown ? 4 : 1);
    
    const targetAlpha = Math.max(0, this.startDark - this.bulbCount * this.bulbLight);
    const currentAlpha = this.overlay.fillAlpha;
    this.overlay.setFillStyle(0x000000, Phaser.Math.Linear(currentAlpha, targetAlpha, 0.1));

    const bodyOnFloor = this.player.body.onFloor();
    let animToPlay;
    
    // update monsters
    this.monsters.children.iterate(monster => {
      monster.update();
    });

    if (this.movingOn) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.flipX = true;
      this.player.setVelocityX(runVelocity * -1);
      animToPlay = 'left';
    } else if (this.cursors.right.isDown) {
      this.player.flipX = false;
      this.player.setVelocityX(runVelocity);
      animToPlay = 'right';
    } else {
      this.player.setVelocityX(0);
      animToPlay = 'turn'
    }

    animToPlay = bodyOnFloor ? animToPlay : 'jump';
    this.player.anims.play(animToPlay, true);

    if (this.cursors.space.isDown && bodyOnFloor) {
      this.player.setVelocityY(-330);
    }
  }
}
