const config = {
  scene: {
    backgroundColor: 0x4c4c4c,
    backgroundImagePath: "../assets/spacial-background.jpg"
  },
  camera: {
    fov: 75,
    near: 0.1,
    far: 1050,
    position: { x: 0, y: 70, z: 90 }
  },
  lights: {
    ambient: { color: 0xccddee, intensity: 0.35 },
    directional: {
      color: 0xffffff,
      intensity: 2,
      position: { x: -100, y: 100, z: 100 },
      shadow: {
        mapSize: { width: 2048, height: 2048 },
        camera: { near: 0.1, far: 50, left: -50, right: 50, top: 50, bottom: -50 }
      }
    },
    hemisphere: {
      color: 0xffffff,
      groundColor: 0x707070,
      intensity: 0.5,
      position: { x: 0, y: 50, z: 0 }
    }
  },
  spaceship: {
    travelTime: 40,
    blinkInterval: 100,
    models: {
      materialPath: "../models/D5SpaceShip/d5class.mtl",
      objectPath: "../models/D5SpaceShip/d5class.obj",
      scale: { x: 0.2, y: 0.2, z: 0.2 },
      rotation: { y: Math.PI },
      translation: { y: 2.5 }
    },
    sounds: {
      alert: '../../sounds/alert.mp3',
      invulnerable: '../../sounds/shields-down.mp3'
    }
  },
  gameObjects: {
    aliens: {
      gold: 5,
      silver: 8,
      bronze: 12,
      materials: {
        gold: { color: 0xFFD700, metalness: 0.7, roughness: 0.7 },
        silver: { color: 0xC0C0C0, metalness: 0.7, roughness: 0.7 },
        bronze: { color: 0xCD7F32, metalness: 0.7, roughness: 0.7 }
      },
      points: {
        gold: 100,
        silver: 50,
        bronze: 20
      }
    },
    robots: 7,
    ufos: 15,
    electricFences: 12,
    asteroids: 12,
    shields: 7
  },
  sounds: {
    backgroundMusic: '../sounds/background-music.mp3',
    beep: '../sounds/beep.mp3',
    beepWarning: '../sounds/beep-warning.mp3',
    alienPickup: '../../sounds/alien-pickup.mp3',
    goldAlien: '../../sounds/gold-alien.mp3',
    rockDestroy: '../../sounds/rock-destroy.mp3',
    hover: '../sounds/hover.mp3',
    clickButton: '../sounds/click-button.mp3'
  },
  ui: {
    loadingScreenId: "loading-screen",
    countdownElementId: "countdown",
    countdownContainerId: "countdown-container",
    messageElementId: "message",
    messageContainerId: "message-container",
    scoreElementId: "score",
    startingGameScreenId: "starting-game-screen",
    startScreenId: "start-screen",
    gameContainerId: "game-container",
    startButtonId: "start-button",
    instructionsButtonId: "instructions-button"
  }
};

export { config };
