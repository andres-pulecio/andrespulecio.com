import * as THREE from 'three';
//This class imports directional lights

class directionalLights {
    constructor() {
        this.mesh_param 
        this.body_param
    }
	init(scene) {
        const AmbientLight = new THREE.AmbientLight( 0xffffff,0.7);
        scene.add( AmbientLight );
    }
}
export default directionalLights;