import * as THREE from "three";
import { TrackballControls } from "../libs/TrackballControls.js";
import { GUI } from "../libs/dat.gui.module.js";

import { SpaceTube } from "./objects/SpaceTube.js";
import { SpaceShip } from "./objects/SpaceShip.js";
import { Alien } from "./objects/Alien.js";
import { Shield } from "./objects/Shield.js";
import { Asteroid } from "./objects/Asteroid.js";
import { UFO } from "./objects/UFO.js";

class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.travelTime = 20;
    this.velocity = 1 / this.travelTime;
    this.t = 0;

    this.clock = new THREE.Clock();

    this.renderer = this.createRenderer(myCanvas);

    this.gui = this.createGUI();

    this.createCamera();

    this.createLights();

    this.axis = new THREE.AxesHelper(6);
    this.add(this.axis);

    this.tube = new SpaceTube();
    this.spaceShip = new SpaceShip(this.tube.getGeometry());
    this.alien = new Alien();
    this.asteroid = new Asteroid();
    this.shield = new Shield();
    this.ufo = new UFO();

    // this.add(this.tube.getMesh());
    // this.add(this.spaceShip);
    // this.add(this.alien);
    // this.add(this.asteroid);
    // this.add(this.shield);
    // this.add(this.ufo);
  }

  createCamera() {
    // Se crea una cámara
    // El ángulo del campo de visión vertical en grados sexagesimales
    // La razón de aspecto ancho/alto
    // Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    // Se indica donde se coloca
    this.camera.position.set(0.5, 1.5, 3);

    // Y hacia dónde mira
    var look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);

    // Se añade a la escena
    this.add(this.camera);

    // Control de cámara
    this.cameraControl = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );

    // Se configuran las velocidades de los movimientos
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;

    // Debe orbitar con respecto al punto de mira de la cámara
    this.cameraControl.target = look;
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

  createGUI() {
    var gui = new GUI();

    this.guiControls = new (function () {
      this.lightIntensity = 0.5;
    })();

    gui
      .add(this.guiControls, "lightIntensity", 0, 1, 0.1)
      .name("Intensidad de la luz: ");

    return gui;
  }

  getCamera() {
    return this.camera;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onWindowResize() {
    // Cuando se modifica el tamaño de la ventana se ha de actualizar el ratio de aspecto de la cámara
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Y también el tamaño del visualizador
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    const delta = this.clock.getDelta(); // Tiempo desde el último frame

    this.t += this.velocity * delta;

    // console.log(this.velocity);

    if (this.t > 1) {
      this.t -= 1;
      this.velocity *= 1.1;
    }

    this.spaceShip.update(this.t, delta);

    // Se le indica al visualizador que renderice la escena
    this.renderer.render(this, this.camera);

    // Se actualiza la posición de la cámara según su controlador
    this.cameraControl.update();

    this.spaceShip.inputManager.resetJustPressed();

    // Cada vez que se realice un cambio, se reenderiza de nuevo la escena
    requestAnimationFrame(() => this.update());
  }
}

$(function () {
  // Se instancia la escena pasándole el div que se ha creado en el HTML
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplciación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener("resize", () => scene.onWindowResize());

  // Finalmente, realizamos el primer renderizado.
  scene.update();
});
