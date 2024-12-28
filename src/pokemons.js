import importModels from './importModels.js';
class Pokemons {
    constructor(scene, world, normalMaterial, q) {
        this.scene = scene;
        this.world = world;
        this.normalMaterial = normalMaterial;
        this.q = q;
    }

    init(modelPath, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY) {
        // Aquí irán tus líneas de código originales
        const skill = new importModels();
        skill.init(modelPath, this.scene, this.world, this.normalMaterial, this.q, mass, x, y, z, scaleX, scaleY, scaleZ, rotationX, rotationY);
    }

    initPokemons() {
        // Configurar hightSkills (Charizard)
        this.init('../models/hightSkills.glb', 0.07, -45, 0.05, 123, 2.5, 2.5, 2, 0, 1);

        // Configurar mediumSkills (Charmeleon)
        this.init('../models/mediumSkills.glb', 0.07, -30, 0.05, 123, 2.5, 2.5, 2, 0, 1);

        // Configurar basicSkills (Charmander)
        this.init('../models/basicSkills.glb', 0.07, -15, 0.05, 123, 2.5, 2.5, 2, 0, 1);
    }
}

export default Pokemons;
