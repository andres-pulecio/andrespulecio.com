import importModels from './importModels.js';

class Messages {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.messages = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const message = new importModels();
        message.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.messages.push(message); // Guardar la referencia
    }

    initMessages() {
        // Configurar los mensajes
        this.init('../models/keysMessage.glb', 5, 0, 0.05, 3, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/restartMessage.glb', 5, 3, 0.05, 8, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/certificationsMessage.glb', 3, 35, 0.05, 113, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/activitiesMessage.glb', 2, 0, 0.05, 183, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/mailMessage.glb', 3, -15, 0.05, 162, 0.1, 0.1, 0.1, 0, 1);
    }

    updateMessages() {
        this.messages.forEach(message => {
            if (message.mesh_param && message.body_param) {
                message.mesh_param.position.copy(message.body_param.position);
                message.mesh_param.quaternion.copy(message.body_param.quaternion);
            }
        });
    }
}

export default Messages;
