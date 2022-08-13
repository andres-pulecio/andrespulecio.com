import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

//This class imports loading Bar

class loadingBar {
	init() {
        const progressBar = document.getElementById('progress-bar');

        THREE.DefaultLoadingManager.onProgress = function (url, loaded, total) {
            progressBar.value = (loaded /total) * 100;
        };

        const progressBarContainer = document.querySelector('.progress-bar-container');
        THREE.DefaultLoadingManager.onLoad = function () {
            progressBarContainer.style.display = 'none';
        };

        const gltfLoader = new GLTFLoader(THREE.DefaultLoadingManager);
        const rgbeLoader = new RGBELoader(THREE.DefaultLoadingManager);
    }
}
export default loadingBar;