import * as THREE from "three";
import { CSG } from "../../libs/CSG-v2.js";

class Shield extends THREE.Object3D {
  constructor() {
    super();

    this.shield = new THREE.Object3D();

    const base = this.createFieldBase();
    const rood = this.createRood();
    const rivets = this.createRivets();

    this.shield.add(base);
    this.shield.add(rood);
    this.shield.add(...rivets);

    this.shield.position.set(0, 2.4, 0);
    this.shield.scale.set(0.3, 0.3, 0.3);

    this.add(this.shield);
  }

  createFieldBase() {
    var shape = this.createShieldShape();
    var baseMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
      reflectivity: 0.9,
    });
    var detailMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcccccc,
      metalness: 0.6,
      roughness: 0.4,
      reflectivity: 0.7,
    });

    var base = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.12,
        steps: 1,
        curveSegments: 10,
        bevelEnabled: true,
      }),
      baseMaterial
    );
    base.position.set(0, 0, -0.05);

    var baseDetail = this.createDetail(
      shape,
      detailMaterial,
      0.85,
      0,
      0.2,
      0.44
    );

    var baseDetailOpposite = this.createDetail(
      shape,
      detailMaterial,
      0.85,
      0,
      0.2,
      -0.49
    );

    var baseFront = this.createDetail(
      shape,
      detailMaterial,
      0.85,
      0,
      0.2,
      -0.06,
      0.92
    );

    var csg = new CSG();
    csg.subtract([base, baseDetail, baseDetailOpposite]);
    var shield = csg.toMesh();
    shield.add(baseFront);

    shield.position.set(0, -1.15, 0);

    return shield;
  }

  createShieldShape() {
    var shape = new THREE.Shape();

    shape.moveTo(0, 0);
    shape.lineTo(0.7, 0.3);
    shape.quadraticCurveTo(1, 0.3, 1, 1.9);
    shape.quadraticCurveTo(0.6, 2, 0.6, 2.3);
    shape.lineTo(-0.6, 2.3);
    shape.quadraticCurveTo(-0.6, 2, -1, 1.9);
    shape.quadraticCurveTo(-1, 0.3, -0.7, 0.3);

    return shape;
  }

  createDetail(shape, material, scale, posX, posY, posZ, scaleZ = 1) {
    var geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.13,
      steps: 1,
      bevelEnabled: true,
    });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(scale, scale, scaleZ);
    mesh.position.set(posX, posY, posZ);
    return mesh;
  }

  createRood() {
    var boxGeometry1 = new THREE.BoxGeometry(1, 0.3, 0.8);
    var boxGeometry2 = new THREE.BoxGeometry(0.3, 1, 0.8);
    var boxMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xcb3234,
      metalness: 0.7,
      roughness: 0.3,
      reflectivity: 0.6,
    });

    var boxVertical = new THREE.Mesh(boxGeometry1, boxMaterial);
    var boxHorizontal = new THREE.Mesh(boxGeometry2, boxMaterial);

    var csg = new CSG();
    csg.union([boxVertical, boxHorizontal]);

    var rood = csg.toMesh();

    return rood;
  }

  createRivets() {
    var rivetGeometry = new THREE.SphereGeometry(0.04, 32, 32);
    var rivetMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      metalness: 0.9,
      roughness: 0.1,
      reflectivity: 0.5,
    });

    var rivet1 = new THREE.Mesh(rivetGeometry, rivetMaterial);
    rivet1.position.set(0.94, 0.72, 0.25);

    var rivet2 = new THREE.Mesh(rivetGeometry, rivetMaterial);
    rivet2.position.set(-0.94, 0.72, 0.25);

    var rivet3 = new THREE.Mesh(rivetGeometry, rivetMaterial);
    rivet3.position.set(0, -1.05, 0.25);

    var rivet4 = new THREE.Mesh(rivetGeometry, rivetMaterial);
    rivet4.position.set(0.97, 0.74, -0.23);

    var rivet5 = new THREE.Mesh(rivetGeometry, rivetMaterial);
    rivet5.position.set(-0.97, 0.74, -0.23);

    var rivet6 = new THREE.Mesh(rivetGeometry, rivetMaterial);
    rivet6.position.set(0, -1.1, -0.23);

    return [rivet1, rivet2, rivet3, rivet4, rivet5, rivet6];
  }
}

export { Shield };
