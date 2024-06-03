// SpaceShip.js
import * as THREE from "three";
import { OBJLoader } from "../../libs/OBJLoader.js";
import { MTLLoader } from "../../libs/MTLLoader.js";
import { config } from "../../src/config/config.js";

class SpaceShip extends THREE.Object3D {
  constructor() {
    super();
    const modelsConfig = config.spaceship.models;
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();

    materialLoader.load(modelsConfig.materialPath, (materials) => {
      objectLoader.setMaterials(materials);
      objectLoader.load(modelsConfig.objectPath, (object) => {
        object.scale.set(modelsConfig.scale.x, modelsConfig.scale.y, modelsConfig.scale.z);
        object.rotateY(modelsConfig.rotation.y);
        object.translateY(modelsConfig.translation.y);
        object.castShadow = true;
        object.receiveShadow = true;

        object.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            child.material.transparent = true;
            child.userData.originalColor = child.material.color.getHex();
          }
        });

        const headlight1 = new THREE.SpotLight(0xEFCC00, 2, 100, Math.PI / 8, 0.5);
        headlight1.power = 200;
        headlight1.position.set(0.5, 2.5, 2);
        headlight1.target.position.set(0, 0, 10);
        headlight1.castShadow = true;

        const headlight2 = new THREE.SpotLight(0xEFCC00, 2, 100, Math.PI / 8, 0.5);
        headlight2.power = 200;
        headlight2.position.set(-0.5, 2.5, 2);
        headlight2.target.position.set(0, 0, 10);
        headlight2.castShadow = true;

        this.add(object);
      });
    });
  }

  update(){}
}

export { SpaceShip };
