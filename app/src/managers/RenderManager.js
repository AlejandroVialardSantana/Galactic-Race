class RenderManager {
    constructor(scene, renderer, cameraManager) {
      this.scene = scene;
      this.renderer = renderer;
      this.cameraManager = cameraManager;
    }
  
    render() {
      if (this.cameraManager && this.cameraManager.currentCamera) {
        this.renderer.render(this.scene, this.cameraManager.getCurrentCamera());
      } else {
        console.error("No camera available to render the scene.");
      }
    }
  
    onWindowResize() {
      this.cameraManager.update();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }
  
  export { RenderManager };