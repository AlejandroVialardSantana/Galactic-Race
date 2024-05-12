import * as THREE from "three";
import { TrackballControls } from "../libs/TrackballControls.js";
import { GUI } from "../libs/dat.gui.module.js";

import { SpaceTube } from "./objects/SpaceTube.js";
import { SpaceShip } from "./objects/SpaceShip.js";
import { Alien } from "./objects/Alien.js";
import { Shield } from "./objects/Shield.js";
import { Asteroid } from "./objects/Asteroid.js";
import { UFO } from "./objects/UFO.js";
import { ElectricFence } from "./objects/ElectricFence.js";
import { Robot } from "./objects/Robot.js";
import { CameraManager } from "./cameras/CameraManager.js";

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.travelTime = 40;
    this.velocity = 1 / this.travelTime;
    this.t = 0;
    this.score = 0;

    this.clock = new THREE.Clock();
    this.ufoClock = new THREE.Clock();
    this.proyectileClock = new THREE.Clock();

    this.objects = [];
    this.ufos = [];
    this.projectiles = [];

    this.renderer = this.createRenderer(myCanvas);

    this.createLights();

    this.axis = new THREE.AxesHelper(6);
    this.add(this.axis);

    this.spaceShipPosition = new THREE.Vector3();

    this.tube = new SpaceTube();
    this.spaceShip = new SpaceShip(this.tube.getGeometry());
    this.spaceShip.boundingBox = new THREE.Box3().setFromObject(this.spaceShip);

    this.cameraManager = new CameraManager(
      this,
      this.renderer,
      this.spaceShip.chaseCamera
    );

    this.cameraHelper = new THREE.CameraHelper(this.spaceShip.chaseCamera);

    this.add(this.cameraHelper);
    this.addAliens(20);
    this.addRobots(7);
    this.addUFOs(5);
    this.addElectricFences(5);
    this.addAsteroids(5);
    this.addShields(5);

    this.add(this.tube.getMesh());
    this.add(this.spaceShip);
  }

  addAliens(numAliens) {
    for (let i = 0; i < numAliens; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const alien = new Alien(this.tube.getGeometry(), t, angularOffset);
      alien.boundingBox = new THREE.Box3().setFromObject(alien);
      this.objects.push(alien);
      this.add(alien);
      this.showBoundingBox(alien);
    }
  }

  addRobots(numRobots) {
    for (let i = 0; i < numRobots; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const robot = new Robot(this.tube.getGeometry(), t, angularOffset);
      robot.boundingBox = new THREE.Box3().setFromObject(robot);
      this.objects.push(robot);
      this.add(robot);
      this.showBoundingBox(robot);
    }
  }

  addUFOs(numUFOs) {
    for (let i = 0; i < numUFOs; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const ufo = new UFO(this.tube.getGeometry(), t, angularOffset);
      this.ufos.push(ufo);
      ufo.boundingBox = new THREE.Box3().setFromObject(ufo);
      this.objects.push(ufo);
      this.add(ufo);
      this.showBoundingBox(ufo);
    }
  }

  addElectricFences(numFences) {
    for (let i = 0; i < numFences; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const fence = new ElectricFence(
        this.tube.getGeometry(),
        t,
        angularOffset
      );
      fence.boundingBox = new THREE.Box3().setFromObject(fence);
      this.objects.push(fence);
      this.add(fence);
      this.showBoundingBox(fence);
    }
  }

  addAsteroids(numAsteroids) {
    for (let i = 0; i < numAsteroids; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const asteroid = new Asteroid(this.tube.getGeometry(), t, angularOffset);
      asteroid.boundingBox = new THREE.Box3().setFromObject(asteroid);
      this.objects.push(asteroid);
      this.add(asteroid);
      this.showBoundingBox(asteroid); // Asegúrate que se llama esto correctamente
    }
  }

  addShields(numShields) {
    for (let i = 0; i < numShields; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const shield = new Shield(this.tube.getGeometry(), t, angularOffset);
      shield.boundingBox = new THREE.Box3().setFromObject(shield);
      this.objects.push(shield);
      this.add(shield);
      this.showBoundingBox(shield);
    }
  }

  createRenderer(myCanvas) {
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x4c4c4c));
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;
  }

  createLights() {
    var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
    this.add(ambientLight);

    var pointLight = new THREE.PointLight(0xffffff, 0.3, 0, 0);
    pointLight.position.set(2, 3, 4);
    this.add(pointLight);
  }

  onWindowResize() {
    this.cameraManager.update();
  }

  onKeyDown(event) {
    if (event.key === "c") {
      this.cameraManager.switchCamera(this.spaceShip.chaseCamera);
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
    }

    this.spaceShip.update(this.t, delta);
    this.spaceShip.boundingBox.setFromObject(this.spaceShip);

    this.projectiles.forEach((entry, index) => {
      const { projectile, target, speed } = entry;
      projectile.position.lerp(target, speed * proyectileDelta);
      if (projectile.position.distanceTo(target) < 0.5) {
        this.remove(projectile);
        this.projectiles.splice(index, 1);
      }
    });

    this.objects.forEach((object) => {
      if (this.spaceShip.boundingBox.intersectsBox(object.boundingBox)) {
        this.handleCollision(object);
      }
    });

    this.ufos.forEach((ufo) => {
      ufo.update(ufoDelta);
    });

    if (this.cameraManager && this.cameraManager.currentCamera) {
      this.renderer.render(this, this.cameraManager.getCurrentCamera());
    } else {
      console.error("No camera available to render the scene.");
    }

    // Asegurar que cameraManager está definido
    if (this.cameraManager) {
      this.cameraManager.update();
    }

    // Reset sólo si spaceShip está definido
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

  onDocumentMouseDown(event) {
    event.preventDefault();

    var raycaster = new THREE.Raycaster(); // Crear una nueva instancia aquí
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

      if (distance <= 100) {
        // Limit the shooting range
        this.handleUFOHit(selectedUFO, realPosition);
      }
    }
  }

  handleUFOHit(selectedUFO, realPosition) {
    this.startBlinking(selectedUFO);
    const shipFrontPosition = this.spaceShip.getFrontPosition();
    const projectile = this.createProjectile(shipFrontPosition);
    this.projectiles.push({ projectile, target: realPosition, speed: 10 });
    this.add(projectile);
  }

  createProjectile(position) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const projectile = new THREE.Mesh(geometry, material);
    projectile.position.copy(position);
    return projectile;
  }

  startBlinking(mesh) {
    let elapsed = 0;
    const originalOpacity = mesh.material.opacity;
    const blinkInterval = setInterval(() => {
      mesh.material.opacity = mesh.material.opacity === 0.5 ? 1 : 0.5;
      this.renderer.render(this, this.cameraManager.getCurrentCamera());
      elapsed += 100;
      if (elapsed >= 2000) {
        clearInterval(blinkInterval);
        mesh.material.opacity = originalOpacity;
      }
    }, 500);
  }

  handleCollision(object) {
    if (!object.collided) {
        if (object instanceof Alien) {
            this.score += object.points;
            console.log(`Puntuación aumentada, nuevo score: ${this.score}`);
            object.collided = true;  // Marca el objeto como colisionado
        } else if (object instanceof Asteroid) {
            if (!object.collided) {
                this.score = Math.max(0, this.score - object.damage);
                console.log(`Puntuación disminuida, nuevo score: ${this.score}`);
                object.collided = true;  // Marca el objeto como colisionado
            }
        }
        this.updateScore();
    }
}

  showBoundingBox(object) {
    const boxHelper = new THREE.BoxHelper(object, 0xffff00);
    this.add(boxHelper);
  }

  updateScore() {
    document.getElementById("score").textContent = this.score;
  }
}

$(function () {
  // Se instancia la escena pasándole el div que se ha creado en el HTML
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplciación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  // Se añade el listener del teclado
  window.addEventListener("keydown", (event) => scene.onKeyDown(event));

  // Se añade el listener del ratón
  document.addEventListener("mousedown", (event) =>
    scene.onDocumentMouseDown(event)
  );

  // Finalmente, realizamos el primer renderizado.
  scene.update();
});
