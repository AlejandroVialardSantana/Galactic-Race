// SpaceTube.js
import * as THREE from "three";

export class SpaceTube {
  constructor() {
    const points = this.createTubePath(); // Crea un camino con puntos
    const path = new THREE.CatmullRomCurve3(points, true); // La curva se cierra
    const tubeGeometry = new THREE.TubeGeometry(path, 200, 2, 20, true); // true para cerrar el tubo

    const material = new THREE.MeshPhongMaterial({ color: 0xff0000 }); // Material rojo para el ejemplo
    this.mesh = new THREE.Mesh(tubeGeometry, material);
  }

  createTubePath() {
    const points = [];
  
    // Empezar con una curva hacia la izquierda
    points.push(new THREE.Vector3(0, 10, 10));
    points.push(new THREE.Vector3(-10, 0, 20));
    points.push(new THREE.Vector3(-30, 0, 40));
    points.push(new THREE.Vector3(-50, 0, 20));
  
    // Curva hacia arriba y hacia la derecha
    points.push(new THREE.Vector3(-60, 10, 0));
    points.push(new THREE.Vector3(-50, 20, -20));
    points.push(new THREE.Vector3(-30, 20, -40));
    points.push(new THREE.Vector3(-10, 10, -20));
  
    // Volver al centro y girar a la derecha
    points.push(new THREE.Vector3(0, 25, 0));
    points.push(new THREE.Vector3(10, 20, 20));
    points.push(new THREE.Vector3(30, 0, 40));
  
    // Pequeño bucle
    points.push(new THREE.Vector3(50, 0, 60));
    points.push(new THREE.Vector3(70, 0, 40));
    points.push(new THREE.Vector3(50, 0, 20));
  
    // Curva amplia a la derecha y vuelta al origen
    points.push(new THREE.Vector3(30, 0, 0));
    points.push(new THREE.Vector3(10, -10, -20));
    points.push(new THREE.Vector3(0, -20, -40));
    points.push(new THREE.Vector3(-10, -10, -20));
    points.push(new THREE.Vector3(0, 0, 0));
  
    return points;
  }

  getMesh() {
    return this.mesh;
  }
}
