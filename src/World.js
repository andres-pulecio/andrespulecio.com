import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import importModels from './importModels.js';
import importModelsSphere from './importModelsSphere.js';
import directionalLight from './directionalLight.js';
import Icosahedron from './Icosahedron';
import Stone from './Stone.js';
import Tree from './Tree.js';
import Pokemons from "./pokemons.js";
import Path from './Path.js';
import Word from './Word.js';
import Sign from './Sign.js';
import LocationColombia from './LocationColombia.js';
import Cone from './Cone.js';
import TechIcons from './TechIcons.js';
import Fence from './Fence.js';
import Bowling from './Bowling.js';
import GameObjects from './GameObjects.js';
import Brick from './Brick.js';
import Keys from './Keys.js'
import Messages from './Messages.js';
import updatePhysics from './functions/updatePhysics.js'
import navigate from './functions/navigate.js';
import mailAnimation from './animation/mailAnimation.js';

import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js"
import nipplejs from 'nipplejs';


let vehicle, 
    objectPosition,
    cameraOffset,
    lightOffset,
    planeOffset,
    butterflyMesh,
    mixerButterfly,
    mixerMail,
    mixerLinkedin,
    mixerGithub,
    clockButterfly,
    clockMail,
    clockLinkedin,
    clockGithub,
    separation
    ;

class world {
    init() {
        let fwdValue = 0;
        let bkdValue = 0;
        let rgtValue = 0;
        let lftValue = 0;
        let tempVector = new THREE.Vector3();
        let upVector = new THREE.Vector3(0, 1, 0);
        let joyManager;

        var width = window.innerWidth,
            height = window.innerHeight;

        //Car

        var CarMesh;
        var mailAnimationMesh;
        var linkedinAnimationMesh;
        var githubAnimationMesh;
        objectPosition = new THREE.Vector3();
        cameraOffset = new THREE.Vector3(10, 11, 11);
        // cameraOffset = new THREE.Vector3(5, 2, 0); //calibration
        planeOffset = new THREE.Vector3(0, -0.1, 0);

        var normalMaterial = new THREE.MeshStandardMaterial({color: 0xCB4335, side: THREE.DoubleSide})
        normalMaterial.friction = 0.25;
        normalMaterial.restitution = 0.25;

        var dominoMaterial = new THREE.MeshStandardMaterial({color: 0xCB4335, side: THREE.DoubleSide})

        var container = document.querySelector('body'),
        w = container.clientWidth,
        h = container.clientHeight,
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100),
        cameraMovile = new THREE.PerspectiveCamera(75, w/h, 0.001, 50),
        renderConfig = {antialias: true, alpha: true},
        renderer = new THREE.WebGLRenderer(renderConfig);

