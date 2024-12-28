import nipplejs from 'nipplejs';

function addJoystick(fwdValue, rgtValue, lftValue, bkdValue, vehicle) {
    const options = {
        zone: document.getElementById('joystickWrapper1'),
        size: 120,
        multitouch: true,
        maxNumberOfNipples: 2,
        mode: 'static',
        restJoystick: true,
        shape: 'circle',
        position: { top: '600px', left: '100px' },
        dynamicPage: true,
    };

    const joyManager = nipplejs.create(options);

    joyManager['0'].on('move', function (evt, data) {
        const forward = data.vector.y;
        const turn = data.vector.x;

        if (forward > 0) {
            fwdValue.current = Math.abs(forward);
            bkdValue.current = 0;
        } else if (forward < 0) {
            fwdValue.current = 0;
            bkdValue.current = Math.abs(forward);
        }

        if (turn > 0) {
            lftValue.current = 0;
            rgtValue.current = Math.abs(turn);
        } else if (turn < 0) {
            lftValue.current = Math.abs(turn);
            rgtValue.current = 0;
        }
    });

    joyManager['0'].on('end', function (evt) {
        bkdValue.current = 0;
        fwdValue.current = 0;
        lftValue.current = 0;
        rgtValue.current = 0;
    });

    updateJoysitck(vehicle, fwdValue.current, rgtValue.current, lftValue.current, bkdValue.current);
}

function updateJoysitck(vehicle, fwdValue, rgtValue, lftValue, bkdValue) {
    vehicle.setBrake(4, 0);
    vehicle.setBrake(4, 1);
    vehicle.setBrake(4, 2);
    vehicle.setBrake(4, 3);

    const engineForce = 1000;
    const maxSteerVal = 0.5;

    if (fwdValue > 0 && rgtValue < 0.5 && lftValue < 0.5) {
        vehicle.applyEngineForce(-engineForce, 2);
        vehicle.applyEngineForce(-engineForce, 3);
        vehicle.applyEngineForce(-engineForce / 2, 0);
        vehicle.applyEngineForce(-engineForce / 2, 1);
    } else if (bkdValue > 0 && rgtValue < 0.5 && lftValue < 0.5) {
        vehicle.applyEngineForce(engineForce, 0);
        vehicle.applyEngineForce(engineForce, 1);
    } else if (rgtValue > 0 && fwdValue < 0.5 && bkdValue < 0.5) {
        vehicle.setSteeringValue(-maxSteerVal, 2);
        vehicle.setSteeringValue(-maxSteerVal, 3);
        vehicle.applyEngineForce(-engineForce, 2);
        vehicle.applyEngineForce(-engineForce, 3);
    } else if (lftValue > 0 && fwdValue < 0.5 && bkdValue < 0.5) {
        vehicle.setSteeringValue(maxSteerVal, 2);
        vehicle.setSteeringValue(maxSteerVal, 3);
        vehicle.applyEngineForce(-engineForce, 2);
        vehicle.applyEngineForce(-engineForce, 3);
    } else {
        vehicle.applyEngineForce(0, 0);
        vehicle.applyEngineForce(0, 1);
        vehicle.applyEngineForce(0, 2);
        vehicle.applyEngineForce(0, 3);
        vehicle.setSteeringValue(0, 2);
        vehicle.setSteeringValue(0, 3);
    }
}

export { addJoystick, updateJoysitck };
