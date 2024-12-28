import importModels from './importModels.js';

class Stone {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        // Aquí irán tus líneas de código originales
        const stone = new importModels();
        stone.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
    }

    initStones() {
        // Configurar piedras grandes
        this.init('../models/stoneBig.glb', 1, -8, 0, 0, 0.8, 0.8, 0.8, 0, 1);
        this.init('../models/stoneBig.glb', 1, -12, 0, -4, 0.8, 0.8, 0.8, 0, 1);
        this.init('../models/stoneBig.glb', 1, 4, 0, -8, 0.8, 0.8, 0.8, 0, 1);
        this.init('../models/stoneBig.glb', 1, 7, 0, 23, 0.8, 0.8, 0.8, 0, 1);

        // Configurar piedras medianas
        this.init('../models/stoneMedium.glb', 2, -10, 0, 2, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/stoneMedium.glb', 2, 5.8, 0, -5.8, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/stoneMedium.glb', 1, 10, 0, 5, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/stoneMedium.glb', 1, 8, 0, 21.3, 0.1, 0.1, 0.1, 0, 1);

        // Configurar piedras pequeñas
        this.init('../models/stoneSmall.glb', 3, -6, 0, 3, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/stoneSmall.glb', 3, -7, 0, -3, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/stoneSmall.glb', 3, 11, 0, 5.5, 0.1, 0.1, 0.1, 0, 1);
        this.init('../models/stoneSmall.glb', 3, -2, 0, 17, 0.1, 0.1, 0.1, 0, 1);
    }
}

export default Stone;
