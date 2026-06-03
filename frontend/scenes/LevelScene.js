import Lightbulb from "../sprites/Lightbulb.js";
import Monster from "../sprites/Monster.js";
import Portal from "../sprites/Portal.js";
import Message from "../sprites/Message.js";
import SnowFlake from "../sprites/SnowFlake.js";

const NUM_FLAKES = 200;

const levelsMap = {
  Winter: {
    mirrored: false,
    groundsetTiles: "tiles",
    portal: "WinterToSpringPortal",
    portalSide: "right",
    nextLevel: "Spring",
    playerSprite: "player9",
    onPortal: (scene) => {
      scene.timeLoss = 2;
    }
  },
  Spring: {
    sceneMsg: ` . . . YOU LOSE TIME
    IN THE SPRING . . . `,
    mirrored: true,
    groundsetTiles: "tiles2",
    portal: "SpringToSummerPortal",
    onPortal: (scene) => {
      scene.baseJumpVel = -400;
    },
    portalSide: "left",
    nextLevel: "Summer",
    coins: "SpringCoins",
    playerSprite: "player10",
  },
  Summer: {
    sceneMsg: ` . . . YOU ARE HAUNTED
    IN THE SUMMER . . . `,
    mirrored: false,
    groundsetTiles: "tiles3",
    portal: "SummerToFallPortal",
    onPortal: (scene) => {
      scene.baseRunVel = 100;
    },
    portalSide: "right",
    portalImage: "Key",
    nextLevel: "Fall",
    coins: "SummerCoins",
    monsters: "SummerMonsters",
    playerSprite: "player10",
  },
  Fall: {
    sceneMsg: ` . . . YOU MUST RETURN
    IN THE FALL . . . `,
    mirrored: false,
    groundsetTiles: "tiles4",
    portal: undefined,
    monsters: "FallMonsters",
    playerSprite: "player10",
  },
};

window.gamePaused = false;
window.instructionsShowing = true;

function pauseMenuHandler(event) {
  if (window.scene !== "MainScene") return;
  if (event.code === "Enter") {
    if (!window.gamePaused && !window.instructionsShowing) {
      window.gamePaused = true;
      createPauseMenu();
      window.game.pause();
      return;
    } else if (window.gamePaused) {
      const resumeBtn = document.querySelector(".resume-btn");
      resumeBtn.click();
    }
  }

  if (["ArrowLeft", "ArrowRight"].includes(event.code) && window.gamePaused) {
    const resumeBtn = document.querySelector(".resume-btn");
    const restartBtn = document.querySelector(".restart-btn");
    if (document.activeElement === resumeBtn) {
      restartBtn.focus();
    } else {
      resumeBtn.focus();
    }
  }

  if (event.code === "Space" && window.gamePaused) {
    document.activeElement.click();
  }
}

function createPauseMenu() {
  const overlayContainer = document.querySelector(".overlay-container");
  
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  const title = document.createElement("h1");
  title.innerText = "GAME PAUSED";
  const resumeBtn = document.createElement("button");
  resumeBtn.innerText = "Resume";
  resumeBtn.classList.add("resume-btn");
  resumeBtn.onclick = () => {
    window.game.resume();
    overlay.remove();
    overlayContainer.style.background = "transparent";
    window.gamePaused = false;
  };
  const restartBtn = document.createElement("button");
  restartBtn.innerText = "Restart";
  restartBtn.classList.add("restart-btn");
  restartBtn.onclick = () => {
    window.location.reload();
  };
  overlay.appendChild(title);
  overlay.appendChild(resumeBtn);
  overlay.appendChild(restartBtn);

  overlayContainer.style.background = "#40404f40";
  overlayContainer.appendChild(overlay);
  setTimeout(() => resumeBtn.focus(), 0);
}

document.addEventListener("keydown", pauseMenuHandler);

function getTimeString(timeLimit) {
  const minutes = Math.floor(timeLimit / 600);
  const seconds = (timeLimit % 600) / 10;
  let secondsString = seconds.toString();
  if (!secondsString.includes(".")) {
    secondsString = `${secondsString}.0`;
  }
  secondsString = secondsString.padStart(4, "0");
  return `${minutes}:${secondsString}`;
}

