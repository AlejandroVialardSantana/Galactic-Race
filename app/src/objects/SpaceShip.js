import * as THREE from "three";
import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";

class SpaceShip extends THREE.Object3D {
  constructor(tubeGeometry) {
    super();

    this.nodoPosOrientTubo = new THREE.Object3D();
    this.tube = tubeGeometry;
    this.tubePath = tubeGeometry.parameters.path;
    this.tubeRadius = tubeGeometry.parameters.radius;
    this.tubeSegments = tubeGeometry.parameters.tubularSegments;

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    materialLoader.load(
      "../models/D5SpaceShip/d5class.mtl",
      function (materials) {
        objectLoader.setMaterials(materials);
        objectLoader.load(
          "../models/D5SpaceShip/d5class.obj",
          function (object) {
            object.rotateY(Math.PI);
            object.scale.set(0.1, 0.1, 0.1);
            object.translateY(4); 
            this.add(object);
          }.bind(this)
        ); 
      }.bind(this)
    );
  }

  update(t) {
    var pos = this.tubePath.getPointAt(t);
    this.nodoPosOrientTubo.position.copy(pos);

    var tangent = this.tubePath.getTangentAt(t);
    pos.add(tangent);

    var segment = Math.floor(t * this.tubeSegments);
    this.nodoPosOrientTubo.up = this.tube.binormals[segment];
    this.nodoPosOrientTubo.lookAt(pos);

    this.position.copy(this.nodoPosOrientTubo.position);
  }
}

export { SpaceShip };
