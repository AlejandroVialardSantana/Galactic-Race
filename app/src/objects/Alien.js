import * as THREE from "three";

class Alien extends THREE.Object3D {
  constructor(tubeGeometry, t, angularPosition) {
    super();

    this.points = 100;
    this.collided = false;

    this.material = new THREE.MeshPhongMaterial({ color: 0xcf0000 });
    this.figure = this.createAlien();
    this.figure.position.set(0, 2.7, 0);
    this.figure.rotateY(Math.PI);

    this.angularPosition = angularPosition;

    this.positionOnTube = new THREE.Object3D();
    this.orientationNode = new THREE.Object3D();

    this.orientationNode.add(this.figure);
    this.positionOnTube.add(this.orientationNode);
    this.add(this.positionOnTube);

    this.positionateOnTube(tubeGeometry, t);
  
    this.positionOnTube.userData = this;
  }

  createAlien() {
    const alien = new THREE.Object3D();

    const antenna = this.createAntenna();
    const head = this.createHead();
    const eye   = this.createEyes();
    const eye2  = eye.clone();
    const neck  = this.createNeck();
    const body  = this.createBody();
    const feet  = this.createFeets();
    const feet2 = feet.clone();

    antenna.position.set(0, 0.2, 0);
    head.position.set(0, 0, 0);
    eye.position.set(-0.1, -0.08, 0.1);
    eye2.position.set(0.1, -0.08, 0.1);
    eye.rotateZ(Math.PI / 3);
    eye2.rotateZ(-Math.PI / 3);
    neck.position.set(0, -0.3, 0);
    body.scale.set(0.7, 0.7, 0.7);
    body.position.set(0, -0.37, 0);
    feet.rotateX(Math.PI / 2);
    feet2.rotateX(Math.PI / 2);
    feet.rotateZ(Math.PI / 2);
    feet2.rotateZ(Math.PI / 2);
    feet.position.set(-0.13 , -0.57, 0);
    feet2.position.set(0.13, -0.57, 0);

    alien.add(antenna);
    alien.add(head);
    alien.add(eye);
    alien.add(eye2);
    alien.add(neck);
    alien.add(body);
    alien.add(feet);
    alien.add(feet2);

    alien.position.set(0, 0.3, 0);
    
    return alien;
  }

  createHead() {
    const shape = new THREE.Shape();
    shape.moveTo(-0.2, 0);
    shape.bezierCurveTo(-0.2, 0.2, 0.2, 0.2, 0.2, 0);
    shape.bezierCurveTo(0.2, -0.35, -0.2, -0.35, -0.2, 0);

    shape.bezierCurveTo;

    const points = shape.extractPoints().shape;

    const geometry = new THREE.LatheGeometry(points, 32);

    const material = new THREE.MeshBasicMaterial({ color: 0x008000 });

    const head = new THREE.Mesh(geometry, material);

    return head;
  }

  createEyes() {
    const eye = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(0.05, 32, 32);

    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const sphere = new THREE.Mesh(geometry, material);

    sphere.scale.set(1.5, 3.5, 1.5);

    eye.add(sphere);

    return eye;
  }

  createNeck() {
    const geometry = new THREE.CylinderGeometry(0.05, 0.05, 0.1, 32);

    const material = new THREE.MeshBasicMaterial({ color: 0x008000 });

    const cylinder = new THREE.Mesh(geometry, material);

    return cylinder;
  }

   createBody() {
    const shape = new THREE.Shape();
    shape.moveTo(-0.2, 0);
    shape.bezierCurveTo(-0.2, 0.2, 0.2, 0.2, 0.2, 0);
    shape.bezierCurveTo(0.2, -0.35, -0.2, -0.35, -0.2, 0);

    shape.bezierCurveTo;

    const points = shape.extractPoints().shape;

    const geometry = new THREE.LatheGeometry(points, 32);

    const material = new THREE.MeshBasicMaterial({ color: 0x008000 });

    const body = new THREE.Mesh(geometry, material);

    return body;
  }

  createFeets() {
    const leg = new THREE.Object3D();

    const geometry = new THREE.SphereGeometry(0.05, 32, 32);

    const material = new THREE.MeshBasicMaterial({ color: 0x008000 });

    const sphere = new THREE.Mesh(geometry, material);

    sphere.scale.set(2.5, 2.5, 1.5);

    leg.add(sphere);

    return leg;
  }

  createAntenna() {
    const antenna = new THREE.Object3D();

    const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32);
    const geometry2 = new THREE.TorusGeometry(0.02, 0.01, 16, 100);

    const material = new THREE.MeshBasicMaterial({ color: 0x008000 });

    const cylinder = new THREE.Mesh(geometry, material);
    const torus = new THREE.Mesh(geometry2, material);

    torus.position.set(0, 0.07, 0);

    antenna.add(cylinder);
    antenna.add(torus);

    return antenna;
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

export { Alien };
