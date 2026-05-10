async function getHighScores() {
  try {
    const response = await fetch('/high-scores');
    const json = await response.json();
    return json;
  } catch (error) {
    alert(error);
  }
}

const saveNewHighScore = async (newScore) => {
  try {
    const response = await fetch('/high-scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newScore)
    });
    const json = await response.json();
  } catch (error) {
    alert(error);
  }
}

const getSortedHighScoresWithNew = async (newScore) => {
  const highScores = await getHighScores();
  highScores.push({ ...newScore, current: true });
  highScores.sort((a, b) => a.score === b.score ? a.current ? -1 : 1 : b.score - a.score);
  return highScores;
}

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
  }
  
  init (data) {
    this.win = data.win;
    this.finalScore = data.currentScore || 0;
    this.lossReason = data.lossReason;
    this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }

  async create() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.initialsTextInScores = false;
    this.movingOn = false;
    this.doneLoading = false;
    this.initials = ["A", "A", "A"];
    const highScores = await getSortedHighScoresWithNew({ score: this.finalScore, initials: this.initials.join("") });
    const saveMsg =  `Enter your initials and press ${window.CONTROLLER ? "START" : "SPACE"} to save your score.`

    const bannerText = this.add.bitmapText(width * .5, height * .1, 'pixelfont', "YOU WON!", 20).setOrigin(0.5);
    const subtitleText = this.add.bitmapText(width * .5, height * .15, 'pixelfont', `final score: ${this.finalScore}`, 15).setOrigin(0.5);
    const instructionsText = this.add.bitmapText(width * .5, height * (this.win ? .2 : .25), 'pixelfont', saveMsg, 10).setOrigin(0.5);

    this.start = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.start.on('down', () => {
      if (!window.CONTROLLER && this.win) {
        return;
      }

      if (this.movingOn) return;
      this.movingOn = true;

      if (this.win) {
        saveNewHighScore({ score: this.finalScore, initials: this.initials.join("") });
      }

      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start("TitleSplash");
      });
    });

    this.spaceA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    if (!this.win) {
      bannerText.setText("GAME OVER");
      subtitleText.setText(this.lossReason);
      instructionsText.setText(`Press ${window.CONTROLLER ? "START" : "ENTER"} to return to the title screen.`);
      
      const instructionsText2 = this.add.bitmapText(width * .5, height * .3, 'pixelfont', saveMsg, 10).setOrigin(0.5);
      instructionsText2.setText(`Press ${window.CONTROLLER ? "A" : "SPACE"} to try again.`);
      this.cameras.main.fadeIn(500, 0, 0, 0);

      this.spaceA.on('down', () => {
        if (this.movingOn) return;
        this.movingOn = true;
  
        window.tryingAgain = true;
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start("NeighborhoodScene");
        });
      });
      return;
    }

    this.selectedInitial = 0;

    const numToDisplay = Math.min(5, highScores.length);
    
    const highScoresTitleText = this.add.bitmapText(width * .5, height * .5, 'pixelfont', `HIGH SCORES`, 15).setOrigin(0.5);

    for (let i = 0; i < numToDisplay; i++) {
      const x = width / 2;
      const y = height * .59 + (i * 30);
      const iScore = highScores[i];

      if (iScore.current) {
        this.add.bitmapText(x+100, y, 'pixelfontyellow', `${iScore.score}`, 25).setOrigin(1, .5).setScrollFactor(0, 0);
        this.initialsTextInScores = this.add.bitmapText(x-100, y, 'pixelfontyellow', `${iScore.initials}`, 25).setOrigin(0, .5).setScrollFactor(0, 0);
      } else {
        this.add.bitmapText(x+100, y, 'pixelfont', `${iScore.score}`, 25).setOrigin(1, .5).setScrollFactor(0, 0);
        this.add.bitmapText(x-100, y, 'pixelfont', `${iScore.initials}`, 25).setOrigin(0, .5).setScrollFactor(0, 0);
      }

      // if (iScore.current) {
      //   this.currentScoreText = this.add.bitmapText(x, y, 'pixelfontyellow', `${iScore.initials}     ${iScore.score}`, 20).setOrigin(.5, .5).setScrollFactor(0, 0);
      // } else {
      //   this.add.bitmapText(x, y, 'pixelfont', `${iScore.initials}     ${iScore.score}`, 20).setOrigin(.5, .5).setScrollFactor(0, 0);
      // }
    }

    this.initialBoxes = this.physics.add.group({immovable: true, allowGravity: false});

    this.initFontSize = 40;

    this.selectorBox = this.add.rectangle((width / 2) - this.initFontSize-4, height * .345, this.initFontSize, this.initFontSize, 0xFFFFFF).setOrigin(.5, .5).setScrollFactor(0, 0);

    this.upTriangle = this.add.triangle((width / 2) - this.initFontSize-4, height * .29, 0, 0, 14, 0, 7, -7, 0xFFFFFF).setOrigin(.5, .5);
    this.downTriangle = this.add.triangle((width / 2) - this.initFontSize-4, height * .42, 0, 0, 14, 0, 7, 7, 0xFFFFFF).setOrigin(.5, .5);

    this.initialTexts = [];

    for (let i = 0; i < this.initials.length; i++) {
      const x = (width / 2) + (i * this.initFontSize) - this.initFontSize;
      const y = height * .37;

      this.add.rectangle(x-4, height * .345, this.initFontSize-4, this.initFontSize-4, 0x000000).setOrigin(.5, .5).setScrollFactor(0, 0);
      this.initialTexts.push(this.add.bitmapText(x, y, 'pixelfont', this.initials[i], 40).setOrigin(.5, .5).setScrollFactor(0, 0));
    }

    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.spaceBar.on('down', () => {
      if (this.movingOn || window.CONTROLLER) return;
      this.movingOn = true;
      if (this.win) {
        saveNewHighScore({ score: this.finalScore, initials: this.initials.join("") });
      }

      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start("TitleSplash");
      });
    })

    this.leftKey.on('down', () => {
      if (!this.movingOn && this.selectedInitial > 0) {
        this.selectedInitial--;
      }
    });

    this.rightKey.on('down', () => {
      if (!this.movingOn && this.selectedInitial < this.initials.length - 1) {
        this.selectedInitial++;
      }
    });

    this.upKey.on('down', () => {
      if (!this.movingOn) {
        this.initials[this.selectedInitial] = this.alphabet[(this.alphabet.indexOf(this.initials[this.selectedInitial]) + 25) % 26];
      }
    });

    this.downKey.on('down', () => {
      if (!this.movingOn) {
        this.initials[this.selectedInitial] = this.alphabet[(this.alphabet.indexOf(this.initials[this.selectedInitial]) + 1) % 26];
      }
    });

    this.cameras.main.fadeIn(500, 0, 0, 0);
    this.doneLoading = true;

  }

  update() {
    if (!this.win || !this.doneLoading) return;

    const width = this.scale.width;
    this.selectorBox.x = -4 + (width / 2) + ((this.selectedInitial) * this.initFontSize) - this.initFontSize;
    this.upTriangle.x = -4 + (width / 2) + ((this.selectedInitial) * this.initFontSize) - this.initFontSize;
    this.downTriangle.x = -4 + (width / 2) + ((this.selectedInitial) * this.initFontSize) - this.initFontSize;
    for (let i = 0; i < this.initialTexts.length; i++) {
      this.initialTexts[i].text = this.initials[i];
    }

    if (this.initialsTextInScores) {
      this.initialsTextInScores.text = this.initials.join("");
    }
  }
}
