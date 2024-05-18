import * as THREE from "three";
import * as TWEEN from "../../libs/tween.esm.js";
import { SpaceTube } from "./objects/SpaceTube.js";
import { SpaceShip } from "./objects/SpaceShip.js";
import { Alien } from "./objects/Alien.js";
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
import { config } from "./config/config.js";

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.initScene(myCanvas);

    this.objectManager = new GameObjectManager(this, this.tube.getGeometry());
    this.projectileManager = new ProjectileManager(this);
    this.collisionManager = new CollisionManager(this);
    this.animationManager = new AnimationManager(this);
    this.inputManager = new InputManager();
    this.renderManager = new RenderManager(this, this.renderer, this.cameraManager);

    this.addGameObjects();
    this.bindMethods();

    this.addSpaceBackground();
  }

  initScene(myCanvas) {
    // Configuración inicial de la escena
    this.travelTime = config.spaceship.travelTime;
    this.velocity = 1 / this.travelTime;
    this.t = 0;
    this.score = 0;
    this.clock = new THREE.Clock();
    this.ufoClock = new THREE.Clock();
    this.proyectileClock = new THREE.Clock();
    this.objects = [];
    this.ufos = [];

    // Renderizador y luces
    this.renderer = this.createRenderer(myCanvas);
    this.createLights();
    this.add(this.axis);
    this.spaceShipPosition = new THREE.Vector3();
    this.tube = new SpaceTube();
    this.spaceShip = new SpaceShip(this.tube.getGeometry());
    this.spaceShip.boundingBox = new THREE.Box3().setFromObject(this.spaceShip);
    this.cameraManager = new CameraManager(this, this.renderer, this.spaceShip.chaseCamera);
    this.add(this.tube.getMesh());
    this.add(this.spaceShip);
  }

  createRenderer(myCanvas) {
    let renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(new THREE.Color(config.scene.backgroundColor));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Mejor calidad de sombras
    $(myCanvas).append(renderer.domElement);
    return renderer;
  }

  createLights() {
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    // this.add(ambientLight);

    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(-100, 100, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // Tamaño de mapa de sombras
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    //this.add(directionalLight);

    // Luz hemisférica
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    // this.add(hemiLight);
  }

  addSpaceBackground() {
    const loader = new THREE.TextureLoader();
    loader.load('../assets/spacial-background.jpg', (texture) => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(this.renderer, texture);
      this.background = rt.texture;
    });
  }

  bindMethods() {
    this.resetRobot = this.resetRobot.bind(this);
  }

  addGameObjects() {
    this.objectManager.addAliens(5, 15, 30); // 5 oro, 15 plata, 30 bronce
    this.objectManager.addGameObjects(Robot, 7);
    this.objectManager.addGameObjects(UFO, 5, this.ufos);
    this.objectManager.addGameObjects(ElectricFence, 5);
    this.objectManager.addGameObjects(Asteroid, 10);
    this.objectManager.addGameObjects(Shield, 5);
  }

  onKeyDown(event) {
    if (event.key === "c") {
      this.cameraManager.switchCamera();
    }
  }

  update() {
    const delta = this.clock.getDelta();
    const ufoDelta = this.ufoClock.getDelta();
    const proyectileDelta = this.proyectileClock.getDelta();

    this.t += this.velocity * delta;
    if (this.t > 1) {
      this.t -= 1;
      this.velocity *= 1.1;
      this.resetCollisionFlags();
      this.objects.filter((object) => object instanceof Robot).forEach((robot) => robot.hasFired = false);
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
    const projectile = this.projectileManager.createProjectile(shipFrontPosition);
    this.projectileManager.addProjectile(projectile, realPosition, 10);
    this.score += 50;
    this.showMessage("UFO HIT");
  }

  checkForNearbyRobots() {
    const detectionRange = 20;

    this.objects
      .filter(object => object instanceof Robot)
      .forEach(robot => {
        const robotPosition = robot.positionOnTube.position;
        const shipPosition = this.spaceShip.positionOnTube.position;

        if (robotPosition && shipPosition && robotPosition.distanceTo(shipPosition) < detectionRange && !robot.hasFired) {
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
    const projectile = this.projectileManager.createProjectile(cannonWorldPosition);
    const shipPos = this.spaceShip.positionOnTube.position.clone();
    const direction = new THREE.Vector3().subVectors(shipPos, cannonWorldPosition).normalize();
    const speed = 30;
    this.projectileManager.addRobotProjectile(projectile, direction.multiplyScalar(speed));

    setTimeout(() => {
      this.resetRobot(robot, 1000);
      robot.hasFired = false;
    }, 3000);
  }

  resetRobot(robot, duration) {
    robot.resetRobot(duration);
  }

  updateScore() {
    document.getElementById("score").textContent = this.score;
  }

  showMessage(message) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;

    setTimeout(() => {
      messageElement.textContent = "";
    }, 2000);
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");

  window.addEventListener("resize", () => scene.onWindowResize());
  window.addEventListener("keydown", (event) => scene.onKeyDown(event));
  document.addEventListener("mousedown", (event) => scene.onDocumentMouseDown(event));

  scene.update();
});