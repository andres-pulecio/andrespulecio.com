import importModels from './importModels.js';
class Cone {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.cones = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const cone = new importModels();
        cone.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.cones.push(cone); // Guardar la referencia
    }

    initCones() {
        // Configurar los conos
        this.init('../models/cone.glb', 2, 85, 1, 70, 0.4, 0.9, 0.4, 1, 1);
        this.init('../models/cone.glb', 2, 85, 1, 72, 0.4, 0.9, 0.4, 1, 1);
        this.init('../models/cone.glb', 2, 85, 1, 74, 0.4, 0.9, 0.4, 1, 1);
        this.init('../models/cone.glb', 2, 85, 1, 76, 0.4, 0.9, 0.4, 1, 1);
    }

    updateCones() {
        this.cones.forEach(cone => {
            cone.mesh_param.position.copy(cone.body_param.position);
            cone.mesh_param.quaternion.copy(cone.body_param.quaternion);
        });
    }
}

export default Cone;
