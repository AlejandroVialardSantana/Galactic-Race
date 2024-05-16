import { Alien } from "../objects/Alien.js";
import { Asteroid } from "../objects/Asteroid.js";

class CollisionManager {
  constructor(scene) {
    this.scene = scene;
  }

  checkCollisions() {
    this.scene.objects.forEach((object) => {
      if (this.scene.spaceShip.boundingBox.intersectsBox(object.boundingBox)) {
        this.handleCollision(object);
      }
    });
  }

  handleCollision(object) {
    if (!object.collided) {
      if (object instanceof Alien) {
        this.scene.score += object.points;
        object.collided = true;
      } else if (object instanceof Asteroid) {
        if (!object.collided) {
          this.scene.score = Math.max(0, this.scene.score - object.damage);
          object.collided = true;
        }
      }
      this.scene.updateScore();
    }
  }
}

export { CollisionManager };
