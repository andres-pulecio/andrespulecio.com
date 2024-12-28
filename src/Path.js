import importModels from './importModels.js';
class Path {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const tile = new importModels();
        tile.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
    }

    initPaths() {
        // Path start to center
        this.init('../models/tile.glb', 1, -1, 0.05, 9, 1, 0.1, 1, 0, 1);
        this.init('../models/tile.glb', 1, -1.2, 0.05, 15.2, 1, 0.1, 1, 0, 1);
        this.init('../models/tile.glb', 1, 1.8, 0.05, 11.3, 1, 0.1, 1, 0, 1);

        let zPosition, xPosition;
        for (let i = 0; i < 15; i += 1.2) {
            zPosition = 27;
            this.init('../models/tile.glb', 1, -2 + getRndInteger(1, 5), 0, zPosition + (i * 3), 1, 0.1, 1, 0, 1);
        }

        // Path center to projects
        for (let i = 0; i < 30; i += 1.2) {
            zPosition = 72;
            xPosition = 2;
            this.init('../models/tile.glb', 1, xPosition + (i * 3), 0.05, zPosition - 2 + getRndInteger(1, 5), 1, 0.1, 1, 0, 1);
        }

        // Path center to information
        for (let i = 0; i < 35; i += 1.2) {
            zPosition = 74;
            this.init('../models/tile.glb', 1, -2 + getRndInteger(1, 5), 0.05, zPosition + (i * 3), 1, 0.1, 1, 0, 1);
        }

        // Path center to playzone
        for (let i = 0; i > -15; i -= 1.2) {
            zPosition = 72;
            xPosition = -2;
            this.init('../models/tile.glb', 1, xPosition + (i * 3), 0.05, zPosition - 2 + getRndInteger(1, 5), 1, 0.1, 1, 0, 1);
        }

        // Path to studies
        for (let i = 0; i < 30; i += 1.2) {
            zPosition = 125;
            xPosition = 2;
            this.init('../models/tile.glb', 1, xPosition + (i * 3), 0.05, zPosition - 2 + getRndInteger(1, 5), 1, 0.1, 1, 0, 1);
        }
    }
}
//Numero Random
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

export default Path;
