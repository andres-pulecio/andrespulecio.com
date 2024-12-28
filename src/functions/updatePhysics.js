function updatePhysics(world, icosahedron, camera, chassisBody, cameraOffset, sunlight, lightOffset, plane, planeOffset) {
    world.step(1/60);
    
    // Actualizar la posición y rotación del icosaedro
    const icosahedronMesh = icosahedron.getMesh();
    const icosahedronBody = icosahedron.getBody();

    icosahedronMesh.position.copy(icosahedronBody.position);
    icosahedronMesh.quaternion.copy(icosahedronBody.quaternion);
    
    // Actualizar posición de la cámara, luz y el plano según sea necesario
    camera.position.x = chassisBody.position.x + cameraOffset.x;
    camera.position.z = chassisBody.position.z + cameraOffset.z;

    sunlight.position.copy(chassisBody.position).add(lightOffset);
    plane.position.x = chassisBody.position.x + planeOffset.x;
    plane.position.z = chassisBody.position.z + planeOffset.z;
}

export default updatePhysics;
