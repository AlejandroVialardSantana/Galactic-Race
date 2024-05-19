import * as THREE from "three";

class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
    
    this.beamSound = new Audio("../../sounds/beam.mp3");
    this.laserSound = new Audio("../../sounds/laser.mp3");
  }

  createProjectile(position, color = 0xff0000) {
    const geometry = new THREE.SphereGeometry(0.5, 20, 20);
    const material = new THREE.MeshBasicMaterial({ color });
    const projectile = new THREE.Mesh(geometry, material);
    projectile.position.copy(position);
    projectile.boundingBox = new THREE.Box3().setFromObject(projectile);
    return projectile;
  }

  addProjectile(projectile, target, speed) {
    if (this.scene.spaceShip.isDisabled) return;
    this.projectiles.push({ projectile, target, speed, isRobotProjectile: false });
    this.scene.add(projectile);

    this.laserSound.currentTime = 0;
    this.laserSound.play();
  }

  addRobotProjectile(projectile, velocity) {
    projectile.userData.velocity = velocity;
    projectile.boundingBox = new THREE.Box3().setFromObject(projectile);
    this.projectiles.push({ projectile, velocity, isRobotProjectile: true });
    this.scene.add(projectile);

    this.beamSound.currentTime = 0;
    this.beamSound.play();
  }

  updateProjectiles(delta) {
    this.projectiles.forEach((entry, index) => {
      if (entry.isRobotProjectile) {
        entry.projectile.position.add(entry.velocity.clone().multiplyScalar(delta));
        entry.projectile.boundingBox.setFromObject(entry.projectile);
        if (entry.projectile.position.length() > 50) {
          this.scene.remove(entry.projectile);
          this.projectiles.splice(index, 1);
        }
      } else {
        entry.projectile.position.lerp(entry.target, entry.speed * delta);
        entry.projectile.boundingBox.setFromObject(entry.projectile);
        if (entry.projectile.position.distanceTo(entry.target) < 0.5) {
          this.scene.remove(entry.projectile);
          this.projectiles.splice(index, 1);
        }
      }
    });
  }

  removeProjectile(index) {
    this.scene.remove(this.projectiles[index].projectile);
    this.projectiles.splice(index, 1);
  }
}

export { ProjectileManager };
