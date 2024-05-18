import { Alien } from "../objects/Alien.js";
import { Asteroid } from "../objects/Asteroid.js";
import { Robot } from "../objects/Robot.js";
import { ElectricFence } from "../objects/ElectricFence.js";

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

    this.scene.projectileManager.projectiles.forEach((entry, index) => {
      if (entry.isRobotProjectile && entry.projectile.boundingBox.intersectsBox(this.scene.spaceShip.boundingBox)) {
        this.scene.handleSpaceShipHit();
        this.scene.projectileManager.removeProjectile(index);
      }
    });
  }

  handleCollision(object) {
    if (!object.collided) {
      if (object instanceof Alien) {
        this.scene.score += object.points;
        object.collided = true;
      } else if (object instanceof Asteroid) {
        this.scene.score = Math.max(0, this.scene.score - object.damage);
        object.collided = true;
      } else if (object instanceof Robot) {
        this.scene.handleSpaceShipHit();
        this.scene.score = Math.max(0, this.scene.score - object.damage);
        object.collided = true;
      } else if (object instanceof ElectricFence) {
        this.scene.spaceShip.disableShooting();
        object.collided = true;
      }
      this.scene.updateScore();
    }
  }
}

export { CollisionManager };

