import * as THREE from "three";
import * as TWEEN from "../../libs/tween.esm.js";
import { SpaceTube } from "./objects/SpaceTube.js";
import { SpaceShip } from "./objects/SpaceShip.js";
import { Shield } from "./objects/Shield.js";
import { Asteroid } from "./objects/Asteroid.js";
import { UFO } from "./objects/UFO.js";
import { ElectricFence } from "./objects/ElectricFence.js";
import { Robot } from "./objects/Robot.js";
import { CameraManager } from "./managers/CameraManager.js";
import { GameObjectManager } from "./managers/GameObjectManager.js";
import { ProjectileManager } from "./managers/ProjectileManager.js";
import { CollisionManager } from "./managers/CollisionManager.js";
import { InputManager } from "./managers/InputManager.js";
import { AnimationManager } from "./managers/AnimationManager.js";
import { RenderManager } from "./managers/RenderManager.js";
import { UIManager } from "./managers/UIManager.js";
import { config } from "./config/config.js";

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.uiManager = new UIManager(); // Asegúrate de que el UIManager se crea aquí

    this.initScene(myCanvas);

    this.objectManager = new GameObjectManager(this, this.tube.getGeometry());
    this.projectileManager = new ProjectileManager(this);
    this.collisionManager = new CollisionManager(this);
    this.animationManager = new AnimationManager(this);
    this.inputManager = new InputManager();
    this.renderManager = new RenderManager(
      this,
      this.renderer,
      this.cameraManager
    );

    this.addGameObjects();
    this.bindMethods();

    this.addSpaceBackground();

    this.gameStarted = false;
    this.uiManager.hideLoadingScreen();

    this.backgroundMusic = new Audio(config.sounds.backgroundMusic);
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
  }

  initScene(myCanvas) {
    this.travelTime = config.spaceship.travelTime;
    this.velocity = 0;
    this.t = 0;
    this.score = 0;
    this.clock = new THREE.Clock();
    this.ufoClock = new THREE.Clock();
    this.proyectileClock = new THREE.Clock();
    this.objects = [];
    this.ufos = [];

    this.renderer = this.createRenderer(myCanvas);
    this.createLights();
    this.spaceShipPosition = new THREE.Vector3();
    this.tube = new SpaceTube();
    this.spaceShip = new SpaceShip(this.tube.getGeometry(), this.uiManager); // Pasar uiManager aquí
    this.spaceShip.boundingBox = new THREE.Box3().setFromObject(this.spaceShip);
    this.cameraManager = new CameraManager(
      this,
      this.renderer,
      this.spaceShip.chaseCamera
    );
    this.add(this.tube.getMesh());
    this.add(this.spaceShip);
  }

  createRenderer(myCanvas) {
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(config.scene.backgroundColor));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    $(myCanvas).append(renderer.domElement);
    return renderer;
  }

  createLights() {
    const ambientLight = new THREE.AmbientLight(config.lights.ambient.color, config.lights.ambient.intensity);
    const directionalLightConfig = config.lights.directional;
    const directionalLight = new THREE.DirectionalLight(directionalLightConfig.color, directionalLightConfig.intensity);
    directionalLight.position.set(directionalLightConfig.position.x, directionalLightConfig.position.y, directionalLightConfig.position.z);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = directionalLightConfig.shadow.mapSize.width;
    directionalLight.shadow.mapSize.height = directionalLightConfig.shadow.mapSize.height;
    directionalLight.shadow.camera.near = directionalLightConfig.shadow.camera.near;
    directionalLight.shadow.camera.far = directionalLightConfig.shadow.camera.far;
    directionalLight.shadow.camera.left = directionalLightConfig.shadow.camera.left;
    directionalLight.shadow.camera.right = directionalLightConfig.shadow.camera.right;
    directionalLight.shadow.camera.top = directionalLightConfig.shadow.camera.top;
    directionalLight.shadow.camera.bottom = directionalLightConfig.shadow.camera.bottom;

    const hemiLightConfig = config.lights.hemisphere;
    const hemiLight = new THREE.HemisphereLight(hemiLightConfig.color, hemiLightConfig.groundColor, hemiLightConfig.intensity);
    hemiLight.position.set(hemiLightConfig.position.x, hemiLightConfig.position.y, hemiLightConfig.position.z);

    this.add(ambientLight);
    this.add(directionalLight);
    this.add(hemiLight);
  }

  addSpaceBackground() {
    const loader = new THREE.TextureLoader();
    loader.load(config.scene.backgroundImagePath, (texture) => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(this.renderer, texture);
      this.background = rt.texture;
    });
  }

  bindMethods() {
    this.resetRobot = this.resetRobot.bind(this);
    this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
    this.onWindowResize = this.onWindowResize.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  addGameObjects() {
    const aliensConfig = config.gameObjects.aliens;
    this.objectManager.addAliens(aliensConfig.gold, aliensConfig.silver, aliensConfig.bronze);
    this.objectManager.addGameObjects(Robot, config.gameObjects.robots);
    this.objectManager.addGameObjects(UFO, config.gameObjects.ufos, this.ufos);
    this.objectManager.addGameObjects(ElectricFence, config.gameObjects.electricFences);
    this.objectManager.addGameObjects(Asteroid, config.gameObjects.asteroids);
    this.objectManager.addGameObjects(Shield, config.gameObjects.shields);
  }

  onKeyDown(event) {
    if (event.key === "c") {
      this.cameraManager.switchCamera();
    }
  }

  renderOnce() {
    this.renderManager.render();
  }

  update() {
    const delta = this.clock.getDelta();
    const ufoDelta = this.ufoClock.getDelta();
    const proyectileDelta = this.proyectileClock.getDelta();

    if (this.gameStarted) {
      this.t += this.velocity * delta;
    }

    if (this.t > 1) {
      this.t -= 1;
      this.velocity *= 1.1;
      this.resetCollisionFlags();
      this.objects
        .filter((object) => object instanceof Robot)
        .forEach((robot) => (robot.hasFired = false));
    }
    this.spaceShip.update(this.t, delta);
    this.spaceShip.boundingBox.setFromObject(this.spaceShip);

    this.projectileManager.updateProjectiles(proyectileDelta);
    TWEEN.update();
    this.checkForNearbyRobots();
    this.collisionManager.checkCollisions();

    this.ufos.forEach((ufo) => ufo.update(ufoDelta));

    this.renderManager.render();

    if (this.spaceShip && this.spaceShip.inputManager) {
      this.spaceShip.inputManager.resetJustPressed();
    }

    requestAnimationFrame(() => this.update());
  }

  startGame() {
    this.gameStarted = true;
    this.velocity = 0;
    this.uiManager.startCountdown(() => {
      this.velocity = 1 / this.travelTime;  // Iniciar el movimiento de la nave
      this.playBackgroundMusic();
    });
  }

  playBackgroundMusic() {
    this.backgroundMusic.play();
  }

  startCountdown() {
    const countdownElement = document.getElementById("countdown");
    const countdownContainer = document.getElementById("countdown-container");
    let countdown = 3;

    const showCountdown = () => {
      const countdownInterval = setInterval(() => {
        countdownContainer.style.display = "block";
        if (countdown > 0) {
          countdownElement.textContent = countdown;
          countdown--;
          this.playBeepSound();
        } else {
          countdownElement.textContent = "GO!";
          this.playBeepSound();
          this.velocity = 1 / this.travelTime;  // Iniciar el movimiento de la nave
          clearInterval(countdownInterval);
          setTimeout(() => {
            countdownContainer.style.display = "none";
          }, 1000);
        }
      }, 1000);
    };

    setTimeout(showCountdown, 300); // Pequeño retraso para asegurar que el contenedor esté listo
  }

  playBeepSound() {
    const beepSound = new Audio(config.sounds.beep);
    beepSound.play();
  }

  resetCollisionFlags() {
    this.objects.forEach((object) => {
      object.collided = false;
    });
  }

  onWindowResize() {
    this.cameraManager.update();
  }

  onDocumentMouseDown(event) {
    event.preventDefault();

    if (!this.cameraManager) return;

    if (this.spaceShip.isDisabled) {
      return; // Si la nave está deshabilitada, no permitir interacción con los UFOs
    }

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(mouse, this.cameraManager.getCurrentCamera());

    var intersects = raycaster.intersectObjects(this.ufos, true);

    if (intersects.length > 0 && intersects[0].object.userData) {
      let selectedUFO = intersects[0].object;
      let realPosition = selectedUFO.userData.positionOnTube.position.clone();
      let distance = realPosition.distanceTo(this.spaceShip.getFrontPosition());

      if (distance <= 50) {
        this.handleUFOHit(selectedUFO, realPosition);
      }
    }
  }

  handleUFOHit(selectedUFO, realPosition) {
    this.animationManager.startBlinking(selectedUFO);
    const shipFrontPosition = this.spaceShip.getFrontPosition();
    const projectile = this.projectileManager.createProjectile(
      shipFrontPosition,
      0x0000ff
    );
    this.projectileManager.addProjectile(projectile, realPosition, 10);
    
    this.score += 50;
    this.updateScore();
    
    this.showMessage(this.getRandomMessage());
  }

  getRandomMessage() {
    const messages = ["NICE HIT", "GOOD JOB", "EXCELLENT", "WELL DONE"];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  showMessage(message, color = "#00FF00", duration = 2000) {
    this.uiManager.showMessage(message, color, duration);
  }

  checkForNearbyRobots() {
    const detectionRange = 20;

    this.objects
      .filter((object) => object instanceof Robot)
      .forEach((robot) => {
        const robotPosition = robot.positionOnTube.position;
        const shipPosition = this.spaceShip.positionOnTube.position;

        if (
          robotPosition &&
          shipPosition &&
          robotPosition.distanceTo(shipPosition) < detectionRange &&
          !robot.hasFired
        ) {
          robot.hasFired = true;
          this.triggerRobotAttack(robot);
        }
      });
  }

  triggerRobotAttack(robot) {
    const robotPos = robot.position.clone();
    const shipPos = this.spaceShip.positionOnTube.position.clone();

    const directionToShip = shipPos.sub(robotPos).normalize();
    const targetAngle = Math.atan2(directionToShip.x, directionToShip.z);

    robot.animateBodyRotation(targetAngle, 400);
    robot.animateArmLift(true, 400);

    setTimeout(() => {
      this.fireProjectileFromRobot(robot);
    }, 400);
  }

  fireProjectileFromRobot(robot) {
    const cannonWorldPosition = new THREE.Vector3();
    robot.arm.getWorldPosition(cannonWorldPosition);
    const projectile = this.projectileManager.createProjectile(
      cannonWorldPosition,
      0xff0000
    );
    const shipPos = this.spaceShip.positionOnTube.position.clone();
    const direction = new THREE.Vector3()
      .subVectors(shipPos, cannonWorldPosition)
      .normalize();
    const speed = 30;
    this.projectileManager.addRobotProjectile(
      projectile,
      direction.multiplyScalar(speed)
    );

    setTimeout(() => {
      this.resetRobot(robot, 1000);
      robot.hasFired = false;
    }, 3000);
  }

  resetRobot(robot, duration) {
    robot.resetRobot(duration);
  }

  updateScore() {
    this.uiManager.updateScore(this.score);
  }

  handleSpaceShipHit() {
    this.playBeepWarningSound();

    this.showMessage("WARNING", "#FF0000", 2000);

    this.spaceShip.blinkWithColor(0xff0000, 2000);
  }

  playBeepWarningSound() {
    const beepWarningSound = new Audio(config.sounds.beepWarning);
    beepWarningSound.play();
    beepWarningSound.loop = true;

    setTimeout(() => {
      beepWarningSound.pause();
      beepWarningSound.currentTime = 0;
    }, 2000);
  }
}

$(function () {
  const scene = new MyScene("#WebGL-output");

  scene.uiManager.showLoadingScreen();  // Mostrar pantalla de carga al inicio

  $('#start-button').click(() => {
    $('#start-screen').hide();
    scene.uiManager.showStartingGameScreen();
    $('#game-container').show();

    setTimeout(() => {
      scene.update();
      scene.startGame();
      scene.uiManager.hideStartingGameScreen();
    }, 2000);
  });

  window.addEventListener("resize", () => scene.onWindowResize());
  window.addEventListener("keydown", (event) => scene.onKeyDown(event));
  document.addEventListener("mousedown", (event) =>
    scene.onDocumentMouseDown(event)
  );

  setTimeout(() => {
    scene.uiManager.hideLoadingScreen();
  }, 5000);
});
