import * as THREE from "three";

class UFO extends THREE.Object3D {
  constructor() {
    super();

    this.material = new THREE.MeshNormalMaterial({ color: 0x555555 });

    this.ufo = this.createUFO();

    const semisphereGeometry = new THREE.SphereGeometry(
      0.5,
      20,
      20,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    const semisphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff, 
      transparent: true,
      opacity: 0.5,
    });

    const semisphere = new THREE.Mesh(semisphereGeometry, semisphereMaterial);

    this.add(this.ufo);

    semisphere.position.set(0, 2.2, 0);

    this.add(semisphere);
    this.addLegs();
    this.addLights();
  }

  createUFO() {

    const points = [
      new THREE.Vector2(0, 1),
      new THREE.Vector2(0.5, 1),
      new THREE.Vector2(1.8, 1.5),
      new THREE.Vector2(0.8, 2),
      new THREE.Vector2(1, 2.2),
      new THREE.Vector2(0, 2.2),
    ];

    const geometry = new THREE.LatheGeometry(points, 20);

    const material = new THREE.MeshStandardMaterial({
      color: 0x5c5c5c,
    });
    const ufo = new THREE.Mesh(geometry, material);
    return ufo;
  }

  addLegs() {
    const positionsX = [
      { x: 0.95, z: 0, angle: Math.PI / 4 },
      { x: -0.95, z: 0, angle: -Math.PI / 4 },
    ];

    const positionsZ = [
      { x: 0, z: 0.95, angle: -Math.PI / 4 },
      { x: 0, z: -0.95, angle: Math.PI / 4 },
    ];

    positionsX.forEach((position) => {
      const legComplete = this.createLeg();
      legComplete.position.set(position.x, 0.8, position.z);
      legComplete.rotation.z = position.angle;
      this.add(legComplete);
    });

    positionsZ.forEach((position) => {
      const legComplete = this.createLeg();
      legComplete.position.set(position.x, 0.8, position.z);
      legComplete.rotation.x = position.angle;
      this.add(legComplete);
    });
  }

  createLeg() {
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const legTipGeometry = new THREE.SphereGeometry(0.1, 12, 12);
    const legTipMaterial = new THREE.MeshStandardMaterial({ color: 0x4d4d4d });

    const leg = new THREE.Mesh(legGeometry, legMaterial);
    const legTip = new THREE.Mesh(legTipGeometry, legTipMaterial);

    legTip.position.y = -0.5; 

    const legComplete = new THREE.Object3D();
    legComplete.add(leg);
    legComplete.add(legTip);

    legComplete.translateX(legComplete.position.x > 0 ? 0.75 : -0.75);

    return legComplete;
  }

  addLights() {
    const lightColor = 0xffffff;
    const intensity = 1;
    const distance = 5;
    const decay = 2;

    const lightPositions = [
      new THREE.Vector3(1, 2.2, 0),
      new THREE.Vector3(-1, 2.2, 0),
      new THREE.Vector3(0, 2.2, 1),
      new THREE.Vector3(0, 2.2, -1),
    ];

    const greenLightColor = 0x00ff00;
    const greenLightIntensity = 4.5;
    const greenLightDistance = 2.5;
    const greenLightDecay = 2;

    const greenLightPositions = [
      new THREE.Vector3(1.5, -0.5, 0),
      new THREE.Vector3(-1.5, -0.5, 0),
      new THREE.Vector3(0, -0.5, 1.5),
      new THREE.Vector3(0, -0.5, -1.5),
    ];

    greenLightPositions.forEach((position) => {
      const greenLight = new THREE.PointLight(
        greenLightColor,
        greenLightIntensity,
        greenLightDistance,
        greenLightDecay
      );
      greenLight.position.copy(position);
      this.add(greenLight);
    });

    lightPositions.forEach((position) => {
      const light = new THREE.PointLight(
        lightColor,
        intensity,
        distance,
        decay
      );
      light.position.set(position.x, position.y, position.z);
      this.add(light);
    });
  }

  update() {}
}

export { UFO };
