import * as THREE from "three";
import { CSG } from "../../libs/CSG-v2.js";

class Shield extends THREE.Object3D {

    constructor() {
        super();

        const field = new THREE.Object3D();

        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xc6c6c6 }); // Color del cuerpo
        const frameMaterial = new THREE.MeshPhongMaterial({ color: 0xfcfcfc }); // Color del marco

        const csg1 = this.createFieldMesh(bodyMaterial);
        const csg2 = this.createFieldMesh(frameMaterial);
        const csg3 = this.createFieldMesh(frameMaterial);

        const rood = this.createRood();

        var csg = new CSG();

        csg1.position.set(0, 0, 0);
        csg2.scale.set(0.8, 0.8, 1);
        csg2.position.set(0, 0, 0);
        csg3.scale.set(0.9, 0.9, 0.6);
        csg3.position.set(0, 0, 0);
        rood.position.set(0, 0.5, 0.1);

        csg.subtract([csg1, csg2]);

        const result = csg.toMesh();

        field.add(result);
        field.add(csg3);
        field.add(rood);

        return field;
    }
    

    createFieldBase() {
       
        var baseGeometry = new THREE.CylinderGeometry(2, 2, 0.3, 32);
        var baseMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        var base = new THREE.Mesh(baseGeometry, baseMaterial);
        this.add(base);
        return base;
    }

    createSquare() {
        var squareGeometry = new THREE.BoxGeometry(4, 3, 0.3);
        var squareMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
        var square = new THREE.Mesh(squareGeometry, squareMaterial);
        this.add(square);
        return square;
    }

    createCilinder() {

        var cilinderGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 32);
        var cilinderMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00 });

        cilinderGeometry.rotateX(Math.PI / 2);
       
        var cilinder = new THREE.Mesh(cilinderGeometry, cilinderMaterial);
        this.add(cilinder);
        return cilinder;
    }

    createRood() {
        var boxGeometry1 = new THREE.BoxGeometry(2, 0.3, 1);
        var boxGeometry2 = new THREE.BoxGeometry(0.3, 2, 1);
        var boxMaterial = new THREE.MeshPhongMaterial({ color: 0xCB3234 });

        var box = new THREE.Mesh(boxGeometry1, boxMaterial);
        var box2 = new THREE.Mesh(boxGeometry2, boxMaterial);
        
        var csg = new CSG();
        
        csg.union([box, box2]);

        box = csg.toMesh();
        
        return box;
    }

    createFieldMesh(material) {
        const base = this.createFieldBase();
        const square = this.createSquare();
        const cilinder = this.createCilinder();
        const cilinder2 = this.createCilinder();
    
        base.rotateX(Math.PI / 2);
        square.position.set(0, 1.5, 0);
        cilinder.position.set(0, 3, 0);
        cilinder2.position.set(0, 3, 0);
        cilinder.translateX(-2);
        cilinder2.translateX(2);
    
        const csg = new CSG();
        csg.union([base, square]);
        csg.subtract([cilinder, cilinder2]);

        const resultado = csg.toMesh();
        resultado.material = material;
    
        return resultado;
    }
}

export { Shield };