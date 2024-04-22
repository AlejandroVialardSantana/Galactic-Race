import * as THREE from "three";

export class SpaceTube {
  constructor() {
    const points = this.createTubePath();
    const path = new THREE.CatmullRomCurve3(points, true);
    const tubeGeometry = new THREE.TubeGeometry(path, 200, 2, 20, true);

    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    this.mesh = new THREE.Mesh(tubeGeometry, material);
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
