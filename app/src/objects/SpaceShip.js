import * as THREE from "three";

import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";
import { VALUE_A, VALUE_D } from "../../libs/keycode.esm.js";
import { InputManager } from "../input/InputManager.js";

class SpaceShip extends THREE.Object3D {
  constructor(tubeGeometry) {
    super();
    this.inputManager = new InputManager();

    this.angularPosition = Math.PI;
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.chaseCamera = new THREE.PerspectiveCamera(100, aspectRatio, 0.1, 500);
    this.chaseCamera.position.set(0, 5, -10);

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
            object.translateY(2.5); // Asegúrate de que esta transformación coloca el frente correctamente
            this.orientationNode.add(object);
            this.positionOnTube.add(this.orientationNode);
        });
    });

    this.orientationNode.add(this.chaseCamera);
    this.add(this.positionOnTube);

    // Añadir un nodo que especificamente apunta al frente
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

    this.chaseCamera.lookAt(pos);

    this.positionOnTube.updateMatrixWorld(true);
  }

  getFrontPosition() {
    var frontPos = new THREE.Vector3();
    this.frontNode.getWorldPosition(frontPos);
    return frontPos;
}
}

export { SpaceShip };
