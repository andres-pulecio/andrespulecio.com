import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import importModels from './importModels.js';
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
import initializeButterflyAnimation from './animation/butterflyAnimation.js';
import { addJoystick } from './functions/joystick.js';
import contactLinks from './functions/contactLinks.js';
import githubAnimation from './animation/githubAnimation.js';
import linkedinAnimation from './animation/linkedinAnimation.js';
import mailAnimation from './animation/mailAnimation.js';
import mixers from './animation/mixers.js';
import initializePhysics from './functions/physics.js';
import initializeScene from './functions/sceneSetup.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import initializePlaneBody from './functions/planeSetup.js';


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
    githubAnimationMesh
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
        // Inicializar el plano y las luces
        const { plane, lightOffset, sunlight } = initializeScene(scene);
        // Inicializar la física
        const { world, groundMaterial, wheelMaterial } = initializePhysics();
        
        //----------------------------------------------------------------------------------------------------
        //********         CAR         ********
        //----------------------------------------------------------------------------------------------------

        var CarMesh; // Declarar la variable para almacenar el modelo del coche

        // Importar el coche desde Blender
        var loaderCar = new GLTFLoader();
        loaderCar.load('../models/poly-car.glb', (gltf) => {
            CarMesh = gltf.scene; // Asignar el modelo del coche a CarMesh
            var scale = 1.09;
            CarMesh.scale.set(CarMesh.scale.x * scale, CarMesh.scale.y * scale, CarMesh.scale.z * scale); // Escalar el modelo del coche
            CarMesh.position.set(0, 0, 0); // Establecer la posición inicial del coche
            scene.add(CarMesh); // Añadir el coche a la escena
        });

        // Cuerpo físico del coche (chasis)
        var chassisShape = new CANNON.Box(new CANNON.Vec3(0.8, 0.3, 2));
        var chassisBody = new CANNON.Body({ mass: 150 });
        chassisBody.addShape(chassisShape);
        chassisBody.position.set(0, 10, 0); // Posición inicial del coche (cae desde el cielo)
        chassisBody.angularVelocity.set(0, 0, 0); // Velocidad angular inicial
        world.addBody(chassisBody); // Añadir el chasis al mundo de física

        // Objeto vehículo principal
        vehicle = new CANNON.RaycastVehicle({
            chassisBody: chassisBody,
            indexRightAxis: 0, // Eje x
            indexUpAxis: 1, // Eje y
            indexForwardAxis: 2, // Eje z
        });

        // Opciones de las ruedas
        var options = {
            // radius: 0.3,
            radius: 0.4,
            directionLocal: new CANNON.Vec3(0, -1, 0),
            suspensionStiffness: 45,
            suspensionRestLength: 0.4,
            frictionSlip: 5,
            dampingRelaxation: 2.3,
            dampingCompression: 4.5,
            maxSuspensionForce: 2000,
            rollInfluence: 0.01,
            axleLocal: new CANNON.Vec3(-1, 0, 0),
            chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
            maxSuspensionTravel: 1,
            // customSlidingRotationalSpeed: -30,
            customSlidingRotationalSpeed: -120,
            useCustomSlidingRotationalSpeed: true,
        };

        // Añadir ruedas al vehículo
        var axlewidth = 0.9;
        options.chassisConnectionPointLocal.set(axlewidth, 0, -1);
        vehicle.addWheel(options);
        options.chassisConnectionPointLocal.set(-axlewidth, 0, -1);
        vehicle.addWheel(options);
        options.chassisConnectionPointLocal.set(axlewidth, 0, 1);
        vehicle.addWheel(options);
        options.chassisConnectionPointLocal.set(-axlewidth, 0, 1);
        vehicle.addWheel(options);
        vehicle.addToWorld(world); // Añadir el vehículo al mundo de física

        // Ruedas del coche
        var wheelBodies = [], wheelVisuals = [];
        vehicle.wheelInfos.forEach(function(wheel) {
            var shape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20);
            var body = new CANNON.Body({ mass: 1, material: wheelMaterial });
            var q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2);
            body.addShape(shape, new CANNON.Vec3(), q);
            wheelBodies.push(body);

            // Cuerpo visual de la rueda
            var geometry = new THREE.CylinderGeometry(wheel.radius, wheel.radius, 0.5, 12);
            var material = new THREE.MeshPhongMaterial({
                color: 0x283747,
                // emissive: 0xaa0000,
                side: THREE.DoubleSide,
                flatShading: true,
            });
            var cylinder = new THREE.Mesh(geometry, material);
            cylinder.geometry.rotateZ(Math.PI / 2);
            wheelVisuals.push(cylinder);
            scene.add(cylinder); // Añadir la rueda visual a la escena
        });

        // Actualizar las ruedas para que coincidan con la física
        world.addEventListener('postStep', function() {
            for (var i = 0; i < vehicle.wheelInfos.length; i++) {
                vehicle.updateWheelTransform(i);
                var t = vehicle.wheelInfos[i].worldTransform;

                // Actualizar la física de las ruedas
                wheelBodies[i].position.copy(t.position);
                wheelBodies[i].quaternion.copy(t.quaternion);

                // Actualizar el cuerpo visual de las ruedas
                wheelVisuals[i].position.copy(t.position);
                wheelVisuals[i].quaternion.copy(t.quaternion);
            }
            // Sincronizar la posición y orientación del modelo del coche con el chasis
            if (CarMesh) {
                CarMesh.position.copy(chassisBody.position);
                CarMesh.quaternion.copy(chassisBody.quaternion);
            }
        });
        //----------------------------------------------------------------------------------------------------
        // Inicializar el cuerpo del plano y obtener `q`
        const { planeBody, q } = initializePlaneBody(world, plane, groundMaterial);
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
        //Call R2D2
        const R2D2 = new importModels();
        R2D2.init('../models/r2d2.glb', scene, world, normalMaterial, q, 3, 12 , 0.05, 135, 3, 3.3, 2, 0, 1);

        // Función para actualizar las referencias
        const setButterflyMesh = (mesh) => butterflyMesh = mesh;
        const setMixerButterfly = (mixer) => mixerButterfly = mixer;
        const setLinkedinAnimationMesh = (mesh) => linkedinAnimationMesh = mesh;
        const setMixerLinkedin = (mixer) => mixerLinkedin = mixer;
        const setGithubAnimationMesh = (mesh) => githubAnimationMesh = mesh; 
        const setMixerGithub = (mixer) => mixerGithub = mixer;
        const setMailAnimationMesh = (mesh) => mailAnimationMesh = mesh;
        const setMixerMail = (mixer) => mixerMail = mixer;

        // Llamar a la función de animación de mariposa y obtener los relojes
        ({ clockButterfly, clockMail, clockLinkedin, clockGithub } = initializeButterflyAnimation(scene, setButterflyMesh, setMixerButterfly));
          
        //Link Animation
        mailAnimation(scene, setMailAnimationMesh, setMixerMail);
        linkedinAnimation(scene, setLinkedinAnimationMesh, setMixerLinkedin);
        githubAnimation(scene, setGithubAnimationMesh, setMixerGithub);

        // Añadir el listener de eventos para la navegación
        window.addEventListener('keydown', (e) => navigate(e, vehicle, chassisBody));
        window.addEventListener('keyup', (e) => navigate(e, vehicle, chassisBody));
        window.addEventListener('keydown', (e) => contactLinks(e, chassisBody)); 
        window.addEventListener('keyup', (e) => contactLinks(e, chassisBody));
        window.addEventListener('keydown', navigate)
        window.addEventListener('keyup', navigate)

        function render() { 
            if (screen.width <= 700) {
                addJoystick(fwdValue, rgtValue, lftValue, bkdValue, vehicle);
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

            mixers(mixerButterfly, clockButterfly, mixerMail, clockMail, chassisBody, mailAnimationMesh, mixerLinkedin, clockLinkedin, linkedinAnimationMesh, mixerGithub, githubAnimationMesh);
            contactLinks(null, chassisBody);
            updateJoysitck(vehicle, fwdValue.current, rgtValue.current, lftValue.current, bkdValue.current);
        }
        render();
    }
}
export default world;