import * as CANNON from 'cannon-es';

/**
 * Inicializa el cuerpo del plano en el mundo de física de CANNON.
 * @param {CANNON.World} world - El mundo de física de CANNON.
 * @param {THREE.Mesh} plane - El plano de THREE.js.
 * @param {CANNON.Material} groundMaterial - El material del suelo.
 * @returns {Object} Un objeto con el cuerpo del plano y `q`.
 */
function initializePlaneBody(world, plane, groundMaterial) {
    const q = plane.quaternion;
    const planeBody = new CANNON.Body({
        mass: 0, // mass = 0 hace que el cuerpo sea estático
        material: groundMaterial,
        shape: new CANNON.Plane(),
        quaternion: new CANNON.Quaternion(-q._x, q._y, q._z, q._w)
    });
    world.addBody(planeBody); // Añadir el cuerpo del plano al mundo de física
    return { planeBody, q };
}

export default initializePlaneBody;
