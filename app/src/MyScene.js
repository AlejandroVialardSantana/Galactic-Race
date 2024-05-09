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

      this.travelTime = 20;
      this.velocity = 1 / this.travelTime;
      this.t = 0;

      this.clock = new THREE.Clock();

      this.objects = [];
      this.ufos = [];

      this.renderer = this.createRenderer(myCanvas); 

      this.createLights();

      this.axis = new THREE.AxesHelper(6);
      this.add(this.axis);

      this.tube = new SpaceTube();
      this.spaceShip = new SpaceShip(this.tube.getGeometry());
      
      this.cameraManager = new CameraManager(this, this.renderer, this.spaceShip);

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
        this.objects.push(alien);
        this.add(alien);
      }
    }

    addRobots(numRobots) {
      for (let i = 0; i < numRobots; i++) {
        const t = Math.random();
        const angularOffset = Math.random() * 2 * Math.PI;
        const robot = new Robot(this.tube.getGeometry(), t, angularOffset);
        this.objects.push(robot);
        this.add(robot);
      }
    }

    addUFOs(numUFOs) {
      for (let i = 0; i < numUFOs; i++) {
        const t = Math.random();
        const angularOffset = Math.random() * 2 * Math.PI;
        const ufo = new UFO(this.tube.getGeometry(), t, angularOffset);
        this.ufos.push(ufo);
        this.objects.push(ufo);
        this.add(ufo);
      }
    }

    addElectricFences(numFences) {
      for (let i = 0; i < numFences; i++) {
        const t = Math.random();
        const angularOffset = Math.random() * 2 * Math.PI;
        const fence = new ElectricFence(this.tube.getGeometry(), t, angularOffset);
        this.objects.push(fence);
        this.add(fence);
      } 
    }

    addAsteroids(numAsteroids) {
      for (let i = 0; i < numAsteroids; i++) {
        const t = Math.random();
        const angularOffset = Math.random() * 2 * Math.PI;
        const asteroid = new Asteroid(this.tube.getGeometry(), t, angularOffset);
        this.objects.push(asteroid);
        this.add(asteroid);
      }
    }

    addShields(numShields) {
      for (let i = 0; i < numShields; i++) {
        const t = Math.random();
        const angularOffset = Math.random() * 2 * Math.PI;
        const shield = new Shield(this.tube.getGeometry(), t, angularOffset);
        this.objects.push(shield);
        this.add(shield);
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
      this.cameraManager.onWindowResize();
    }

    onKeyDown(event) {
      if (event.key === 'c') {
          this.cameraManager.switchCamera();
      }
    }

    update() {
      const delta = this.clock.getDelta();
  
      this.t += this.velocity * delta;
  
      if (this.t > 1) {
          this.t -= 1;
          this.velocity *= 1.1;
      }
  
      this.spaceShip.update(this.t, delta);
  
      this.ufos.forEach((ufo) => {
              ufo.update(delta);
      });
  
      if (this.cameraManager && this.cameraManager.currentCamera) {
          this.renderer.render(this, this.cameraManager.currentCamera);
      } else {
          console.error('No camera available to render the scene.');
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
  }

  $(function () {
    // Se instancia la escena pasándole el div que se ha creado en el HTML
    var scene = new MyScene("#WebGL-output");

    // Se añaden los listener de la aplciación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
    window.addEventListener("resize", () => scene.onWindowResize());

    // Se añade el listener del teclado
    window.addEventListener("keydown", (event) => scene.onKeyDown(event));

    // Finalmente, realizamos el primer renderizado.
    scene.update();
  });