export default class LevelScene extends Phaser.Scene {
  constructor(levelSceneName, data) {
    super(levelSceneName);

    this.skyImgName = data.skyImgName || "sky";
    this.bgImgName = data.bgImgName || "neighborhooddecor";
    this.tileMapName = data.tileMapName || "neighborhoodtilemap";
    this.playerStartX = data.playerStartX || 100;
    this.playerStartY = data.playerStartY || 200;
    this.nextSceneThroughDoor = data.nextSceneThroughDoor || "MccInteriorScene";
    this.startDark = data.startDark || 0.5;
    this.bulbLight = data.bulbLight || 0.05;
    this.instructionsString =
      data.instructionsString ||
      `Welcome to Midtown!

Your goal is to make it to the MCC.

Use LEFT and RIGHT to move.

Press ${window.CONTROLLER ? "A" : "SPACE"} to jump.

Avoid the monsters (or jump on them).

Collect light bulbs.

Watch the timer.

Good luck!`;
  }

  init(data) {
    this.playerSpriteName = data.playerSpriteName || "player9";
    this.currentScore = data.currentScore || 0;
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    this.movingOn = false;
    this.spaceDown = false;

    this.mirrored = false;
    this.canvasLeft = 0;

    this.baseRunVel = 160;
    this.baseJumpVel = -330;
    this.timeLoss = 1;

    this.tmpSpeedBoost = 1;

    this.bulbCount = 0;

    const sky = this.add
      .image(width * 0.5, height * 0.5, this.skyImgName)
      .setScrollFactor(0, 0);
    sky.setDepth(0.001);
    sky.setScale(12.8);

    const map = this.make.tilemap({ key: this.tileMapName });
    const tileset = map.addTilesetImage("groundset", "tiles");
    const tileset2 = map.addTilesetImage("groundset", "tiles2");
    const tileset3 = map.addTilesetImage("groundset", "tiles3");
    const tileset4 = map.addTilesetImage("groundset", "tiles4");
    const mccSideTileset = map.addTilesetImage("MccSideTileset", "MccSideImg");
    const hylandClassroomTileset = map.addTilesetImage(
      "HylandClassroomTileset",
      "HylandClassroom3",
    );
    this.physics.world.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels,
      true,
      true,
      false,
      true,
    );

