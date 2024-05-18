import * as THREE from "three";

class UFO extends THREE.Object3D {
  constructor(tubeGeometry, t, angularPosition) {
    super();

    this.animationTime = 0;
    this.bobbingAmplitude = 0.5;
    this.rotationSpeed = Math.PI / 2;
    this.bobbingFrequency = 2; 
    this.horizontalMovementAmplitude = 5; 
    this.horizontalMovementFrequency = 1;

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

    this.ufo.add(semisphere);

    this.addLegs();
    this.addLights();

    this.ufo.position.set(0, 7, 0);
    this.ufo.rotateY(Math.PI);
    this.ufo.scale.set(0.5, 0.5, 0.5);

    this.angularPosition = angularPosition;

    this.positionOnTube = new THREE.Object3D();
    this.orientationNode = new THREE.Object3D();

    this.orientationNode.add(this.ufo);
    this.positionOnTube.add(this.orientationNode);
    this.add(this.positionOnTube);

    this.positionateOnTube(tubeGeometry, t);
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
      transparent: true,
      opacity: 1,
    });
    const ufo = new THREE.Mesh(geometry, material);
    ufo.userData = this;
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
      this.ufo.add(legComplete);
    });

    positionsZ.forEach((position) => {
      const legComplete = this.createLeg();
      legComplete.position.set(position.x, 0.8, position.z);
      legComplete.rotation.x = position.angle;
      this.ufo.add(legComplete);
    });
  }

  createLeg() {
    const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 12);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x444444,
      transparent: true,
      opacity: 1,
     });
    const legTipGeometry = new THREE.SphereGeometry(0.1, 12, 12);
    const legTipMaterial = new THREE.MeshStandardMaterial({ color: 0x4d4d4d,
      transparent: true,
      opacity: 1,
     });

    const leg = new THREE.Mesh(legGeometry, legMaterial);
    const legTip = new THREE.Mesh(legTipGeometry, legTipMaterial);

    legTip.position.y = -0.5; 

    const legComplete = new THREE.Object3D();
    legComplete.add(leg);
    legComplete.add(legTip);

    legComplete.translateX(legComplete.position.x > 0 ? 0.75 : -0.75);

    legComplete.userData = this;

    return legComplete;
  }

  addLights() {
    const lightColor = 0xffffff;
    const intensity = 6; // Aumenta la intensidad
    const distance = 15; // Aumenta la distancia
    const decay = 1; // Ajusta la decadencia para una iluminación más uniforme

    const lightPositions = [
      new THREE.Vector3(1, 2.2, 0),
      new THREE.Vector3(-1, 2.2, 0),
      new THREE.Vector3(0, 2.2, 1),
      new THREE.Vector3(0, 2.2, -1),
    ];

    const greenLightColor = 0x00ff00;
    const greenLightIntensity = 6; // Aumenta la intensidad
    const greenLightDistance = 15; // Aumenta la distancia
    const greenLightDecay = 1; // Ajusta la decadencia para una iluminación más uniforme

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
      this.ufo.add(greenLight);
    });

    lightPositions.forEach((position) => {
      const light = new THREE.PointLight(
        lightColor,
        intensity,
        distance,
        decay
      );
      light.position.set(position.x, position.y, position.z);
      this.ufo.add(light);
    });
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

  update(delta) {
    this.animationTime += delta;

    this.ufo.rotation.y += this.rotationSpeed * delta;

    const bobbingMovement = this.bobbingAmplitude * Math.sin(this.animationTime * this.bobbingFrequency);
    this.ufo.position.y = 7 + bobbingMovement; 

    const horizontalMovement = this.horizontalMovementAmplitude * Math.sin(this.animationTime * this.horizontalMovementFrequency);
    this.ufo.position.x = horizontalMovement;
  }
}

export { UFO };
