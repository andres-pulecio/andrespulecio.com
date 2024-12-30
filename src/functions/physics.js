import * as CANNON from "cannon-es"; // Importar el módulo cannon-es para la física

/**
 * Inicializa el mundo de física de CANNON y los materiales de contacto.
 * @returns {Object} Un objeto con las propiedades world, groundMaterial, y wheelMaterial.
 */
function initializePhysics() {
    // Crear un nuevo mundo de física
    const world = new CANNON.World();
    // Configurar la gravedad del mundo
    // world.gravity.set(0, -9.82, 0); // La gravedad es negativa en el eje Y (hacia abajo)
    world.gravity.set(0, -30, 0); // La gravedad es mas fuerte para mayor control en el eje Y (hacia abajo)

    // Crear material para el suelo
    const groundMaterial = new CANNON.Material('groundMaterial');
    groundMaterial.friction = 0.25; // Configurar la fricción del material del suelo
    groundMaterial.restitution = 0.25; // Configurar la restitución (rebote) del material del suelo

    // Crear material para las ruedas
    const wheelMaterial = new CANNON.Material('wheelMaterial');
    wheelMaterial.friction = 0.25; // Configurar la fricción del material de las ruedas
    wheelMaterial.restitution = 0.025; // Configurar la restitución (rebote) del material de las ruedas

    // Retornar los objetos inicializados
    return {
        world,
        groundMaterial,
        wheelMaterial,
    };
}

export default initializePhysics; // Exportar la función por defecto