    // const bgBasic = this.add
    //   .image(0, 0, this.bgImgName)
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0.4);
    // bgBasic.setDepth(0.05);
    // bgBasic.setScale(2);

    const ground = map.createLayer("ground", tileset);
    ground.setDepth(1);
    const finalDoorLayer = map.getObjectLayer("FinalDoor")["objects"];
    const enemyWallsObjectLayer = map.getObjectLayer("EnemyWallsLayer");
    const enemyWallsLayer = enemyWallsObjectLayer
      ? enemyWallsObjectLayer["objects"]
      : [];

    const mccSideLayer = map.createLayer("MccSideLayer", mccSideTileset);
    mccSideLayer.setDepth(1);
    mccSideLayer.y -= 5;
    const hylandClassroomLayer = map.createLayer(
      "HylandClassroomLayer",
      hylandClassroomTileset,
    );
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

    this.player = this.physics.add.sprite(
      this.playerStartX,
      this.playerStartY,
      this.playerSpriteName,
    );
    this.player.body.setGravityY(300);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(1.1);

    this.anims.remove("left");
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(this.playerSpriteName, {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.remove("jump");
    this.anims.create({
      key: "jump",
      frames: [{ key: this.playerSpriteName, frame: 5 }],
      frameRate: 20,
    });

    this.anims.remove("turn");
    this.anims.create({
      key: "turn",
      frames: [{ key: this.playerSpriteName, frame: 4 }],
      frameRate: 20,
    });

    this.anims.remove("right");
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(this.playerSpriteName, {
        start: 0,
        end: 3,
      }),
      frameRate: 8,
      repeat: -1,
    });

    // this.overlay = this.add
    //   .rectangle(0, 0, width, height, 0x000000, this.startDark)
    //   .setOrigin(0, 0)
    //   .setScrollFactor(0, 0)
    //   .setDepth(0.9);

    this.flakes = [];
    for (let i = 0; i < NUM_FLAKES; i++) {
      this.flakes.push(new SnowFlake(this, -500 +Math.random() * (this.scale.width + 1000), Math.random() * this.scale.height));
    }

    this.bulbs = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.enemyWalls = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.portals = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.portals2 = this.physics.add.group({
      immovable: true,
      allowGravity: false,
    });
    this.monsters = this.physics.add.group();
    this.physics.add.collider(this.monsters, ground);

    // this.anims.remove("volt");
    // this.anims.create({
    //   key: "volt",
    //   frames: this.anims.generateFrameNumbers("lightbulb", {
    //     start: 0,
    //     end: 7,
    //   }),
    //   frameRate: 2,
    //   repeat: -1,
    // });

    this.anims.remove("move");
    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("MonsterImg", {
        start: 0,
        end: 1,
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.anims.remove("fall");
    this.anims.create({
      key: "fall",
      frames: this.anims.generateFrameNumbers("MonsterImg", {
        frames: [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3],
      }),
      frameRate: 12,
    });

    enemyWallsLayer.forEach((enemyWallObj) => {
      const { x, y, width, height } = enemyWallObj;
      const wall = this.add
        .rectangle(x, y, width, height, 0x000000, 0)
        .setOrigin(0, 0);
      this.enemyWalls.add(wall);
    });

    const finalDoor = finalDoorLayer[0];
    const door = new Portal({
      scene: this,
      x: finalDoor.x,
      y: finalDoor.y + finalDoor.height / 2,
      img: "Door",
    });

    this.doorMsg = new Message(
      this,
      20,
      120,
      `You must have the key to enter!

(press START to restart)      `,
      320,
      80,
    );

    this.doorMsg.hide();

    this.portals.add(door);
    this.physics.add.existing(door, false);
    this.physics.add.overlap(this.player, door, () => {
      // Handle player reaching the door
      if (this.currentLevel !== "Fall") {
        this.overlapFinalDoor = true;
        return;
      }
      this.doorMsg.hide();
      if (this.movingOn) return;
      this.timeTicking = false;
      this.currentScore = this.currentScore + this.timeLimit;
      this.movingOn = true;
      // door.setFillStyle(0x000000, 1);
      this.player.setVelocityX(Phaser.Math.Linear(160, 0, 0.7));
      this.player.anims.play("turn");
      this.player.setAlpha(Phaser.Math.Linear(1, 0, 0.5));

      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("GameOverScene", {
          playerSpriteName: this.playerSpriteName,
          currentScore: this.currentScore,
          win: true,
        });
      });
    });

    this.physics.add.collider(this.player, ground);
    this.bulbAmount = 20;
    this.bulbCollider = this.physics.add.collider(
      this.player,
      this.bulbs,
      (p, b) => {
        b.destroy();
        this.bulbCount++;
        this.timeLimit += this.bulbAmount;
      },
    );
    this.bulbCollider.overlapOnly = true;

    this.physics.add.collider(this.enemyWalls, this.monsters);

    this.monsterCollider = this.physics.add.collider(
      this.player,
      this.monsters,
      (p, m) => {
        if (p.y < m.y - 32) {
          this.timeLimit += 40;
          m.fall();
          p.setVelocityY(this.baseJumpVel * 0.9);
          this.tmpSpeedBoost = 1.5;
          m.on("animationcomplete", () => {
            m.destroy();
          });
        } else {
          if (this.movingOn) return;
          this.movingOn = true;
          this.timeTicking = false;
          this.player.body.enable = false;
          this.player.anims.play("turn");
          this.cameras.main.fadeOut(1000, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("GameOverScene", {
              playerSpriteName: this.playerSpriteName,
              currentScore: this.currentScore,
              win: false,
              lossReason: "a monster got you!",
            });
          });
        }
      },
    );

    if (window.CRT) {
      // this.add.rectangle(25, 15, 200, 24, 0xFFFFFF, 1).setOrigin(0, 0).setScrollFactor(0, 0).setDepth(2.9);
      this.add.rectangle(width / 2, 15, 160, 24, 0xFFFFFF, 1).setOrigin(0.5, 0).setScrollFactor(0, 0).setDepth(2.9);
      // this.scoreText = this.add
      //   .bitmapText(50, 20, "pixelfontblack", "", 18)
      //   .setOrigin(0, 0)
      //   .setScrollFactor(0, 0);
      this.timeText = this.add
        .bitmapText(width / 2, 20, "pixelfontblack", "", 18)
        .setOrigin(0.5, 0)
        .setScrollFactor(0, 0);
    } else {
      const topBarRect = this.add
        .rectangle(0, 0, width, 20, 0x000000, 1)
        .setOrigin(0, 0)
        .setScrollFactor(0, 0);
      topBarRect.setDepth(2);
      this.scoreText = this.add
        .bitmapText(10, 5, "pixelfont", "", 12)
        .setOrigin(0, 0)
        .setScrollFactor(0, 0);
      this.timeText = this.add
        .bitmapText(width - 10, 5, "pixelfont", "", 12)
        .setOrigin(1, 0)
        .setScrollFactor(0, 0);
    }

    // this.scoreText.setDepth(3);
    this.timeText.setDepth(3);
    this.timeLimit = 2400;
    this.timeTicking = true;

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys("W,A,S,D");

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    this.timer = this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        if (this.timeTicking && !window.instructionsShowing) {
          this.timeLimit -= this.timeLoss;
        }

        this.timeText.text = getTimeString(this.timeLimit);

        if (this.timeLimit === 0) {
          if (this.movingOn) return;
          this.movingOn = true;
          this.timeTicking = false;
          this.player.setVelocityX(0);
          this.player.anims.play("turn");

          this.cameras.main.fadeOut(1000, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("GameOverScene", {
              playerSpriteName: this.playerSpriteName,
              currentScore: this.currentScore,
              win: false,
              lossReason: "you ran out of time!",
            });
          });
        }
      },
    });

    const instructionsEdge = 50;

    if (!window.instructionsShowing) return;

    this.instructionsMsg = new Message(
      this,
      instructionsEdge,
      instructionsEdge,
      this.instructionsString,
      width - instructionsEdge * 2,
      height - instructionsEdge * 2,
      window.CONTROLLER,
      true,
      24
    );

    this.map = map;
    this.width = width;
    this.height = height;

    this.loadLevel("Winter");
  }

  loadLevel(name) {
    this.currentLevel = name;
    this.mirrored = levelsMap[name].mirrored;
    this.map.addTilesetImage("groundset", levelsMap[name].groundsetTiles);

    const portalLayerName = levelsMap[name].portal;
    const coinsLayerName = levelsMap[name].coins;
    const monstersLayerName = levelsMap[name].monsters;
    const sceneMsgTxt = levelsMap[name].sceneMsg;
    const playerSpriteName = levelsMap[name].playerSprite;

    if (playerSpriteName) {
      this.anims.remove("left");
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers(playerSpriteName, {
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      });

      this.anims.remove("jump");
      this.anims.create({
        key: "jump",
        frames: [{ key: playerSpriteName, frame: 5 }],
        frameRate: 20,
      });

      this.anims.remove("turn");
      this.anims.create({
        key: "turn",
        frames: [{ key: playerSpriteName, frame: 4 }],
        frameRate: 20,
      });

      this.anims.remove("right");
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers(playerSpriteName, {
          start: 0,
          end: 3,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    if (sceneMsgTxt) {
      this.sceneMsg && this.sceneMsg.destroy();
      this.sceneMsg = new Message(
        this,
        this.width - 420,
        this.height - 110,
        sceneMsgTxt,
        400,
        95,
        false,
        true,
        24,
        name === "Winter" ? "" : `split: ${getTimeString(this.timeLimit)}`
      );

      this.sceneMsg.hide(0);
      this.sceneMsgShow = () => {
        setTimeout(() => {
          this.sceneMsg.show(1000);
          setTimeout(() => {
            this.sceneMsg.hide(1000);
          }, 5000);
        }, 1000);
      };

      if (!window.instructionsShowing) {
        this.sceneMsgShow();
      }
    }

    if (portalLayerName) {
      const portalObj = this.map.getObjectLayer(portalLayerName)["objects"][0];
      const img = levelsMap[name].portalImage;
      const portal = new Portal({
        scene: this,
        x: img ? portalObj.x - portalObj.width : portalObj.x,
        y: portalObj.y + portalObj.height / 2,
        img: img || "Portal",
      });
      this.portals.add(portal);
      this.physics.add.existing(portal, true);
      this.physics.add.overlap(this.player, portal, () => {
        if (levelsMap[name].portalSide === "right" && this.player.x < portal.x)
          return;
        if (
          levelsMap[name].portalSide === "left" &&
          this.player.x > portal.x + 16
        )
          return;
        portal.destroy();

        if (levelsMap[name].onPortal) {
          levelsMap[name].onPortal(this);
        }

        this.loadLevel(levelsMap[name].nextLevel);
      });
    }

    this.bulbs.clear(true, true);
    if (coinsLayerName) {
      const coinsLayer = this.map.getObjectLayer(coinsLayerName)["objects"];
      coinsLayer.forEach((lightbulbObj) => {
        const { x, y } = lightbulbObj;
        this.bulbs.add(new Lightbulb({ scene: this, x, y }));
      });
    }

    this.monsters.clear(true, true);
    if (monstersLayerName) {
      const monstersObjectLayer =
        this.map.getObjectLayer(monstersLayerName)["objects"];
      monstersObjectLayer.forEach((monsterObj) => {
        const { x, y } = monsterObj;
        const newMonster = new Monster({ scene: this, x, y });
        this.monsters.add(newMonster);
      });
    }
  }

  update(time) {
    // this.scoreText.setText(`SCORE: ${this.currentScore}`);

    const canvasElement = document.querySelector("canvas");

    if (this.mirrored && this.wasd.A.isDown) {
      this.map.addTilesetImage("groundset", "tiles");
      this.mirrored = false;
      this.baseRunVel = 200;
    }

    this.flakes.forEach((flake) => {
      flake.update(time, this.player.body.velocity.x);
    });

    if (this.player.x >= 1792) {
      canvasElement.classList.remove("flippy");
      this.canvasLeft = Math.min(
        0,
        -50.25 * ((1792 - this.player.x) / (1792 - 2032)),
      );

      if (this.mirrored) {
        this.canvasLeft =
          -100.25 + Math.max(0, 50 * ((1792 - this.player.x) / (1792 - 2032)));
      }
    } else if (this.player.x <= 240 + this.player.width / 2) {
      const playerEdge = this.player.x - this.player.width / 2;
      canvasElement.classList.add("flippy");
      this.canvasLeft = 50.25 * ((240 - playerEdge) / 240);

      if (this.mirrored) {
        this.canvasLeft = 100.25 - Math.max(0, 50 * ((240 - playerEdge) / 240));
      }
    } else {
      canvasElement.classList.remove("flippy");
      this.canvasLeft = this.mirrored ? -100.25 : 0;
    }

    canvasElement.style.left = `${this.canvasLeft}%`;

    if (this.overlapFinalDoor) {
      this.doorMsg.show();
    } else {
      this.doorMsg.hide();
    }

    this.overlapFinalDoor = false;

    if (window.instructionsShowing) {
      this.instructionsMsg.show();

      if (this.cursors.space.isDown) {
        this.spaceDown = true;
      }

      if (this.spaceDown == true && this.cursors.space.isUp) {
        this.spaceDown = false;
        window.instructionsShowing = false;
        this.instructionsMsg.hide();
        this.sceneMsgShow && this.sceneMsgShow();
      }

      return;
    }

    const runVelocity =
      this.baseRunVel *
      (this.cursors.shift.isDown ? 4 : 1) *
      this.tmpSpeedBoost;
    const jumpVelocity =
      this.baseJumpVel * (this.cursors.shift.isDown ? 1.5 : 1);

    let animToPlay;

    // update monsters
    this.monsters.children.iterate((monster) => {
      monster.update();
    });

    const bodyOnFloor = this.player.body.onFloor();

    if (this.movingOn) {
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.flipX = !this.mirrored;
      this.player.setVelocityX(this.mirrored ? runVelocity : runVelocity * -1);
      animToPlay = "left";
    } else if (this.cursors.right.isDown) {
      this.player.flipX = this.mirrored;
      this.player.setVelocityX(this.mirrored ? runVelocity * -1 : runVelocity);
      animToPlay = "right";
    } else {
      this.player.setVelocityX(0);
      animToPlay = "turn";
    }

    animToPlay = bodyOnFloor ? animToPlay : "jump";
    this.player.anims.play(animToPlay, true);

    if (
      this.cursors.space.isDown &&
      bodyOnFloor &&
      this.player.body.velocity.y === 0
    ) {
      this.player.setVelocityY(jumpVelocity);
    } else if (bodyOnFloor && this.player.body.velocity.y === 0) {
      this.tmpSpeedBoost = 1;
    }
  }
}
