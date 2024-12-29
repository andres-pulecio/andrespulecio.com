import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function linkedinAnimation(scene, setLinkedinAnimationMesh, setMixerLinkedin) {
    const linkedinAnimationLoader = new GLTFLoader();
    linkedinAnimationLoader.load('../models/mailAnimation.glb', (gltf) => {
        const linkedinAnimationMesh = gltf.scene;
        const scale = 3;
        linkedinAnimationMesh.scale.set(
            linkedinAnimationMesh.scale.x * scale,
            linkedinAnimationMesh.scale.y * scale,
            linkedinAnimationMesh.scale.z * scale
        );
        linkedinAnimationMesh.position.set(-15, -10, 162);
        scene.add(linkedinAnimationMesh);

        const mixerLinkedin = new THREE.AnimationMixer(linkedinAnimationMesh);
        const clips = gltf.animations;
        clips.forEach((clip) => {
            const action = mixerLinkedin.clipAction(clip);
            action.play();
        });

        // Actualizar las referencias en el archivo principal
        setLinkedinAnimationMesh(linkedinAnimationMesh);
        setMixerLinkedin(mixerLinkedin);
    });
}

export default linkedinAnimation;
