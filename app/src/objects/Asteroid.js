import * as THREE from "three";

import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";

class Asteroid extends THREE.Object3D {
    constructor() {
        super();
    
        var materialLoader = new MTLLoader();
        var objectLoader = new OBJLoader();
    
        materialLoader.load('../models/Asteroid/asteroid.mtl', function (materials) {
            objectLoader.setMaterials(materials);
            objectLoader.load('../models/Asteroid/asteroid.obj', function (object) {
                object.scale.set(0.001, 0.001, 0.001);
                this.add(object);
            }.bind(this));
        }.bind(this));
    }
}

export { Asteroid };