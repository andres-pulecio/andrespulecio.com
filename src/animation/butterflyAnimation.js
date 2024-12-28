import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function initializeButterflyAnimation(scene, setButterflyMesh, setMixerButterfly) {
    const clockButterfly = new THREE.Clock();
    const clockMail = new THREE.Clock();
    const clockLinkedin = new THREE.Clock();
    const clockGithub = new THREE.Clock();

    const animation = new GLTFLoader();
    animation.load('../models/butterfly.glb', (gltf) => {
        const butterflyMesh = gltf.scene;
        const scale = 0.4;
        butterflyMesh.scale.set(
            butterflyMesh.scale.x * scale,
            butterflyMesh.scale.y * scale,
            butterflyMesh.scale.z * scale
        );
        butterflyMesh.position.set(-13, 1, 98);
        scene.add(butterflyMesh);
        
        const mixerButterfly = new THREE.AnimationMixer(butterflyMesh);
        const clips = gltf.animations;
        clips.forEach((clip) => {
            const action = mixerButterfly.clipAction(clip);
            action.play();
        });

        // Actualizar las referencias en el archivo principal
        setButterflyMesh(butterflyMesh);
        setMixerButterfly(mixerButterfly);
    });

    return { clockButterfly, clockMail, clockLinkedin, clockGithub };
}

export default initializeButterflyAnimation;
