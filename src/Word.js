import importModels from './importModels.js';
class Word {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
        this.words = []; // Guardar las referencias a las letras y la palabra completa
        this.xPosition = -18;
        this.zPosition = 18;
        this.modelscale = 1;
        this.xScale = 1.5;
        this.yScale = 1.5;
        this.zScale = 0.5;
        this.modelMass = 1;
        this.rotation = 1;
    }

    init(modelPath, xOffset, scaleOverride = null) {
        const scaleX = scaleOverride ? scaleOverride.x : this.xScale;
        const scaleY = scaleOverride ? scaleOverride.y : this.yScale;
        const scaleZ = scaleOverride ? scaleOverride.z : this.zScale;
        const model = new importModels();
        model.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, this.modelscale, this.xPosition + xOffset, 1, this.zPosition, scaleX, scaleY, scaleZ, this.modelMass, this.rotation);
        this.words.push(model); // Guardar la referencia
    }

    initWords() {
        this.init('../models/A.glb', 0);
        this.init('../models/N.glb', this.xScale * 2);
        this.init('../models/D.glb', this.xScale * 4);
        this.init('../models/R.glb', this.xScale * 6);
        this.init('../models/E.glb', this.xScale * 8);
        this.init('../models/S.glb', this.xScale * 10);
        this.init('../models/P.glb', this.xScale * 13);
        this.init('../models/U.glb', this.xScale * 15);
        this.init('../models/L.glb', this.xScale * 17);
        this.init('../models/E.glb', this.xScale * 19);
        this.init('../models/C.glb', this.xScale * 21);
        this.init('../models/I.glb', this.xScale * 23.3, { x: 0.6, y: this.yScale, z: this.zScale });
        this.init('../models/O.glb', this.xScale * 25.3);
        // this.init('../models/DEVOPS.glb', 27, { x: 3.5, y: 0.3, z: 1 });
    }

    updateWords() {
        this.words.forEach(word => {
            word.mesh_param.position.copy(word.body_param.position);
            word.mesh_param.quaternion.copy(word.body_param.quaternion);
        });
    }
}

export default Word;

