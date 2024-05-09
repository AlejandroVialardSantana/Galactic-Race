import * as THREE from 'three';

class CameraManager {
    constructor(scene, renderer, spaceship) {
        this.scene = scene;
        this.renderer = renderer;
        this.spaceship = spaceship;
        this.createCameras();
    }

    createCameras() {
        const aspectRatio = window.innerWidth / window.innerHeight;

        // Cámara general
        this.generalCamera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
        this.generalCamera.position.set(0, 70, 70);
        this.generalCamera.lookAt(new THREE.Vector3(0, 0, 0));
        this.scene.add(this.generalCamera);

        // Cámara seguidora
        this.chaseCamera = new THREE.PerspectiveCamera(60, aspectRatio, 0.1, 500);
        this.spaceship.add(this.chaseCamera);
        
        // Establece la cámara actual
        this.currentCamera = this.generalCamera;
    }

    update() {
        if (this.currentCamera === this.chaseCamera) {
            let relativeCameraOffset = new THREE.Vector3(0, 5, -10);
            let target = new THREE.Vector3();
            this.currentCamera.getWorldPosition(target);
            target.add(relativeCameraOffset);
            this.currentCamera.lookAt(this.spaceship.position);
        }
    }

    onWindowResize() {
        const aspectRatio = window.innerWidth / window.innerHeight;
        this.generalCamera.aspect = aspectRatio;
        this.generalCamera.updateProjectionMatrix();

        this.chaseCamera.aspect = aspectRatio;
        this.chaseCamera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    switchCamera() {
        this.currentCamera = this.currentCamera === this.generalCamera ? this.chaseCamera : this.generalCamera;
        if (this.currentCamera) {
            this.renderer.render(this.scene, this.currentCamera);
        } else {
            console.error('No valid camera available for rendering');
        }
    }
}

export { CameraManager };
