import * as CANNON from "cannon-es";
import * as THREE from 'three';

class Icosahedron {
    constructor(world, scene, normalMaterial, position = {x: -85, y: 1, z: 93}, mass = 1, size = 1) {
        this.world = world;
        this.scene = scene;
        this.normalMaterial = normalMaterial;
        this.position = position;
        this.mass = mass;
        this.size = size;

        this.createPhysicsBody();
        this.createVisualBody();
    }

    createPhysicsBody() {
        // Crear la forma del icosaedro
        const icosahedronShape = new CANNON.Box(new CANNON.Vec3(this.size, this.size, this.size));
        this.icosahedronBody = new CANNON.Body({ mass: this.mass });
        this.icosahedronBody.addShape(icosahedronShape);
        this.icosahedronBody.position.set(this.position.x, this.position.y, this.position.z);
        this.icosahedronBody.angularVelocity.set(0, 0, 0); // Velocidad angular inicial

        // Agregar el cuerpo al mundo
        this.world.addBody(this.icosahedronBody);
    }

    createVisualBody() {
        // Crear la geometría y el mesh del icosaedro
        const icosahedronGeometry = new THREE.IcosahedronGeometry(this.size, 0);
        this.icosahedronMesh = new THREE.Mesh(icosahedronGeometry, this.normalMaterial);
        this.icosahedronMesh.castShadow = true;

        // Agregar el mesh a la escena
        this.scene.add(this.icosahedronMesh);
    }

    getMesh() {
        return this.icosahedronMesh;
    }

    getBody() {
        return this.icosahedronBody;
    }
}

export default Icosahedron;
