function getHighScorerMessage() {
  const highScoresString = localStorage.getItem("highScores");
  let highScores = [];
  if (highScoresString) {
    highScores = JSON.parse(highScoresString);
  } else {
    return "";
  }
  
  if (highScores.length === 0) {
    return "";
  }

  highScores.sort((a, b) => b.score - a.score);
  const topScore = highScores[0].score;
  const topScorers = highScores.filter(score => score.score === topScore);
  const names = topScorers.map(scorer => scorer.initials).join(", ");
  return `high score: ${topScore} (${names})`;
}

export default class TitleSplash extends Phaser.Scene {
  constructor() {
    super("TitleSplash");
  }

  preload() {
    this.load.image('hyland', 'public/assets/hylandpixellogo.png');
    this.load.image('mcc', 'public/assets/mcc logo pixel.png');

    this.load.bitmapFont("pixelfont", "public/assets/fonts/pixelfont.png", "public/assets/fonts/pixelfont.xml");
    this.load.bitmapFont("pixelfontyellow", "public/assets/fonts/pixelfontyellow.png", "public/assets/fonts/pixelfont.xml");
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;
    window.tryingAgain = false;

    const startMsg = `PRESS ${window.CONTROLLER ? "START" : "SPACE"}`;

    const pressStartText = this.add.bitmapText(width * .5, height * .75, 'pixelfontyellow', startMsg, 48).setOrigin(0.5);

    const highScorerMsg = getHighScorerMessage();
    const highScoreText = this.add.bitmapText(width * .5, height * .85, 'pixelfont', highScorerMsg, 24).setOrigin(0.5);

    const blinkEvent = this.time.addEvent({
      delay: 500,
      loop: true,
      callback: () => {
        pressStartText.text = pressStartText.text === "" ? startMsg : "";
      }
    });

    this.movingOn = false;

    this.input.keyboard.on('keydown', (e) => {
      if (!window.CONTROLLER && e.keyCode != Phaser.Input.Keyboard.KeyCodes.SPACE) {
        return;
      }

      if (window.CONTROLLER && e.keyCode != Phaser.Input.Keyboard.KeyCodes.ENTER) {
        return;
      }

      if (this.movingOn) return;
      this.movingOn = true;
      blinkEvent.remove();
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start("NeighborhoodScene");
      });
    }, this);

    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
