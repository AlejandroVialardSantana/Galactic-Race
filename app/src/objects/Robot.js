import * as THREE from 'three';

import { CSG } from "../../libs/CSG-v2.js";

class Robot extends THREE.Object3D {
    
    constructor() {
        
        super();

        const robot = new THREE.Object3D();

        const base = this.createBase();
        const wheels = this.createWheels();
        const backBone = this.createBackBone();
        const top = this.createTop();
        const neck = this.createNeck();
        const head = this.createHead();
        const arm = this.createArm();
        const eye = this.createEye();

        base.position.set(0, 0.2, 0);
        backBone.position.set(0, 0.44, 0);
        eye.position.set(0, 1.3, 0.15);
        
        robot.add(base);
        robot.add(wheels);
        robot.add(backBone);
        robot.add(top);
        robot.add(neck);
        robot.add(head);
        robot.add(arm);
        robot.add(eye);

        return robot;

    }

    createBase() {
        const geometry = new THREE.CylinderGeometry(0.3, 0.5, 0.3, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0xc3c3c3 });
        const base = new THREE.Mesh(geometry, material);

        return base;
    }

    createWheels() {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
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

    createBackBone() {
        const geometry = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const backBone = new THREE.Mesh(geometry, material);

        return backBone;
    }

    createTop () {
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

        const material = new THREE.MeshStandardMaterial({ color: 0xc3c3c3 });

        const top = new THREE.Mesh(geometry, material);

        top.scale.set(0.8, 0.8, 0.8);
        top.position.set(0, 0.08, 0);

        return top;
    }

    createHead() {

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

        const material = new THREE.MeshStandardMaterial({ color: 0xc3c3c3 });

        const head = new THREE.Mesh(geometry, material);

        head.scale.set(0.6, 0.6, 0.6);
        head.rotateY(-Math.PI / 2);
        head.position.set(0, 0.56, 0);

        return head;
    }

    createNeck() {
        const geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const neckStick = new THREE.Mesh(geometry, material);
        const neckStick2 = neckStick.clone();

        neckStick.position.set(-0.05, 1.07, 0);
        neckStick2.position.set(0.05, 1.07, 0);

        const neck = new THREE.Object3D();
        neck.add(neckStick);
        neck.add(neckStick2);

        return neck;
    }

    createArm() {
        const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.7, 20);
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const arm = new THREE.Mesh(geometry, material);
        const arm2 = arm.clone();

        const shoulderGeometry = new THREE.CylinderGeometry(0.01, 0.01, 0.15, 20);
        const shoulderMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
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

        return armGroup;
    }

    createEye() {
        const geometry = new THREE.SphereGeometry(0.07, 20, 20);
        const material = new THREE.MeshStandardMaterial({
            color: 0xFF0000, 
            transparent: true,
            opacity: 0.5,
          });
        const eye = new THREE.Mesh(geometry, material);

        return eye;
    }
}

export { Robot };