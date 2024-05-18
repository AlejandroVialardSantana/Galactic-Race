import * as THREE from "three";

export class SpaceTube {
  constructor() {
    const points = this.createTubePath();
    const path = new THREE.CatmullRomCurve3(points, true);
    const tubeGeometry = new THREE.TubeGeometry(path, 200, 2, 20, true);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../../assets/1.jpg');
    const displacementMap = textureLoader.load('../../assets/2.jpg');

    // Configurar la repetición de las texturas
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    displacementMap.wrapS = THREE.RepeatWrapping;
    displacementMap.wrapT = THREE.RepeatWrapping;

    // Ajustar la cantidad de repetición de las texturas
    const repeatX = 50;
    const repeatY = 7;

    texture.repeat.set(repeatX, repeatY);
    displacementMap.repeat.set(repeatX, repeatY);

    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      map: texture,
      displacementMap: displacementMap,
      displacementScale: 0.06,
      bumpMap: displacementMap,
      bumpScale: 0.04,
      reflectivity: 0,
      shininess: 0
    });

    this.mesh = new THREE.Mesh(tubeGeometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
  }

  createTubePath() {
    const points = [];
    points.push(new THREE.Vector3(0, 5, 10));
    points.push(new THREE.Vector3(-10, 0, 20));
    points.push(new THREE.Vector3(-30, 0, 40));
    points.push(new THREE.Vector3(-50, 0, 20));
    points.push(new THREE.Vector3(-60, 10, 0));
    points.push(new THREE.Vector3(-50, 20, -20));
    points.push(new THREE.Vector3(-30, 20, -40));
    points.push(new THREE.Vector3(-10, 10, -20));
    points.push(new THREE.Vector3(0, 25, 0));
    points.push(new THREE.Vector3(10, 20, 20));
    points.push(new THREE.Vector3(30, 0, 40));
    points.push(new THREE.Vector3(50, 0, 60));
    points.push(new THREE.Vector3(70, 0, 40));
    points.push(new THREE.Vector3(50, 0, 20));
    points.push(new THREE.Vector3(30, 0, 0));
    points.push(new THREE.Vector3(15, -10, -20));
    points.push(new THREE.Vector3(5, -20, -40));
    points.push(new THREE.Vector3(-5, -20, -40));
    points.push(new THREE.Vector3(-10, -10, -20));
    points.push(new THREE.Vector3(0, 0, 0));
    return points;
  }

  getMesh() {
    return this.mesh;
  }

  getGeometry() {
    return this.mesh.geometry;
  }
}