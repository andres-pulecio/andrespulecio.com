import * as THREE from 'three';
//This class imports directional lights

class directionalLights {
    constructor() {
        this.mesh_param 
        this.body_param
    }
	init(scene) {
        const DirectionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
        DirectionalLight.position.set(-10, 5, 5)
        DirectionalLight.target.position.set(0,0,0);
        scene.add( DirectionalLight );
        scene.add( DirectionalLight.target );
        
        const AmbientLight = new THREE.AmbientLight( 0xffffff,0.5);
        scene.add( AmbientLight );
    }
}
export default directionalLights;