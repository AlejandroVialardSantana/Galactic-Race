import * as THREE from "three";
import { CSG } from "../../libs/CSG-v2.js";
import * as TWEEN from "../../libs/tween.esm.js";

class Robot extends THREE.Object3D {
  constructor(tubeGeometry, t, angularPosition) {
    super();

    this.robot = new THREE.Object3D();
    this.hasFired = false;
    this.damage = 50;

    const metalMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xc3c3c3,
      metalness: 0.8,
      roughness: 0.6,
      reflectivity: 0.8,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    });

    const nonMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.8,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5,
    });

    const base = this.createBase(metalMaterial);
    const wheels = this.createWheels(nonMetalMaterial);
    const backBone = this.createBackBone(nonMetalMaterial);
    const top = this.createTop(metalMaterial);
    const neck = this.createNeck(nonMetalMaterial);
    const head = this.createHead(metalMaterial);
    this.arm = this.createArm(metalMaterial);
    const eye = this.createEye(eyeMaterial);

    this.body = new THREE.Object3D();
    this.armNode = new THREE.Object3D();

    wheels.rotateY(Math.PI / 2);

    this.arm.position.set(-0.05, 0, -0.85);
    this.armNode.position.set(0, 0.8, 0);
    this.armNode.add(this.arm);

    this.body.add(backBone, top, neck, head, eye, this.armNode);
    this.body.rotateY(Math.PI / 2);

    base.position.set(0, 0.2, 0);
    backBone.position.set(0, 0.44, 0);
    eye.position.set(0, 1.3, 0.15);
    head.position.set(0, 0.55, 0);

    this.robot.add(base);
    this.robot.add(wheels);
    this.robot.add(this.body);

    this.robot.position.set(0, 2.1, 0);
    this.robot.rotateY(-Math.PI / 2);

    this.angularPosition = angularPosition;

    this.positionOnTube = new THREE.Object3D();
    this.orientationNode = new THREE.Object3D();

    this.orientationNode.add(this.robot);
    this.positionOnTube.add(this.orientationNode);
    this.add(this.positionOnTube);

    this.positionateOnTube(tubeGeometry, t);
  }

  createBase(material) {
    const geometry = new THREE.CylinderGeometry(0.3, 0.5, 0.3, 20);
    const base = new THREE.Mesh(geometry, material);
    return base;
  }

  createWheels(material) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 20);
    const wheel = new THREE.Mesh(geometry, material);
    const wheel2 = wheel.clone();
    const wheel3 = wheel.clone();
    const wheel4 = wheel.clone();

    wheel.rotateZ(Math.PI / 2);
    wheel2.rotateZ(Math.PI / 2);
    wheel3.rotateZ(Math.PI / 2);
    wheel4.rotateZ(Math.PI / 2);
    wheel.position.set(0.2, 0, 0.2);
    wheel2.position.set(-0.2, 0, 0.2);
    wheel3.position.set(0.2, 0, -0.2);
    wheel4.position.set(-0.2, 0, -0.2);

    const wheels = new THREE.Object3D();
    wheels.add(wheel);
    wheels.add(wheel2);
    wheels.add(wheel3);
    wheels.add(wheel4);

    return wheels;
  }

  createBackBone(material) {
    const geometry = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 20);
    const backBone = new THREE.Mesh(geometry, material);
    return backBone;
  }

  createTop(material) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.7);
    shape.lineTo(0.1, 0.7);
    shape.quadraticCurveTo(0.1, 0.8, 0.3, 0.8);
    shape.lineTo(0.3, 0.9);
    shape.quadraticCurveTo(0.3, 1.1, 0.2, 1.1);
    shape.lineTo(-0.2, 1.1);
    shape.quadraticCurveTo(-0.3, 1.1, -0.3, 0.9);
    shape.lineTo(-0.3, 0.8);
    shape.quadraticCurveTo(-0.1, 0.8, -0.1, 0.7);
    shape.lineTo(0, 0.7);

    const extrudeSettings = {
      depth: 0.02,
      steps: 1,
      curveSegments: 12,
      bevelSegments: 10,
      bevelEnabled: true,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const top = new THREE.Mesh(geometry, material);
    top.scale.set(0.8, 0.8, 0.8);
    top.position.set(0, 0.08, 0);
    return top;
  }

  createHead(material) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 1);
    shape.lineTo(0.15, 1);
    shape.bezierCurveTo(0.25, 1.1, 0.25, 1.4, 0.15, 1.4);
    shape.lineTo(0, 1.4);
    shape.bezierCurveTo(-0.4, 1.25, -0.4, 1.15, 0, 1);

    const extrudeSettings = {
      depth: 0.01,
      steps: 1,
      curveSegments: 12,
      bevelSegments: 10,
      bevelEnabled: true,
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const head = new THREE.Mesh(geometry, material);
    head.scale.set(0.6, 0.6, 0.6);
    head.rotateY(-Math.PI / 2);
    head.position.set(0, 0.56, 0);
    return head;
  }

  createNeck(material) {
    const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 20);
    const neckStick = new THREE.Mesh(geometry, material);
    const neckStick2 = neckStick.clone();

    neckStick.position.set(-0.05, 1.07, 0);
    neckStick2.position.set(0.05, 1.07, 0);

    const neck = new THREE.Object3D();
    neck.add(neckStick);
    neck.add(neckStick2);
    return neck;
  }

  createArm(material) {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 20);
    const arm = new THREE.Mesh(geometry, material);
    const arm2 = arm.clone();

    const shoulderGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 20);
    const shoulderMaterial = material;
    const shoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);

    shoulder.rotateZ(Math.PI / 2);
    shoulder.position.set(0.4, 0.85, 0);

    arm.rotateX(Math.PI / 2);
    arm.position.set(0.55, 0.85, 0.25);

    arm2.scale.set(0.8, 0.8, 0.8);
    arm2.rotateX(Math.PI / 2);
    arm2.position.set(0.55, 0.85, 0.35);

    const csg = new CSG();
    csg.subtract([arm, arm2]);
    const armGroup = csg.toMesh();
    armGroup.add(shoulder);
    armGroup.rotateX(Math.PI / 2);
    return armGroup;
  }

  createEye(material) {
    const geometry = new THREE.SphereGeometry(0.07, 20, 20);
    const eye = new THREE.Mesh(geometry, material);
    return eye;
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

  animateBodyRotation(targetAngle, duration) {
    const currentAngle = this.body.rotation.y;
    const angleDifference = targetAngle - currentAngle;

    new TWEEN.Tween(this.body.rotation)
      .to({ y: Math.PI * 1.5 }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  animateArmLift(lift, duration) {
    const targetRotation = lift ? -Math.PI / 2 : 0;

    new TWEEN.Tween(this.armNode.rotation)
      .to({ x: targetRotation }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  resetRobot(duration) {
    new TWEEN.Tween(this.body.rotation)
      .to({ y: 0 }, duration)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();

    this.animateArmLift(false, duration);
  }
}

export { Robot };
