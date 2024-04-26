import * as THREE from "three";

import { Alien } from "../objects/Alien.js";
import { Asteroid } from "../objects/Asteroid.js";
import { Robot } from "../objects/Robot.js";
import { UFO } from "../objects/UFO.js";

export class ObjectFactory {
  constructor(tubeGeometry) {
    this.tubeGeometry = tubeGeometry;
    this.path = tubeGeometry.parameters.path;
    this.tubeRadius = tubeGeometry.parameters.radius;
    this.tubeSegments = tubeGeometry.parameters.tubularSegments;
  
    this.positionOnTube = new THREE.Object3D();
    this.orientationNode = new THREE.Object3D();
}

  createObject(objectType) {
    switch (objectType) {
      case "Alien":
        return new Alien();
      case "Asteroid":
        return new Asteroid();
      case "Robot":
        return new Robot();
      case "UFO":
        return new UFO();
    }
  }

  createObjectAtT(objectType, t, angle = 0, height = this.tubeRadius) {
    const object = this.createObject(objectType);
    this.positionObjectAtT(object, t, height, angle);
    return object;
  }

  positionObjectAtT(obj, t, height, angle) {
    this.angularPosition = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    this.orientationNode.rotation.z = this.angularPosition;

    const position = this.path.getPointAt(t);
    this.positionOnTube.position.copy(position);

    const tangent = this.path.getTangentAt(t);
    position.add(tangent);

    const segment = Math.floor(t * this.tubeSegments);
    this.positionOnTube.up = this.tubeGeometry.normals[segment];
    this.positionOnTube.position.y += height;
    this.positionOnTube.lookAt(position);

    this.orientationNode.add(obj);
    this.positionOnTube.add(this.orientationNode);

    obj.position.copy(this.positionOnTube.position);
    obj.rotation.copy(this.positionOnTube.rotation);
}
  
  
}
