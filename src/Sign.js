import importModels from './importModels.js';
class Sign {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const sign = new importModels();
        sign.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
    }

    initSigns() {
        // Configurar los letreros
        this.init('../models/signInformation.glb', 0.4, -5, 0, 80, 0.2, 2, 0.2, 0, 1);
        this.init('../models/signPlayzone.glb', 0.4, -8, 0, 65, 0.2, 2, 0.2, 0, 1);
        this.init('../models/signProjects.glb', 0.4, 10, 0, 64, 0.2, 2, 0.2, 0, 1);
        this.init('../models/signStudies.glb', 0.4, 6, 0, 120, 0.2, 2, 0.2, 0, 1);
        this.init('../models/signSkills.glb', 0.4, -6, 0, 120, 0.2, 2, 0.2, 0, 1);
        this.init('../models/signContact.glb', 0.4, -6, 0, 155, 0.2, 2, 0.2, 0, 1);
        this.init('../models/signConstruction.glb', 2.6, 91, 0, 68, 0.2, 2, 0.2, 0, 1);
    }
}

export default Sign;
