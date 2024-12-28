import importModels from './importModels.js';
class LocationColombia {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.objects = [];
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        const obj = new importModels();
        obj.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
        this.objects.push(obj); // Guardar la referencia
    }

    initObjects() {
        // Configurar location, flag, cup, plate, palm, watermelon, banana
        this.init('../models/location.glb', 1, -8, 0, 100, 1, 2, 0.3, 0, 1);
        this.init('../models/flag.glb', 2.5, -7.6, 0, 99, 0.2, 1.2, 0.2, 0, 1);
        this.init('../models/cup.glb', 1, -4.2, 0.5, 103.7, 0.7, 0.5, 0.7, 1, 1);
        this.init('../models/plate.glb', 1, -4.2, 0, 103.7, 2, 0.4, 2, 1, 1);
        this.init('../models/palm.glb', 2, -11, 0, 96, 0.3, 1.5, 0.3, 0, 1);
        this.init('../models/watermelon.glb', 12, -5, 0.5, 99, 1.1, 1.1, 0.5, 1, 1);
        this.init('../models/banana.glb', 10, -5, 0.5, 97.7, 1, 0.5, 0.5, 1, 1);
    }

    updateObjects() {
        this.objects.forEach(obj => {
            obj.mesh_param.position.copy(obj.body_param.position);
            obj.mesh_param.quaternion.copy(obj.body_param.quaternion);
        });
    }
}

export default LocationColombia;
