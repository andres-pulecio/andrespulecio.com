import importModels from './importModels.js';

class GameObjects {
    constructor(scene, world, normalMaterial, dominoMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.dominoMaterial = dominoMaterial;
        this.q = q;
        this.dices = [];
        this.dominos = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const obj = new importModels();
        obj.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        if (modelPath.includes('dice')) {
            this.dices.push(obj);
        } else if (modelPath.includes('domino')) {
            this.dominos.push(obj);
        }
    }

    initStoneDecorations() {
        // Inicializar decoraciones de piedra (no se requieren en render)
        this.init('../models/stoneDecoration.glb', 1, -85, 0, 87, 0.8, 0.8, 0.8, 0, 1);
        this.init('../models/stoneDecoration.glb', 1, 25, 0, 155, 0.8, 0.8, 0.8, 0, 1);
    }

    initDices() {
        // Inicializar dados
        this.init('../models/dice.glb', 0.2, -75, 2, 90, 2, 2, 2, 1, 1);
        this.init('../models/dice.glb', 0.2, -78, 2, 93, 2, 2, 2, 1, 1);
    }

    initDominos() {
        // Inicializar dominos
        const xPosition = -90;
        const zPosition = 58;
        const separation = 4;

        for (let i = 0; i < 9; i++) {
            this.init('../models/domino.glb', 40, xPosition - (separation * i), 2.7, zPosition, 0.1, 2.7, 1.5, 1, 1);
        }
    }

    updateDices() {
        this.dices.forEach(dice => {
            if (dice.mesh_param && dice.body_param) {
                dice.mesh_param.position.copy(dice.body_param.position);
                dice.mesh_param.quaternion.copy(dice.body_param.quaternion);
            }
        });
    }

    updateDominos() {
        this.dominos.forEach(domino => {
            if (domino.mesh_param && domino.body_param) {
                domino.mesh_param.position.copy(domino.body_param.position);
                domino.mesh_param.quaternion.copy(domino.body_param.quaternion);
            }
        });
    }
}

export default GameObjects;
