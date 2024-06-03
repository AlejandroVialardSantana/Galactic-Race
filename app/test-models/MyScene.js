import * as THREE from "three";
import { TrackballControls } from "../libs/TrackballControls.js";
import { Robot } from "./objects/Robot.js";
import { Shield } from "./objects/Shield.js";
import { Alien } from "./objects/Alien.js";
import { ElectricFence } from "./objects/ElectricFence.js";
import { Asteroid } from "./objects/Asteroid.js";
import { SpaceShip } from "./objects/SpaceShip.js";
import { UFO } from "./objects/UFO.js";
import { SpaceTube } from "./objects/SpaceTube.js";
import * as TWEEN from "../libs/tween.esm.js";

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.renderer = this.createRenderer(myCanvas);
    this.createCamera();

    const ambientLight = new THREE.AmbientLight(0x404040); // Luz ambiental suave
    this.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // Luz direccional
    directionalLight.position.set(0, 2, 1);
    this.add(directionalLight);

    const light = new THREE.PointLight(0xffffff, 2, 1000); // Aumenta la intensidad a 1.5
    light.position.set(0, 0, -1);
    this.add(light);

    this.robot = new Robot();
    this.robot.scale.set(0.5, 0.5, 0.5);
    this.robot.position.set(1, 0, 0);
    
    this.shield = new Shield();
    this.shield.scale.set(0.5, 0.5, 0.5);
    this.shield.position.set(0, -0.5, -0.5);

    const goldMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFD700, metalness: 0.7, roughness: 0.7 });
    const silverMaterial = new THREE.MeshPhysicalMaterial({ color: 0xC0C0C0, metalness: 0.7, roughness: 0.7 });
    const bronzeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xCD7F32, metalness: 0.7, roughness: 0.7 });

    this.bronzeAlien = new Alien(bronzeMaterial);
    this.silverAlien = new Alien(silverMaterial);
    this.goldAlien = new Alien(goldMaterial);

    this.bronzeAlien.scale.set(0.5, 0.5, 0.5);
    this.silverAlien.scale.set(0.5, 0.5, 0.5);
    this.goldAlien.scale.set(0.5, 0.5, 0.5);
    this.bronzeAlien.rotateY(Math.PI);
    this.silverAlien.rotateY(Math.PI);
    this.goldAlien.rotateY(Math.PI);

    this.bronzeAlien.position.set(-0.5, -1, 0);
    this.silverAlien.position.set(0, -1, 0);
    this.goldAlien.position.set(0.5, -1, 0);

    this.electricFence = new ElectricFence();
    this.electricFence.scale.set(0.5, 0.5, 0.5);
    this.electricFence.position.set(-1.1, -0.85, -0.5);

    this.asteroid = new Asteroid();
    this.asteroid.scale.set(0.5, 0.5, 0.5);
    this.asteroid.position.set(0.7, -0.6, -0.5);
    const asteroidLight = new THREE.PointLight(0xffffff, 1.5, 1000); // Aumenta la intensidad a 1.5
    this.asteroid.add(asteroidLight);
    
    this.spaceship = new SpaceShip();
    this.spaceship.scale.set(0.5, 0.5, 0.5);
    this.spaceship.position.set(-1, -1, 0.5);

    this.ufo = new UFO();
    this.ufo.scale.set(0.5, 0.5, 0.5);
    this.ufo.position.set(-1, 0, 0);

    this.tube = new SpaceTube();
    this.tube.getMesh().position.set(0, 0, -3);
    this.tube.getMesh().scale.set(0.05, 0.05, 0.05);

    this.add(this.robot);
    this.add(this.shield);
    this.add(this.bronzeAlien);
    this.add(this.silverAlien);
    this.add(this.goldAlien);
    this.add(this.electricFence);
    this.add(this.asteroid);
    this.add(this.spaceship);
    this.add(this.ufo);
    this.add(this.tube.getMesh());

    this.initRobotAnimations();
  }

  initRobotAnimations() {
    this.robot.animateBodyRotation(4000); 
    this.robot.animateArmLift(2000);
  }

  createRenderer(myCanvas) {
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xffffff));
    renderer.setSize(window.innerWidth, window.innerHeight);
    $(myCanvas).append(renderer.domElement);
    return renderer;
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0.5, 1.5, 3);
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameraControl = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  update() {
    this.renderer.render(this, this.camera);
    this.ufo.update();
    this.cameraControl.update();
    TWEEN.update();
    requestAnimationFrame(() => this.update());
  }
}

$(function () {
  var scene = new MyScene("#WebGL-output");
  window.addEventListener("resize", () => scene.onWindowResize());
  scene.update();
});
