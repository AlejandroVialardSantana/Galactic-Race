class AnimationManager {
    constructor(scene) {
      this.scene = scene;
    }
  
    startBlinking(mesh) {
      let elapsed = 0;
      const originalOpacity = mesh.material.opacity;
      const blinkInterval = setInterval(() => {
        mesh.material.opacity = mesh.material.opacity === 0.5 ? 1 : 0.5;
        this.scene.renderer.render(this.scene, this.scene.cameraManager.getCurrentCamera());
        elapsed += 100;
        if (elapsed >= 2000) {
          clearInterval(blinkInterval);
          mesh.material.opacity = originalOpacity;
        }
      }, 500);
    }
  }
  
  export { AnimationManager };