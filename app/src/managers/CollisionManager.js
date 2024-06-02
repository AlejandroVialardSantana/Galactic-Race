// CollisionManager.js
import { Alien } from "../objects/Alien.js";
import { Asteroid } from "../objects/Asteroid.js";
import { Robot } from "../objects/Robot.js";
import { ElectricFence } from "../objects/ElectricFence.js";
import { Shield } from "../objects/Shield.js";
import { config } from "../config/config.js";

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
      if (object instanceof Alien || object instanceof Asteroid) {
        this.scene.score += object.points || -object.damage;
        if (object instanceof Alien) {
          const soundPath = object.material.color.getHex() === 0xFFD700 ? config.sounds.goldAlien : config.sounds.alienPickup;
          this.temporarilyHideObject(object, soundPath);
        } else {
          this.temporarilyHideObject(object, config.sounds.rockDestroy);
          this.scene.spaceShip.blinkWithColor(0xff0000, 2000);
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

  temporarilyHideObject(object, soundPath) {
    this.sound = new Audio(soundPath);
    this.sound.play();
    object.visible = false;
    setTimeout(() => {
      object.visible = true;
    }, 1000);
  }
}

export { CollisionManager };
