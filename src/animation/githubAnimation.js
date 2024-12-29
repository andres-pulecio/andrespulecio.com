import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function githubAnimation(scene, setGithubAnimationMesh, setMixerGithub) {
    const githubAnimationLoader = new GLTFLoader();
    githubAnimationLoader.load('../models/mailAnimation.glb', (gltf) => {
        const githubAnimationMesh = gltf.scene;
        const scale = 3;
        githubAnimationMesh.scale.set(
            githubAnimationMesh.scale.x * scale,
            githubAnimationMesh.scale.y * scale,
            githubAnimationMesh.scale.z * scale
        );
        githubAnimationMesh.position.set(-15, -10, 162);
        scene.add(githubAnimationMesh);

        const mixerGithub = new THREE.AnimationMixer(githubAnimationMesh);
        const clips = gltf.animations;
        clips.forEach((clip) => {
            const action = mixerGithub.clipAction(clip);
            action.play();
        });

        // Actualizar las referencias en el archivo principal
        setGithubAnimationMesh(githubAnimationMesh);
        setMixerGithub(mixerGithub);
    });
}

export default githubAnimation;
