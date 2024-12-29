import * as CANNON from "cannon-es";
function initializePhysics() {
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0);

    const groundMaterial = new CANNON.Material('groundMaterial');
    groundMaterial.friction = 0.25;
    groundMaterial.restitution = 0.25;

    const wheelMaterial = new CANNON.Material('wheelMaterial');
    wheelMaterial.friction = 0.25;
    wheelMaterial.restitution = 0.25;

    return {
        world,
        groundMaterial,
        wheelMaterial,
    };
}

export default initializePhysics;
