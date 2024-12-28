import importModels from './importModels.js';

class Fence {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.fences = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const fence = new importModels();
        fence.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.fences.push(fence); // Guardar la referencia
    }

    initFences() {
        let zPosition, xPosition;
        for (let i = 0; i > -5; i -= 1.2) {
            zPosition = 53;
            xPosition = -65;
            this.init('../models/fenceWood.glb', 2, xPosition + (i * 7), 0, zPosition - 2, 3.7, 1, 0.4, 0, 1);
        }
        for (let i = 0; i > -5; i -= 1.2) {
            zPosition = 67;
            xPosition = -65;
            this.init('../models/fenceWood.glb', 2, xPosition + (i * 7), 0, zPosition - 2, 3.7, 1, 0.4, 0, 1);
        }
        for (let i = 0; i > -5; i -= 1.2) {
            zPosition = 81;
            xPosition = -65;
            this.init('../models/fenceWood.glb', 2, xPosition + (i * 7), 0, zPosition - 2, 3.7, 1, 0.4, 0, 1);
        }
    }

    updateFences() {
        this.fences.forEach(fence => {
            if (fence.mesh_param && fence.body_param) {
                fence.mesh_param.position.copy(fence.body_param.position);
                fence.mesh_param.quaternion.copy(fence.body_param.quaternion);
            }
        });
    }
}

export default Fence;
