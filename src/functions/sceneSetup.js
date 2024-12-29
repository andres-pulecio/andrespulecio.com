import * as THREE from 'three';
import directionalLight from '../directionalLight.js';

/**
 * Inicializa el plano y las luces en la escena.
 * @param {THREE.Scene} scene - La escena en la que se añadirá el plano y las luces.
 * @returns {Object} Un objeto con las propiedades plane, lightOffset, y sunlight.
 */
function initializeScene(scene) {
    // Crear la geometría del plano
    const geometry = new THREE.PlaneGeometry(270, 270, 1);

    // Crear el material del plano (color azul, doble cara)
    const material = new THREE.MeshStandardMaterial({color: 0x3498DB, side: THREE.DoubleSide});
    
    // Crear el plano con la geometría y el material
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true; // Permitir que el plano reciba sombras
    plane.rotation.x = Math.PI / 2; // Rotar el plano para que quede horizontal
    scene.add(plane); // Añadir el plano a la escena

    // Crear un vector para la posición de la luz
    const lightOffset = new THREE.Vector3(7, 60, 30);

    // Crear una luz puntual (sol) con intensidad 1.5 y distancia de 120 unidades
    const sunlight = new THREE.PointLight(0xffffff, 1.5, 120);
    scene.add(sunlight); // Añadir la luz puntual a la escena

    // Crear una luz direccional y añadirla a la escena
    const light = new directionalLight();
    light.init(scene);

    // Retornar el plano, el offset de la luz, y la luz del sol
    return {
        plane,
        lightOffset,
        sunlight,
    };
}

export default initializeScene;
