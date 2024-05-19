import { Alien } from "../objects/Alien.js";
import { Asteroid } from "../objects/Asteroid.js";
import { Robot } from "../objects/Robot.js";
import { ElectricFence } from "../objects/ElectricFence.js";
import { Shield } from "../objects/Shield.js";

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
        if (!this.scene.spaceShip.isInvulnerable) {
          this.scene.handleSpaceShipHit();
          this.scene.projectileManager.removeProjectile(index);
          this.scene.score = Math.max(0, this.scene.score - 20);
        }
      }
    });
  }

  handleCollision(object) {
    if (!object.collided) {
      if (object instanceof Alien) {
        this.scene.score += object.points;
        object.collided = true;
      } else if (object instanceof Asteroid) {
        if (!this.scene.spaceShip.isInvulnerable) {
          this.scene.score = Math.max(0, this.scene.score - object.damage);
        }
        object.collided = true;
      } else if (object instanceof Robot) {
        if (!this.scene.spaceShip.isInvulnerable) {
          this.scene.handleSpaceShipHit();
          this.scene.score = Math.max(0, this.scene.score - object.damage);
        }
        object.collided = true;
      } else if (object instanceof ElectricFence) {
        if (!this.scene.spaceShip.isInvulnerable) {
          this.scene.spaceShip.disableShooting();
        }
        object.collided = true;
      } else if (object instanceof Shield) {
        if (!this.scene.spaceShip.isDisabled) {
          this.scene.spaceShip.enableInvulnerability();
        }
        object.collided = true;
      }
      this.scene.updateScore();
    }
  }
}

export { CollisionManager };
