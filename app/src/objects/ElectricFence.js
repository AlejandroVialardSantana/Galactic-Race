import * as THREE from "three";

class ElectricFence extends THREE.Object3D {
    constructor(tubeGeometry, t, angularPosition) {
        super();

        this.electricFence = new THREE.Object3D();

        const pilarBase = this.createPilarBase();
        const pilarTop = pilarBase.clone();
        const pilar = this.createPilar();
        const panel = this.createElectricPanel();
        const spikes = this.createSpikes();
        const spikes2 = spikes.clone();

        pilarTop.rotateX(Math.PI);
        pilarTop.position.set(0, 2, 0);

        spikes2.position.set(3, 0, 0);

        this.electricFence.add(pilarBase);
        this.electricFence.add(pilar);
        this.electricFence.add(pilarTop);
        this.electricFence.add(panel);
        this.electricFence.add(spikes);
        this.electricFence.add(spikes2);

        this.electricFence.position.set(0, 1.8, 0);
        this.electricFence.scale.set(0.5, 0.5, 0.5);

        this.angularPosition = angularPosition;

        this.positionOnTube = new THREE.Object3D();
        this.orientationNode = new THREE.Object3D();

        this.orientationNode.add(this.electricFence);
        this.positionOnTube.add(this.orientationNode);
        this.add(this.positionOnTube);

        this.positionateOnTube(tubeGeometry, t);
    }

    createPilar() {
        const geometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const pilar = new THREE.Mesh(geometry, material);
        const pilar2 = pilar.clone();

        pilar.position.set(0, 1, 0);
        pilar2.position.set(3, 1, 0);

        const pilarGroup = new THREE.Object3D();
        pilarGroup.add(pilar);
        pilarGroup.add(pilar2);

        return pilarGroup;
    }

    createPilarBase() {
        const cilinderGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.1, 20);
        const cilinderMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
        const cilinderBase = new THREE.Mesh(cilinderGeometry, cilinderMaterial);

        const cilinderBase2 = cilinderBase.clone();

        const torusGeometry = new THREE.TorusGeometry(0.3, 0.05, 16, 100);
        const torusMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);

        const torus2 = torus.clone();

        torus.rotateX(Math.PI / 2);
        torus.position.set(0, 0.1, 0);
        torus2.rotateX(Math.PI / 2);
        torus2.position.set(3, 0.1, 0);
        cilinderBase.position.set(0, 0, 0);
        cilinderBase2.position.set(3, 0, 0);

        const cilinderBaseGroup = new THREE.Object3D();
        cilinderBaseGroup.add(cilinderBase);
        cilinderBaseGroup.add(cilinderBase2);
        cilinderBaseGroup.add(torus);
        cilinderBaseGroup.add(torus2);

        return cilinderBaseGroup;
    }

    createElectricPanel() {
        const panelGeometry = new THREE.BoxGeometry(3, 1.5, 0.1);
        const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);

        panel.position.set(1.5, 1, 0);

        const panelGroup = new THREE.Object3D();
        panelGroup.add(panel);

        return panelGroup;
    }

    createSpikes() {
        const spikeGeometry = new THREE.ConeGeometry(0.05, 0.4, 20);
        const spikeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const spike = new THREE.Mesh(spikeGeometry, spikeMaterial);

        const spike2 = spike.clone();
        const spike3 = spike.clone();
        const spike4 = spike.clone();

        spike.rotateZ(Math.PI / 6);
        spike.position.set(-0.3, 2.2, 0);
        spike2.rotateZ(-Math.PI / 6);
        spike2.position.set(0.3, 2.2, 0);
        spike3.rotateX(Math.PI / 6);
        spike3.position.set(0, 2.2, 0.3);
        spike4.rotateX(-Math.PI / 6);
        spike4.position.set(0, 2.2, -0.3);

        const spikeGroup = new THREE.Object3D();
        spikeGroup.add(spike);
        spikeGroup.add(spike2);
        spikeGroup.add(spike3);
        spikeGroup.add(spike4);

        return spikeGroup;
    }

    positionateOnTube(tubeGeometry, t) {
        const path = tubeGeometry.parameters.path;
        const pos = path.getPointAt(t);
        this.positionOnTube.position.copy(pos);
    
        const tangent = path.getTangentAt(t);
        pos.add(tangent);
    
        const segment = Math.floor(t * tubeGeometry.parameters.tubularSegments);
        this.positionOnTube.up = tubeGeometry.normals[segment];
        this.positionOnTube.lookAt(pos);
    
        this.orientationNode.rotation.z = this.angularPosition;
      }
}

export { ElectricFence };