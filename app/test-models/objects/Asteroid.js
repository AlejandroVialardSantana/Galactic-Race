import * as THREE from "three";
import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";

class Asteroid extends THREE.Object3D {
  constructor() {
    super();

    this.damage = 10;
    this.collided = false;

    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    materialLoader.load('../../models/Asteroid/asteroid.mtl', function (materials) {
      objectLoader.setMaterials(materials);
      objectLoader.load('../../models/Asteroid/asteroid.obj', function (object) {
        object.scale.set(0.0004, 0.0004, 0.0004);
        object.translateY(2.8);
        object.castShadow = true; // Habilitar sombras
        object.receiveShadow = true; // Recibir sombras
        this.boundingBox = new THREE.Box3().setFromObject(this);
        
        const light = new THREE.PointLight(0xffffff, 1, 10);
        light.position.set(0, 3, 1);
        this.add(light);

        this.add(object);

      }.bind(this));
    }.bind(this));
}
}

export { Asteroid };
