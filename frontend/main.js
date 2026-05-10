import TitleSplash from "./scenes/TitleSplash.js";
import NeighborhoodScene from "./scenes/NeighborhoodScene.js"
import CharacterSelect from "./scenes/CharacterSelect.js";
import MccInteriorScene from "./scenes/MccInteriorScene.js";
import Preloader from "./scenes/Preloader.js";
import GameOverScene from "./scenes/GameOverScene.js";

const config = {
  type: Phaser.AUTO,
  width: 512,
  height: 386,
  pixelArt: true,
  antiAlias: false,
  scene: [Preloader, NeighborhoodScene, TitleSplash, CharacterSelect, MccInteriorScene, GameOverScene],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
    },
  },
};

const game = new Phaser.Game(config);
