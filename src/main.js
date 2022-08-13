import world from './world.js';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { LoadingManager } from 'three';

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

const World = new world();
World.init();
