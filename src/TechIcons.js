import importModels from './importModels.js';
class TechIcons {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.icons = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const icon = new importModels();
        icon.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.icons.push(icon); // Guardar la referencia
    }

    initIcons() {
        // Configurar python, linuxPenguin, github, linkedin y mailbox
        this.init('../models/python.glb', 0.08, 59, 2.5, 113, 2.6, 2.6, 0.5, 1, 1);
        this.init('../models/linuxPenguin.glb', 0.15, 72, 2, 113, 1.5, 2, 1, 1, 1);
        this.init('../models/github.glb', 0.6, -33, 4, 156, 1.5, 3.8, 1.5, 1, 1);
        this.init('../models/linkedin.glb', 1, -24, 2.5, 156, 2.6, 2.6, 1, 1, 1);
        this.init('../models/mailbox.glb', 0.02, -15, 0, 156, 0.3, 2, 0.3, 0, 1);
    }

    updateIcons() {
        this.icons.forEach(icon => {
            if (icon.mesh_param && icon.body_param) {
                icon.mesh_param.position.copy(icon.body_param.position);
                icon.mesh_param.quaternion.copy(icon.body_param.quaternion);
            }
        });
    }
}

export default TechIcons;
