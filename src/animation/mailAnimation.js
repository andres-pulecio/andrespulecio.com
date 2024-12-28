import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function mailAnimation(scene, mailAnimationMesh, mixerMail) {
    const mailAnimationLoader = new GLTFLoader();
    mailAnimationLoader.load('../models/mailAnimation.glb',
        (gltf) => {
            mailAnimationMesh = gltf.scene;
            const scale = 3;
            mailAnimationMesh.scale.set(
                mailAnimationMesh.scale.x * scale,
                mailAnimationMesh.scale.y * scale,
                mailAnimationMesh.scale.z * scale
            );
            mailAnimationMesh.position.set(-15, -10, 162);
            scene.add(mailAnimationMesh);

            mixerMail = new THREE.AnimationMixer(mailAnimationMesh);
            const clips = gltf.animations;
            clips.forEach((clip) => {
                const action = mixerMail.clipAction(clip);
                action.play();
            });
        }
    );
}

export default mailAnimation;
