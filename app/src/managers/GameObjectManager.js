import * as THREE from "three";

class GameObjectManager {
  constructor(scene, tubeGeometry) {
    this.scene = scene;
    this.tubeGeometry = tubeGeometry;
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
