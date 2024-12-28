import importModels from './importModels.js';

class Tree {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        // Aquí irán tus líneas de código originales
        const tree = new importModels();
        tree.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
    }

    initTrees() {
        // Configurar árboles medianos
        this.init('../models/treeMedium.glb', 1, -12, 0, 3, 0.5, 1, 0.5, 0, 1);
        this.init('../models/treeMedium.glb', 1, -14, 0, -7, 0.5, 1, 0.5, 0, 1);
        this.init('../models/treeMedium.glb', 1, 4, 0, -12, 0.5, 1, 0.5, 0, 1);
        this.init('../models/treeMedium.glb', 1, 10, 0, -16, 0.5, 1, 0.5, 0, 1);
        this.init('../models/treeMedium.glb', 1, 18, 0, 150, 0.5, 1, 0.5, 0, 1);
        this.init('../models/treeMedium.glb', 1, 25, 0, 115, 0.5, 1, 0.5, 0, 1);

        // Configurar árboles grandes
        this.init('../models/treeBig.glb', 0.4, -15 , 0, 60, 1.2, 3, 1.8, 0, 1);
        this.init('../models/treeBig2.glb', 0.4, 20, 0, 52, 1.2, 3, 1.8, 0, 1);
        this.init('../models/treeBig.glb', 0.4, 30, 0, 100, 1.2, 3, 1.8, 0, 1);
        this.init('../models/treeBig2.glb', 0.4, -60, 0, 45, 1.2, 3, 1.8, 0, 1);

        // Configurar árboles muertos
        this.init('../models/treeDead1.glb', 0.4, -7 , 0, 150, 0.4, 3, 0.4, 0, 1);
        this.init('../models/treeDead2.glb', 0.4, -7 , 0, 200, 0.4, 3, 0.4, 0, 1);
        this.init('../models/treeDead3.glb', 0.4, -30 , 0, 180, 0.4, 3, 0.4, 0, 1);
        this.init('../models/treeDead2.glb', 0.4, 97 , 0, 70, 0.4, 3, 0.4, 0, 1);
        this.init('../models/treeDead1.glb', 0.4, -5 , 0, -9, 0.4, 3, 0.4, 0, 1);
        this.init('../models/treeDead3.glb', 0.4, -65 , 0, 110, 0.4, 3, 0.4, 0, 1);
    }
}

export default Tree;
