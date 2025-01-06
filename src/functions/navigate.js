function navigate(e, vehicle, chassisBody) {
    if (e.type !== 'keydown' && e.type !== 'keyup') return;

    const keyup = e.type === 'keyup';
    vehicle.setBrake(0, 0);
    vehicle.setBrake(0, 1);
    vehicle.setBrake(0, 2);
    vehicle.setBrake(0, 3);

    const engineForce = 1500;
    const maxSteerVal = 0.7;

    switch (e.keyCode) {
        case 38: // forward
            vehicle.applyEngineForce(keyup ? 0 : -engineForce / 2, 0);
            vehicle.applyEngineForce(keyup ? 0 : -engineForce / 2, 1);
            vehicle.applyEngineForce(keyup ? 0 : -engineForce, 2);
            vehicle.applyEngineForce(keyup ? 0 : -engineForce, 3);
            break;
        
        case 40: // backward
            vehicle.applyEngineForce(keyup ? 0 : engineForce / 2, 0);
            vehicle.applyEngineForce(keyup ? 0 : engineForce / 2, 1);
            vehicle.applyEngineForce(keyup ? 0 : engineForce, 2);
            vehicle.applyEngineForce(keyup ? 0 : engineForce, 3);
            break;
        
        case 39: // right
            vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 2);
            vehicle.setSteeringValue(keyup ? 0 : -maxSteerVal, 3);
            break;
        
        case 37: // left
            vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 2);
            vehicle.setSteeringValue(keyup ? 0 : maxSteerVal, 3);
            break;
        
        case 82: // restart
            chassisBody.position.set(0, 5, 0);
            chassisBody.quaternion.set(0, 0, 0, 1);
            break;
        case 32: // space
            vehicle.setBrake(1000000, 0);
            vehicle.setBrake(1000000, 1);
            break;
    }
}

export default navigate;
