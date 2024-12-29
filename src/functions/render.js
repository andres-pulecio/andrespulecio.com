import { addJoystick, updateJoysitck } from './joystick.js';
import updatePhysics from './updatePhysics.js';
import mixers from '../animation/mixers.js';
import contactLinks from './contactLinks.js';

function render(
    scene, camera, renderer, CarMesh, chassisBody, world, icosahedron, vehicle,
    fwdValue, rgtValue, lftValue, bkdValue, cameraOffset, sunlight, lightOffset,
    plane, planeOffset, words, locationColombia, cones, techIcons, bowling, 
    gameObjects, bricks, keys, messages, mixerButterfly, clockButterfly,
    mixerMail, clockMail, mailAnimationMesh, mixerLinkedin, clockLinkedin,
    linkedinAnimationMesh, mixerGithub, githubAnimationMesh
) {
    if (screen.width <= 700) {
        addJoystick(fwdValue, rgtValue, lftValue, bkdValue, vehicle);
    }          

    requestAnimationFrame(() => render(
        scene, camera, renderer, CarMesh, chassisBody, world, icosahedron, vehicle,
        fwdValue, rgtValue, lftValue, bkdValue, cameraOffset, sunlight, lightOffset,
        plane, planeOffset, words, locationColombia, cones, techIcons, bowling,
        gameObjects, bricks, keys, messages, mixerButterfly, clockButterfly,
        mixerMail, clockMail, mailAnimationMesh, mixerLinkedin, clockLinkedin,
        linkedinAnimationMesh, mixerGithub, githubAnimationMesh
    ));

    renderer.render(scene, camera);

    if (CarMesh && CarMesh.position && CarMesh.quaternion) {
        CarMesh.position.copy(chassisBody.position);
        CarMesh.quaternion.copy(chassisBody.quaternion);
    } else {
        console.error('CarMesh or its properties are not defined');
    }

    updatePhysics(world, icosahedron, camera, chassisBody, cameraOffset, sunlight, lightOffset, plane, planeOffset);

    if (words) words.updateWords();
    if (locationColombia) locationColombia.updateObjects();
    if (cones) cones.updateCones();
    if (techIcons) techIcons.updateIcons();
    if (bowling) bowling.updateBowling();
    if (gameObjects) {
        gameObjects.updateDices();
        gameObjects.updateDominos();
    }
    if (bricks) bricks.updateBricks();
    if (keys) keys.updateKeys();
    if (messages) messages.updateMessages();

    mixers(mixerButterfly, clockButterfly, mixerMail, clockMail, chassisBody, mailAnimationMesh, mixerLinkedin, clockLinkedin, linkedinAnimationMesh, mixerGithub, githubAnimationMesh);
    contactLinks(null, chassisBody);
    updateJoysitck(vehicle, fwdValue.current, rgtValue.current, lftValue.current, bkdValue.current);
}

export default render;
