import * as THREE from "three";

import { Alien } from "../objects/Alien.js";

class GameObjectManager {
  constructor(scene, tubeGeometry) {
    this.scene = scene;
    this.tubeGeometry = tubeGeometry;

    this.goldMaterial = new THREE.MeshPhysicalMaterial({ color: 0xFFD700, metalness: 0.7, roughness: 0.7 });
    this.silverMaterial = new THREE.MeshPhysicalMaterial({ color: 0xC0C0C0, metalness: 0.7, roughness: 0.7 });
    this.bronzeMaterial = new THREE.MeshPhysicalMaterial({ color: 0xCD7F32, metalness: 0.7, roughness: 0.7 });
  }

  addAliens(numGold, numSilver, numBronze) {
    const totalAliens = numGold + numSilver + numBronze;

    for (let i = 0; i < totalAliens; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      let material, points;

      if (i < numGold) {
        material = this.goldMaterial;
        points = 100;
      } else if (i < numGold + numSilver) {
        material = this.silverMaterial;
        points = 50;
      } else {
        material = this.bronzeMaterial;
        points = 20;
      }

      const alien = new Alien(this.tubeGeometry, t, angularOffset, material, points);
      alien.boundingBox = new THREE.Box3().setFromObject(alien);
      this.scene.objects.push(alien);
      this.scene.add(alien);
    }
  }

  addGameObjects(ObjectClass, numObjects, collection = null) {
    for (let i = 0; i < numObjects; i++) {
      const t = Math.random();
      const angularOffset = Math.random() * 2 * Math.PI;
      const object = new ObjectClass(this.tubeGeometry, t, angularOffset);
      object.boundingBox = new THREE.Box3().setFromObject(object);
      this.scene.objects.push(object);
      this.scene.add(object);
      if (collection) {
        collection.push(object);
      }
    }
  }
}

export { GameObjectManager };
