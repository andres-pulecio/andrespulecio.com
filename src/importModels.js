import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let vehicle, objectPosition,cameraOffset,vehicle1,lightOffset,planeOffset,DirectionalLight,DirectionalLightOffset;

class importModels {
	init(scene) {
        const loaderStone = new GLTFLoader();
        loaderStone.load('../models/stone.glb', 
        (gltf) => {
            const stoneMesh = gltf.scene;
            stoneMesh.scale.set(stoneMesh.scale.x * 0.4, stoneMesh.scale.y * 0.4, stoneMesh.scale.z * 0.4);
            stoneMesh.position.set(0, 0, 2);
            stoneMesh.rotateY(Math.PI/2);
            scene.add(stoneMesh);
        });
    }
}
export default importModels;