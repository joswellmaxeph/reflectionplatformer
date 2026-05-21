import MainMenu from "./scenes/MainMenu.js";
import MainScene from "./scenes/MainScene.js"
import TitleScreen from "./scenes/TitleScreen.js";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 386,
  pixelArt: true,
  antiAlias: false,
  scene: [MainMenu, TitleScreen],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);
