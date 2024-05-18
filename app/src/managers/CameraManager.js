import * as THREE from 'three';

class CameraManager {
  constructor(scene, renderer, chaseCamera) {
    this.scene = scene;
    this.renderer = renderer;
    this.chaseCamera = chaseCamera;
    this.createCameras();
  }

  createCameras() {
    const aspectRatio = window.innerWidth / window.innerHeight;

    // Cámara general
    this.generalCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1050);
    this.generalCamera.position.set(0, 70, 90);
    this.generalCamera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.generalCamera);

    // Establece la cámara actual
    this.currentCamera = this.chaseCamera;
  }

  update() {
    const aspectRatio = window.innerWidth / window.innerHeight;
    this.currentCamera.aspect = aspectRatio;
    this.currentCamera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  switchCamera() {
    if (this.currentCamera === this.generalCamera) {
      this.currentCamera = this.chaseCamera;
    } else {
      this.currentCamera = this.generalCamera;
    }
  }

  getCurrentCamera() {
    return this.currentCamera;
  }
}

export { CameraManager };