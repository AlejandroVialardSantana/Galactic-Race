import * as THREE from "three";

import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";

class Asteroid extends THREE.Object3D {
    constructor(tubeGeometry, t, angularPosition) {
        super();

        this.damage = 10;
        this.collided = false;
    
        var materialLoader = new MTLLoader();
        var objectLoader = new OBJLoader();

        this.angularPosition = angularPosition;

        this.positionOnTube = new THREE.Object3D();
        this.orientationNode = new THREE.Object3D();
    
        materialLoader.load('../models/Asteroid/asteroid.mtl', function (materials) {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/Asteroid/asteroid.obj', function (object) {
                object.scale.set(0.0004, 0.0004, 0.0004);
                object.translateY(2.8);
                this.orientationNode.add(object);
                this.positionOnTube.add(this.orientationNode);
                this.boundingBox = new THREE.Box3().setFromObject(this);
            }.bind(this));
        }.bind(this));

        this.add(this.positionOnTube);

        this.positionateOnTube(tubeGeometry, t);
    }

    positionateOnTube(tubeGeometry, t) {
        const path = tubeGeometry.parameters.path;
        const pos = path.getPointAt(t);
        this.positionOnTube.position.copy(pos);
    
        const tangent = path.getTangentAt(t);
        pos.add(tangent);
    
        const segment = Math.floor(t * tubeGeometry.parameters.tubularSegments);
        this.positionOnTube.up = tubeGeometry.normals[segment];
        this.positionOnTube.lookAt(pos);
    
        this.orientationNode.rotation.z = this.angularPosition;
    }
}

export { Asteroid };