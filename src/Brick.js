import importModels from './importModels.js';

class Brick {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.bricks = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const brick = new importModels();
        brick.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.bricks.push(brick); // Guardar la referencia
    }

    initBricks() {
        // Configurar ladrillos del primer muro
        let xPosition = -16;
        let zPosition = 6;
        let modelscale = 0.6;
        let xScale = 1.08;
        let yScale = 0.42;
        let zScale = 0.6;
        let modelMass = 0.5;
        let rotation = 2;

        this.init('../models/brick.glb', modelscale, xPosition + 0, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale * 2, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale * 4, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale * 3, 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale, 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);

        // Configurar ladrillos del segundo muro
        xPosition = 14;
        zPosition = -12;

        this.init('../models/brick.glb', modelscale, xPosition + 0, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale * 2, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale * 4, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale * 3, 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);
        this.init('../models/brick.glb', modelscale, xPosition + xScale, 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);
    }

    updateBricks() {
        this.bricks.forEach(brick => {
            if (brick.mesh_param && brick.body_param) {
                brick.mesh_param.position.copy(brick.body_param.position);
                brick.mesh_param.quaternion.copy(brick.body_param.quaternion);
            }
        });
    }
}

export default Brick;
