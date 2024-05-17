import * as THREE from "three";

class ProjectileManager {
  constructor(scene) {
    this.scene = scene;
    this.projectiles = [];
  }

  createProjectile(position, color = 0xff0000) {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color });
    const projectile = new THREE.Mesh(geometry, material);
    projectile.position.copy(position);
    return projectile;
  }

  addProjectile(projectile, target, speed) {
    this.projectiles.push({ projectile, target, speed, isRobotProjectile: false });
    this.scene.add(projectile);
  }

  addRobotProjectile(projectile, velocity) {
    projectile.userData.velocity = velocity;
    this.projectiles.push({ projectile, velocity, isRobotProjectile: true });
    this.scene.add(projectile);
  }

  updateProjectiles(delta) {
    this.projectiles.forEach((entry, index) => {
      if (entry.isRobotProjectile) {
        entry.projectile.position.add(entry.velocity.clone().multiplyScalar(delta));
        if (entry.projectile.position.distanceTo(this.scene.spaceShip.positionOnTube.position) < 0.5 || entry.projectile.position.length() > 50) {
          this.scene.remove(entry.projectile);
          this.projectiles.splice(index, 1);
        }
      } else {
        entry.projectile.position.lerp(entry.target, entry.speed * delta);
        if (entry.projectile.position.distanceTo(entry.target) < 0.5) {
          this.scene.remove(entry.projectile);
          this.projectiles.splice(index, 1);
        }
      }
    });
  }
}

export { ProjectileManager };