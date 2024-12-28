import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function linkedinAnimation(scene, linkedinAnimationMesh, mixerLinkedin) {
    const linkedinAnimationLoader = new GLTFLoader();
    linkedinAnimationLoader.load('../models/mailAnimation.glb',
        (gltf) => {
            linkedinAnimationMesh = gltf.scene;
            const scale = 3;
            linkedinAnimationMesh.scale.set(
                linkedinAnimationMesh.scale.x * scale,
                linkedinAnimationMesh.scale.y * scale,
                linkedinAnimationMesh.scale.z * scale
            );
            linkedinAnimationMesh.position.set(-15, -10, 162);
            scene.add(linkedinAnimationMesh);

            mixerLinkedin = new THREE.AnimationMixer(linkedinAnimationMesh);
            const clips = gltf.animations;
            clips.forEach((clip) => {
                const action = mixerLinkedin.clipAction(clip);
                action.play();
            });
        }
    );
}

export default linkedinAnimation;