        camera.position.set(10, 11, 11);
        camera.lookAt(0,-4,0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(w, h);
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', function() {
            w = container.clientWidth;
            h = container.clientHeight;
            camera.aspect = w/h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        })
        // ------------------------------MOVILE-----------------------

        // Add OrbitControls so that we can pan around with the mouse.
        if (screen.width <= 700) {    
            var controls = new OrbitControls(cameraMovile, renderer.domElement);
            controls.maxPolarAngle = Math.PI / 5;
            controls.minPolarAngle = Math.PI / 5;
            controls.maxAzimuthAngle = Math.PI / 5;
            controls.enablePan = false
            controls.enableDamping = true;
            controls.enableZoom = false;
            controls.update();
        }    
        // -----------------------------------------------------
        var geometry = new THREE.PlaneGeometry(270, 270, 1);
        // var material = new THREE.MeshStandardMaterial({color: 0x1E8449, side: THREE.DoubleSide}); //green
        var material = new THREE.MeshStandardMaterial({color: 0x3498DB , side: THREE.DoubleSide}); //blue
        var plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        plane.rotation.x = Math.PI/2;
        scene.add(plane);

        //light or sun
        lightOffset = new THREE.Vector3(7, 60, 30);
        const sunlight = new THREE.PointLight(0xffffff, 1.5, 120);
        scene.add( sunlight );

        const light = new directionalLight();
        light.init(scene);

        /**
         * Physics
         **/
        const world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);

        var groundMaterial = new CANNON.Material('groundMaterial');
        groundMaterial.friction = 0.25;
        groundMaterial.restitution = 0.25;

        var wheelMaterial = new CANNON.Material('wheelMaterial');
        wheelMaterial.friction = 0.25;
        wheelMaterial.restitution = 0.25;

        // car physics body
        var chassisShape = new CANNON.Box(new CANNON.Vec3(0.8, 0.3, 2));
        var chassisBody = new CANNON.Body({mass: 150});
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 3, 0);
        chassisBody.angularVelocity.set(0, 0, 0); // initial velocity
        world.addBody(chassisBody)

        // parent vehicle object
        vehicle = new CANNON.RaycastVehicle({
        chassisBody: chassisBody,
        indexRightAxis: 0, // x
        indexUpAxis: 1, // y
        indexForwardAxis: 2, // z
        });

        // wheel options
        var options = {
            // radius: 0.3,
            radius: 0.4,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 45,
            suspensionRestLength: 0.4,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.5,
            maxSuspensionForce: 200000,
            rollInfluence:  0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 1,
            // customSlidingRotationalSpeed: -30,
            customSlidingRotationalSpeed: -120,
            useCustomSlidingRotationalSpeed: true,
        };

        var axlewidth = 0.9;
        options.chassisConnectionPointLocal.set(axlewidth, 0, -1);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-axlewidth, 0, -1);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(axlewidth, 0, 1);
        vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-axlewidth, 0, 1);
        vehicle.addWheel(options);

        vehicle.addToWorld(world);

        // car wheels
        var wheelBodies = [],
        wheelVisuals = [];
        vehicle.wheelInfos.forEach(function(wheel) {
            var shape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
            var body = new CANNON.Body({mass: 1, material: wheelMaterial});
            var q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
            body.addShape(shape, new CANNON.Vec3(), q);
            wheelBodies.push(body);
            // wheel visual body
            var geometry = new THREE.CylinderGeometry( wheel.radius, wheel.radius, 0.5, 12 );
            var material = new THREE.MeshPhongMaterial({
                color: 0x283747,
                // emissive: 0xaa0000,
                side: THREE.DoubleSide,
                flatShading: true,
            });
            var cylinder = new THREE.Mesh(geometry, material);
            cylinder.geometry.rotateZ(Math.PI/2);
            wheelVisuals.push(cylinder);
            scene.add(cylinder);
        });

        // update the wheels to match the physics
        world.addEventListener('postStep', function() {
            for (var i=0; i<vehicle.wheelInfos.length; i++) {
                vehicle.updateWheelTransform(i);
                var t = vehicle.wheelInfos[i].worldTransform;
                // update wheel physics
                wheelBodies[i].position.copy(t.position);
                wheelBodies[i].quaternion.copy(t.quaternion);
                // update wheel visuals
                wheelVisuals[i].position.copy(t.position);
                wheelVisuals[i].quaternion.copy(t.quaternion);
            }
        });

        var q = plane.quaternion;
        var planeBody = new CANNON.Body({
            mass: 0, // mass = 0 makes the body static
            material: groundMaterial,
            shape: new CANNON.Plane(),
            quaternion: new CANNON.Quaternion(-q._x, q._y, q._z, q._w)
        });
        world.addBody(planeBody)

        //Call icosahedron
        const icosahedron = new Icosahedron(world, scene, normalMaterial);
        //Call Stones
        const stones = new Stone(scene, world, normalMaterial, q);
        stones.initStones();    
        //Call Trees
        const trees = new Tree(scene, world, normalMaterial, q); 
        trees.initTrees();
        //Call fence
        const fence = new importModels();
        fence.init('../models/fence.glb', scene, world, normalMaterial, q, 2, 90, 0, 72, 0.4, 1, 2, 0, 1);
        //Call Pokemons
        const pokemons = new Pokemons(scene, world, normalMaterial, q); pokemons.initPokemons();
        //Call Paths
        const paths = new Path(scene, world, normalMaterial, q); 
        paths.initPaths();
        // Call Name
        const DEVOPS_Word = new importModels();
        DEVOPS_Word.init('../models/DEVOPS.glb', scene, world, normalMaterial, q, 0.5, -18 + 27, 1.5, 18 + 4, 3.5, 0.3, 1, 1, 1);

        const words = new Word(scene, world, normalMaterial, q); 
        words.initWords();
        //Call Signs
        const signs = new Sign(scene, world, normalMaterial, q);
        signs.initSigns();
        //Call location
        const locationColombia = new LocationColombia(scene, world, normalMaterial, q); 
        locationColombia.initObjects();
        //Call Cones
        const cones = new Cone(scene, world, normalMaterial, q); 
        cones.initCones();
        //Call Tech Icons
        const techIcons = new TechIcons(scene, world, normalMaterial, q); techIcons.initIcons();
        //Call FenceWood
        const fences = new Fence(scene, world, normalMaterial, q); 
        fences.initFences();
        //Call Bowling
        const bowling = new Bowling(scene, world, normalMaterial, q); 
        bowling.initBowling();
        //Call Game Objects
        const gameObjects = new GameObjects(scene, world, normalMaterial, dominoMaterial, q); 
        gameObjects.initStoneDecorations(); 
        gameObjects.initDices(); 
        gameObjects.initDominos();
        //Call Bricks
        const bricks = new Brick(scene, world, normalMaterial, q); 
        bricks.initBricks();
        //Call Keys
        const keys = new Keys(scene, world, normalMaterial, q); 
        keys.initKeys();
        //Call Messages
        const messages = new Messages(scene, world, normalMaterial, q); 
        messages.initMessages();

        //Butterfly
        var animation = new GLTFLoader();
        animation.load('../models/butterfly.glb',
        (gltf) => {
            butterflyMesh = gltf.scene;
            var scale = 0.4;
            butterflyMesh.scale.set(butterflyMesh.scale.x * scale, butterflyMesh.scale.y * scale ,butterflyMesh.scale.z * scale);
            butterflyMesh.position.set(-13 , 1, 98);
            scene.add(butterflyMesh);
            
            mixerButterfly = new THREE.AnimationMixer(butterflyMesh)
            const clips = gltf.animations;
            clips.forEach(function(clip) {
                const action = mixerButterfly.clipAction(clip);
                action.play();
            });
        }
        );
        
        //Link Animation
        mailAnimation();
        linkedinAnimation();
        githubAnimation();

        //R2*D2
        const R2D2 = new importModels();
        R2D2.init('../models/r2d2.glb', scene, world, normalMaterial, q, 3, 12 , 0.05, 135, 3, 3.3, 2, 0, 1);

        // import car from blender
        var loaderCar = new GLTFLoader();
        loaderCar.load('../models/poly-car.glb',
            (gltf) => {
                CarMesh = gltf.scene;
                var scale = 1.09;
                CarMesh.scale.set(CarMesh.scale.x * scale, CarMesh.scale.y * scale ,CarMesh.scale.z * scale);
                CarMesh.position.set(0, 0, 0);
                scene.add(CarMesh);
            }
        );

        /**
         * Main
         **/
        
        clockButterfly = new THREE.Clock();
        clockMail = new THREE.Clock();
        clockLinkedin = new THREE.Clock();
        clockGithub= new THREE.Clock();

        function render() { 
            if (screen.width <= 700) {
                updateJoysitck();
            }          
        
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            CarMesh.position.copy(chassisBody.position);
            CarMesh.quaternion.copy(chassisBody.quaternion);
            updatePhysics(world, icosahedron, camera, chassisBody, cameraOffset, sunlight, lightOffset, plane, planeOffset);
            words.updateWords();
            locationColombia.updateObjects();
            cones.updateCones();
            techIcons.updateIcons();
            bowling.updateBowling();
            gameObjects.updateDices(); 
            gameObjects.updateDominos();
            bricks.updateBricks();
            keys.updateKeys();

            mixers();
            contactLinks();
        }
        
        // Añadir el listener de eventos para la navegación
        window.addEventListener('keydown', (e) => navigate(e, vehicle, chassisBody));
        window.addEventListener('keyup', (e) => navigate(e, vehicle, chassisBody));

        function mixers() {
            if(mixerButterfly){
                mixerButterfly.update(clockButterfly.getDelta());
            }
            var mixMailPositionX = -15;
            var mixMailPositionZ = 162;
            var squMailTrig = 3;
            
            if(mixerMail && chassisBody.position.x < (mixMailPositionX + squMailTrig) && chassisBody.position.x > (mixMailPositionX - squMailTrig) && chassisBody.position.z < (mixMailPositionZ + squMailTrig) && chassisBody.position.z > (mixMailPositionZ - squMailTrig)){
                mixerMail.update(clockMail.getDelta());
                mailAnimationMesh.position.set(mixMailPositionX , 0, mixMailPositionZ);
            }else{
                mailAnimationMesh.position.set(mixMailPositionX , -10, mixMailPositionZ);
            }

            var mixLinkPositionX = -24;
            var mixLinkPositionZ = 162;
            var squLinkTrig = 3;
            
            if(mixerLinkedin && chassisBody.position.x < (mixLinkPositionX + squLinkTrig) && chassisBody.position.x > (mixLinkPositionX - squLinkTrig) && chassisBody.position.z < (mixLinkPositionZ + squLinkTrig) && chassisBody.position.z > (mixLinkPositionZ - squLinkTrig)){
                mixerLinkedin.update(clockLinkedin.getDelta());
                linkedinAnimationMesh.position.set(mixLinkPositionX , 0, mixLinkPositionZ);
            }else{
                linkedinAnimationMesh.position.set(mixLinkPositionX  , -10, mixLinkPositionZ);
            }
            
            var mixGitPositionX = -33;
            var mixGitPositionZ = 162;
            var squGitTrig = 3;
            if(mixerGithub && chassisBody.position.x < (mixGitPositionX + squGitTrig) && chassisBody.position.x > (mixGitPositionX - squGitTrig) && chassisBody.position.z < (mixGitPositionZ + squGitTrig) && chassisBody.position.z > (mixGitPositionZ - squGitTrig)){
                mixerGithub.update(clockLinkedin.getDelta());
                githubAnimationMesh.position.set(mixGitPositionX , 0, mixGitPositionZ);
            }else{
                githubAnimationMesh.position.set(mixGitPositionX  , -10, mixGitPositionZ);
            }
        }
        
        function mailAnimation(){
            var mailAnimation = new GLTFLoader();
            mailAnimation.load('../models/mailAnimation.glb',
            (gltf) => {
                mailAnimationMesh = gltf.scene;
                var scale = 3;
                mailAnimationMesh.scale.set(mailAnimationMesh.scale.x * scale, mailAnimationMesh.scale.y * scale ,mailAnimationMesh.scale.z * scale);
                mailAnimationMesh.position.set(-15 , -10, 162);
                scene.add(mailAnimationMesh);
                
                mixerMail = new THREE.AnimationMixer(mailAnimationMesh)
                const clips = gltf.animations;
                clips.forEach(function(clip) {
                    const action = mixerMail.clipAction(clip);
                    action.play();
                });
            }
            );
        }

        function linkedinAnimation(){
            var linkedinAnimation = new GLTFLoader();
            linkedinAnimation.load('../models/mailAnimation.glb',
            (gltf) => {
                linkedinAnimationMesh = gltf.scene;
                var scale = 3;
                linkedinAnimationMesh.scale.set(linkedinAnimationMesh.scale.x * scale, linkedinAnimationMesh.scale.y * scale ,linkedinAnimationMesh.scale.z * scale);
                linkedinAnimationMesh.position.set(-15 , -10, 162);
                scene.add(linkedinAnimationMesh);
                
                mixerLinkedin = new THREE.AnimationMixer(linkedinAnimationMesh)
                const clips = gltf.animations;
                clips.forEach(function(clip) {
                    const action = mixerLinkedin.clipAction(clip);
                    action.play();
                });
            }
            );
        }

        function githubAnimation(){
            var githubAnimation = new GLTFLoader();
            githubAnimation.load('../models/mailAnimation.glb',
            (gltf) => {
                githubAnimationMesh = gltf.scene;
                var scale = 3;
                githubAnimationMesh.scale.set(githubAnimationMesh.scale.x * scale, githubAnimationMesh.scale.y * scale ,githubAnimationMesh.scale.z * scale);
                githubAnimationMesh.position.set(-15 , -10, 162);
                scene.add(githubAnimationMesh);
                
                mixerGithub = new THREE.AnimationMixer(githubAnimationMesh)
                const clips = gltf.animations;
                clips.forEach(function(clip) {
                    const action = mixerGithub.clipAction(clip);
                    action.play();
                });
            }
            );
        }

        function contactLinks(e) {
            if (e.type != 'keydown' && e.type != 'keyup') return;
            var keyup = e.type == 'keyup';
            
            var mixMailPositionX = -15;
            var mixMailPositionZ = 162;
            var squMailTrig = 3;
            if(e.keyCode == 13 && chassisBody.position.x < (mixMailPositionX + squMailTrig) && chassisBody.position.x > (mixMailPositionX - squMailTrig) && chassisBody.position.z < (mixMailPositionZ + squMailTrig) && chassisBody.position.z > (mixMailPositionZ - squMailTrig)){
                window.open('mailto:andresfelipepulecio@gmail.com', '_blank').focus();
            }
            
            var mixLinkPositionX = -24;
            var mixLinkPositionZ = 162;
            var squLinkTrig = 3;
            if (e.keyCode == 13 && chassisBody.position.x < (mixLinkPositionX + squLinkTrig) && chassisBody.position.x > (mixLinkPositionX - squLinkTrig) && chassisBody.position.z < (mixLinkPositionZ + squLinkTrig) && chassisBody.position.z > (mixLinkPositionZ - squLinkTrig)) {
                window.open('https://www.linkedin.com/in/andres-pulecio/', '_blank').focus();
            }
            
            var mixGitPositionX = -33;
            var mixGitPositionZ = 162;
            var squGitTrig = 3;
            if (e.keyCode == 13 && chassisBody.position.x < (mixGitPositionX + squGitTrig) && chassisBody.position.x > (mixGitPositionX - squGitTrig) && chassisBody.position.z < (mixGitPositionZ + squGitTrig) && chassisBody.position.z > (mixGitPositionZ - squGitTrig)) {
                window.open('https://github.com/andres-pulecio', '_blank').focus();
            }
        }
        function addJoystick(){
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
                }
            
            
            joyManager = nipplejs.create(options);
            
            joyManager['0'].on('move', function (evt, data) {
                    const forward = data.vector.y
                    const turn = data.vector.x
    
                    if (forward > 0) {
                    fwdValue = Math.abs(forward)
                    bkdValue = 0
                    } else if (forward < 0) {
                    fwdValue = 0
                    bkdValue = Math.abs(forward)
                    }
    
                    if (turn > 0) {
                    lftValue = 0
                    rgtValue = Math.abs(turn)
                    } else if (turn < 0) {
                    lftValue = Math.abs(turn)
                    rgtValue = 0
                    }
                })
    
                joyManager['0'].on('end', function (evt) {
                    bkdValue = 0
                    fwdValue = 0
                    lftValue = 0
                    rgtValue = 0
                })
            
            }
            function updateJoysitck(){
                vehicle.setBrake(4, 0);
                vehicle.setBrake(4, 1);
                vehicle.setBrake(4, 2);
                vehicle.setBrake(4, 3);
    
                var engineForce = 1000,
                maxSteerVal = 0.5;
                if (fwdValue > 0 && rgtValue < 0.5 && lftValue < 0.5) {
                    vehicle.applyEngineForce(-engineForce, 2);
                    vehicle.applyEngineForce(-engineForce, 3);
                    vehicle.applyEngineForce(-engineForce/2, 0);
                    vehicle.applyEngineForce(-engineForce/2, 1);
                }else if (bkdValue > 0 && rgtValue < 0.5 && lftValue < 0.5) {
                    vehicle.applyEngineForce(engineForce, 0);
                    vehicle.applyEngineForce(engineForce, 1);
                }else if (rgtValue > 0 && fwdValue < 0.5 && bkdValue < 0.5) {
                    vehicle.setSteeringValue(-maxSteerVal, 2);
                    vehicle.setSteeringValue(-maxSteerVal, 3);
                    vehicle.applyEngineForce(-engineForce, 2);
                    vehicle.applyEngineForce(-engineForce, 3);
                }else if (lftValue > 0 && fwdValue < 0.5 && bkdValue < 0.5) {
                    vehicle.setSteeringValue(maxSteerVal, 2);
                    vehicle.setSteeringValue(maxSteerVal, 3);
                    vehicle.applyEngineForce(-engineForce, 2);
                    vehicle.applyEngineForce(-engineForce, 3);
                }else{
                    vehicle.applyEngineForce(0, 0);
                    vehicle.applyEngineForce(0, 1);
                    vehicle.applyEngineForce(0, 2);
                    vehicle.applyEngineForce(0, 3);
                    vehicle.setSteeringValue(0, 2);
                    vehicle.setSteeringValue(0, 3);
                }
            };    
        window.addEventListener('keydown', contactLinks)
        window.addEventListener('keyup', contactLinks)
        
        window.addEventListener('keydown', navigate)
        window.addEventListener('keyup', navigate)
        if (screen.width <= 700) {    
            addJoystick();
        }    
        render();
    }
}
export default world;