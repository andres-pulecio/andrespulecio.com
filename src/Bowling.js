import importModels from './importModels.js';
import importModelsSphere from './importModelsSphere.js';

class Bowling {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.balls = [];
        this.pins = [];
    }

    initBall(modelPath, mass, x, y, z, scaleX, scaleY) {
        const ball = new importModelsSphere();
        ball.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY);
        this.balls.push(ball); // Guardar la referencia
    }

    initPin(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const pin = new importModels();
        pin.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.pins.push(pin); // Guardar la referencia
    }

    initBowling() {
        // Configurar las bolas de bolos
        this.initBall('../models/bowlingBall.glb', 10, -70, 2, 72, 1, 0.5);
        this.initBall('../models/bowlingBall.glb', 10, -70, 2, 58, 1, 0.5);

        // Configurar los pines
        const xPosition = -90;
        const zPosition = 72;
        const separation = 1;

        this.initPin('../models/pins.glb', 10, xPosition, 2, zPosition, 0.4, 2, 0.4, 0.1, 1);

        this.initPin('../models/pins.glb', 10, xPosition - separation * 1, 2, zPosition + separation * 1, 0.4, 2, 0.4, 0.1, 1);
        this.initPin('../models/pins.glb', 10, xPosition - separation * 1, 2, zPosition - separation * 1, 0.4, 2, 0.4, 0.1, 1);

        this.initPin('../models/pins.glb', 10, xPosition - separation * 2, 2, zPosition + separation * 2, 0.4, 2, 0.4, 0.1, 1);
        this.initPin('../models/pins.glb', 10, xPosition - separation * 2, 2, zPosition, 0.4, 2, 0.4, 0.1, 1);
        this.initPin('../models/pins.glb', 10, xPosition - separation * 2, 2, zPosition - separation * 2, 0.4, 2, 0.4, 0.1, 1);

        this.initPin('../models/pins.glb', 10, xPosition - separation * 3, 2, zPosition + separation * 3, 0.4, 2, 0.4, 0.1, 1);
        this.initPin('../models/pins.glb', 10, xPosition - separation * 3, 2, zPosition + separation * 1, 0.4, 2, 0.4, 0.1, 1);
        this.initPin('../models/pins.glb', 10, xPosition - separation * 3, 2, zPosition - separation * 1, 0.4, 2, 0.4, 0.1, 1);
        this.initPin('../models/pins.glb', 10, xPosition - separation * 3, 2, zPosition - separation * 3, 0.4, 2, 0.4, 0.1, 1);
    }

    updateBowling() {
        this.balls.forEach(ball => {
            if (ball.mesh_param && ball.body_param) {
                ball.mesh_param.position.copy(ball.body_param.position);
                ball.mesh_param.quaternion.copy(ball.body_param.quaternion);
            }
        });

        this.pins.forEach(pin => {
            if (pin.mesh_param && pin.body_param) {
                pin.mesh_param.position.copy(pin.body_param.position);
                pin.mesh_param.quaternion.copy(pin.body_param.quaternion);
            }
        });
    }
}

export default Bowling;
