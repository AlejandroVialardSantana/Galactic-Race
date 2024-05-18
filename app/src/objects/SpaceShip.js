import * as THREE from "three";
import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";
import { VALUE_A, VALUE_D } from "../../libs/keycode.esm.js";
import { InputManager } from "../managers/InputManager.js";

class SpaceShip extends THREE.Object3D {
  constructor(tubeGeometry) {
    super();
    this.inputManager = new InputManager();
    this.canShoot = true;
    this.isInvulnerable = false;
    this.isDisabled = false;
    this.cooldownTimeout = null;
    this.invulnerableTimeout = null;
    this.messageTimeout = null;

    this.angularPosition = Math.PI;
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.chaseCamera = new THREE.PerspectiveCamera(100, aspectRatio, 0.1, 500);
    this.chaseCamera.position.set(0, 5, 10);

    this.positionOnTube = new THREE.Object3D();
    this.orientationNode = new THREE.Object3D();

    this.tube = tubeGeometry;
    this.tubePath = tubeGeometry.parameters.path;
    this.tubeRadius = tubeGeometry.parameters.radius;
    this.tubeSegments = tubeGeometry.parameters.tubularSegments;

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    materialLoader.load("../models/D5SpaceShip/d5class.mtl", (materials) => {
      objectLoader.setMaterials(materials);
      objectLoader.load("../models/D5SpaceShip/d5class.obj", (object) => {
        object.scale.set(0.2, 0.2, 0.2);
        object.rotateY(Math.PI);
        object.translateY(2.5);
        object.castShadow = true;
        object.receiveShadow = true;

        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.transparent = true;
            child.userData.originalColor = child.material.color.getHex();
          }
        });

        object.add(this.chaseCamera);
        this.orientationNode.add(object);

        const headlight1 = new THREE.SpotLight(0xEFCC00, 2, 100, Math.PI / 8, 0.5);
        headlight1.power = 200;
        headlight1.position.set(0.5, 2.5, 2);
        headlight1.target.position.set(0, 0, 10);
        headlight1.castShadow = true;
        this.orientationNode.add(headlight1);
        this.orientationNode.add(headlight1.target);

        const headlight2 = new THREE.SpotLight(0xEFCC00, 2, 100, Math.PI / 8, 0.5);
        headlight2.power = 200;
        headlight2.position.set(-0.5, 2.5, 2);
        headlight2.target.position.set(0, 0, 10);
        headlight2.castShadow = true;
        this.orientationNode.add(headlight2);
        this.orientationNode.add(headlight2.target);

        this.positionOnTube.add(this.orientationNode);
      });
    });

    this.add(this.positionOnTube);

    this.frontNode = new THREE.Object3D();
    this.frontNode.scale.set(0.2, 0.2, 0.2);
    this.frontNode.rotateY(Math.PI);
    this.frontNode.translateY(2.5);
    this.orientationNode.add(this.frontNode);
  }

  update(t, delta) {
    const turnRate = 2 * Math.PI;

    if (this.inputManager.isKeyPressed(VALUE_A)) {
      this.angularPosition -= turnRate * delta;
    }

    if (this.inputManager.isKeyPressed(VALUE_D)) {
      this.angularPosition += turnRate * delta;
    }

    this.angularPosition =
      ((this.angularPosition % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    this.orientationNode.rotation.z = this.angularPosition;

    var pos = this.tubePath.getPointAt(t);
    this.positionOnTube.position.copy(pos);

    var tangent = this.tubePath.getTangentAt(t);
    pos.add(tangent);

    var segment = Math.floor(t * this.tubeSegments);
    this.positionOnTube.up = this.tube.binormals[segment];
    this.positionOnTube.lookAt(pos);

    this.positionOnTube.updateMatrixWorld(true);
  }

  getFrontPosition() {
    var frontPos = new THREE.Vector3();
    this.frontNode.getWorldPosition(frontPos);
    return frontPos;
  }

  blink() {
    const blinkDuration = 2000;
    const blinkInterval = 100;
    const redColor = 0xff0000;

    const blinker = () => {
      this.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const currentColor = child.material.color.getHex();
          child.material.color.setHex(currentColor === child.userData.originalColor ? redColor : child.userData.originalColor);
        }
      });
    };

    const blinkIntervalId = setInterval(blinker, blinkInterval);

    setTimeout(() => {
      clearInterval(blinkIntervalId);
      this.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.color.setHex(child.userData.originalColor);
        }
      });
    }, blinkDuration);
  }

  disableShooting() {
    this.canShoot = false;
    this.isDisabled = true;

    const cooldownContainer = document.getElementById("cooldown-container");
    const cooldownBar = document.getElementById("cooldown-bar");
    cooldownContainer.style.display = 'block';
    cooldownBar.style.width = '100%';
    cooldownBar.style.transition = 'none';
    setTimeout(() => {
      cooldownBar.style.transition = 'width 7s linear';
      cooldownBar.style.width = '0%';
    }, 0);

    if (this.cooldownTimeout) {
      clearTimeout(this.cooldownTimeout);
    }

    this.cooldownTimeout = setTimeout(() => {
      this.canShoot = true;
      this.isDisabled = false;
      cooldownContainer.style.display = 'none';
      this.cooldownTimeout = null;
    }, 7000);

    this.showMessage("DISABLED", "#FF0000", 7000);
  }

  enableInvulnerability() {
    this.isInvulnerable = true;

    const invulnerableContainer = document.getElementById("invulnerable-container");
    const invulnerableBar = document.getElementById("invulnerable-bar");
    invulnerableContainer.style.display = 'block';
    invulnerableBar.style.width = '100%';
    invulnerableBar.style.transition = 'none';
    setTimeout(() => {
      invulnerableBar.style.transition = 'width 7s linear';
      invulnerableBar.style.width = '0%';
    }, 0);

    if (this.invulnerableTimeout) {
      clearTimeout(this.invulnerableTimeout);
    }

    this.invulnerableTimeout = setTimeout(() => {
      this.isInvulnerable = false;
      invulnerableContainer.style.display = 'none';
      this.invulnerableTimeout = null;
    }, 7000);

    this.showMessage("INVULNERABLE", "#0000FF", 7000);
  }

  showMessage(message, color, duration) {
    const messageElement = document.getElementById("message");
    const messageContainer = document.getElementById("message-container");
    messageElement.textContent = message;
    messageContainer.style.display = 'block';
    messageContainer.style.color = color;

    messageContainer.classList.add("blink");

    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }

    this.messageTimeout = setTimeout(() => {
      messageContainer.style.display = 'none';
      messageContainer.classList.remove("blink");
      this.messageTimeout = null;
    }, duration);
  }
}

export { SpaceShip };
