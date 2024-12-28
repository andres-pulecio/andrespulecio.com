import importModels from './importModels.js';

class Keys {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.keys = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const key = new importModels();
        key.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.keys.push(key); // Guardar la referencia
    }

    initKeys() {
        // Configurar teclas
        this.init('../models/keysLeft.glb', 5, 5.2, 1, 2.3, 0.55, 0.5, 0.55, 1, 2);
        this.init('../models/keysUp.glb', 5, 6.4, 1, 1.2, 0.55, 0.5, 0.55, 1, 2);
        this.init('../models/keysRight.glb', 5, 7.6, 1, 2.3, 0.55, 0.5, 0.55, 1, 2);
        this.init('../models/keysDown.glb', 5, 6.4, 1, 2.3, 0.55, 0.5, 0.55, 1, 2);
        this.init('../models/keysR.glb', 5, 5.6, 1, 7.5, 0.55, 0.5, 0.55, 1, 2);
    }

    updateKeys() {
        this.keys.forEach(key => {
            if (key.mesh_param && key.body_param) {
                key.mesh_param.position.copy(key.body_param.position);
                key.mesh_param.quaternion.copy(key.body_param.quaternion);
            }
        });
    }
}

export default Keys;
