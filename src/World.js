import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import importModels from './importModels.js';
import directionalLight from './directionalLight.js';

let vehicle, objectPosition,cameraOffset,vehicle1,lightOffset,planeOffset;

class world {
    init() {

        var CarMesh;
        objectPosition = new THREE.Vector3();
        cameraOffset = new THREE.Vector3(10, 11, 11);
        // cameraOffset = new THREE.Vector3(5, 2, 0); //calibration
        planeOffset = new THREE.Vector3(0, -1, 0);

        var normalMaterial = new THREE.MeshStandardMaterial({color: 0xCB4335, side: THREE.DoubleSide})
        normalMaterial.friction = 0.25;
        normalMaterial.restitution = 0.25;

        var container = document.querySelector('body'),
        w = container.clientWidth,
        h = container.clientHeight,
        scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100),
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

        var geometry = new THREE.PlaneGeometry(270, 270, 1);
        var material = new THREE.MeshStandardMaterial({color: 0x2874A6, side: THREE.DoubleSide});
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
        // world.broadphase = new CANNON.SAPBroadphase(world);
        world.gravity.set(0, -9.82, 0);
        // world.defaultContactMaterial.friction = 0.01;

        var groundMaterial = new CANNON.Material('groundMaterial');
        groundMaterial.friction = 0.25;
        groundMaterial.restitution = 0.25;

        var wheelMaterial = new CANNON.Material('wheelMaterial');
        wheelMaterial.friction = 0.25;
        wheelMaterial.restitution = 0.25;

        // var wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
        //     friction: 0.25,
        //     restitution: 0.25,
        //     contactEquationStiffness: 1000,
        // });
        // world.addContactMaterial(wheelGroundContactMaterial);

        // car physics body
        var chassisShape = new CANNON.Box(new CANNON.Vec3(0.8, 0.3, 2));
        var chassisBody = new CANNON.Body({mass: 150});
        chassisBody.addShape(chassisShape);
        // chassisBody.position.set(0, 10, 0);
        chassisBody.position.set(0, 0, 0);
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
            customSlidingRotationalSpeed: -30,
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


        //box physics body
        var boxShape = new CANNON.Box(new CANNON.Vec3(2, 2, 2));
        var boxBody = new CANNON.Body({mass: 1});
        boxBody.addShape(boxShape);
        boxBody.position.set(-55, 3, 68);
        boxBody.angularVelocity.set(0, 0, 0); // initial velocity
        world.addBody(boxBody)

        // box visual body
        var boxGeometry = new THREE.BoxGeometry(4, 4, 4)
        var boxMesh = new THREE.Mesh(boxGeometry, normalMaterial)
        scene.add(boxMesh)

        //sphere physics body
        var sphereShape = new CANNON.Sphere(1);
        var sphereBody = new CANNON.Body({mass: 100});
        sphereBody.addShape(sphereShape);
        sphereBody.position.set(-40, 5, 74);
        sphereBody.angularVelocity.set(0, 0, 0); // initial velocity
        world.addBody(sphereBody)

        // sphere visual body
        var sphereGeometry = new THREE.SphereGeometry()
        var sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
        sphereMesh.castShadow = true; //default is false
        sphereMesh.receiveShadow = false; //default
        scene.add(sphereMesh)

        //icosahedron physics body
        var icosahedronShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        var icosahedronBody = new CANNON.Body({mass: 1});
        icosahedronBody.addShape(icosahedronShape);
        icosahedronBody.position.set(-45, 1, 73);
        icosahedronBody.angularVelocity.set(0, 0, 0); // initial velocity
        world.addBody(icosahedronBody)

        //icosahedron visual body
        var icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
        var icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
        icosahedronMesh.castShadow = true
        scene.add(icosahedronMesh)

        //stones
        const stoneBig1 = new importModels();
        stoneBig1.init('../models/stoneBig.glb', scene, world, normalMaterial, q, 1, -8, 0, 0, 0.8, 0.8, 0.8, 0, 1);
        const stoneBig2 = new importModels();
        stoneBig2.init('../models/stoneBig.glb', scene, world, normalMaterial, q, 1, -12, 0, -4, 0.8, 0.8, 0.8, 0, 1);
        const stoneBig3 = new importModels();
        stoneBig3.init('../models/stoneBig.glb', scene, world, normalMaterial, q, 1, 4, 0, -8, 0.8, 0.8, 0.8, 0, 1);
        stoneBig3.init('../models/stoneBig.glb', scene, world, normalMaterial, q, 1, 7, 0, 23, 0.8, 0.8, 0.8, 0, 1);

        const stoneMedium1 = new importModels();
        stoneMedium1.init('../models/stoneMedium.glb', scene, world, normalMaterial, q, 2, -10, 0, 2, 0.1, 0.1, 0.1, 0, 1);
        const stoneMedium2 = new importModels();
        stoneMedium2.init('../models/stoneMedium.glb', scene, world, normalMaterial, q, 2, 5.8, 0, -5.8, 0.1, 0.1, 0.1, 0, 1);
        const stoneMedium3 = new importModels();
        stoneMedium3.init('../models/stoneMedium.glb', scene, world, normalMaterial, q, 1, 10, 0, 5, 0.1, 0.1, 0.1, 0, 1);
        stoneMedium3.init('../models/stoneMedium.glb', scene, world, normalMaterial, q, 1, 8, 0, 21.3, 0.1, 0.1, 0.1, 0, 1);

        const stoneSmall1 = new importModels();
        stoneSmall1.init('../models/stoneSmall.glb', scene, world, normalMaterial, q, 3, -6, 0, 3, 0.1, 0.1, 0.1, 0, 1);
        const stoneSmall2 = new importModels();
        stoneSmall2.init('../models/stoneSmall.glb', scene, world, normalMaterial, q, 3, -7, 0, -3, 0.1, 0.1, 0.1, 0, 1);
        const stoneSmall3 = new importModels();
        stoneSmall3.init('../models/stoneSmall.glb', scene, world, normalMaterial, q, 3, 11, 0, 5.5, 0.1, 0.1, 0.1, 0, 1);

        //mushrooms
        const mushroom1 = new importModels();
        mushroom1.init('../models/mushroom.glb', scene, world, normalMaterial, q, 2, -12, 0, 3, 1, 1, 1, 0, 1);
        const mushroom2 = new importModels();
        mushroom2.init('../models/mushroom.glb', scene, world, normalMaterial, q, 1.8, -14, 0, -7, 0.8, 1, 0.8, 0, 1);
        const mushroom3 = new importModels();
        mushroom3.init('../models/mushroom.glb', scene, world, normalMaterial, q, 1.5, 4, 0, -12, 0.6, 1, 0.6, 0, 1);
        const mushroom4 = new importModels();
        mushroom4.init('../models/mushroom.glb', scene, world, normalMaterial, q, 1.5, 10, 0, -16, 0.6, 1, 0.6, 0, 1);

        const groupMushrooms = new importModels();
        groupMushrooms.init('../models/groupMushrooms.glb', scene, world, normalMaterial, q, 8, 12, 0, 3, 0.6, 1, 0.6, 0, 1);

        //Path start to center
        const tile = new importModels();
        tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, -1, 0, 9, 1, 0.1, 1, 0, 1);
        tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, -1.2, 0, 15.2, 1, 0.1, 1, 0, 1);
        tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, 1.8, 0, 11.3, 1, 0.1, 1, 0, 1);
        stoneSmall3.init('../models/stoneSmall.glb', scene, world, normalMaterial, q, 3, -2, 0, 17, 0.1, 0.1, 0.1, 0, 1);

        for (var i=0; i<15; i=i+1.2) {
            zPosition = 27;
            tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, -2 + getRndInteger(1, 5), 0, zPosition + (i*3), 1, 0.1, 1, 0, 1);
        }
        //Path center to proyects
        for (var i=0; i<15; i=i+1.2) {
            zPosition = 72;
            xPosition = 2;
            tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, xPosition + (i*3), 0, zPosition -2 + getRndInteger(1, 5) , 1, 0.1, 1, 0, 1);
            //Path center to proyects
        }
        //Path center to information
        for (var i=0; i<15; i=i+1.2) {
            zPosition = 74;
            tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, -2 + getRndInteger(1, 5), 0, zPosition + (i*3), 1, 0.1, 1, 0, 1);
        }
        //Path center to playzone
        for (var i=0; i>-15; i=i-1.2) {
            zPosition = 72;
            xPosition = -2;
            tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, xPosition + (i*3), 0, zPosition -2 + getRndInteger(1, 5) , 1, 0.1, 1, 0, 1);
            //Path center to proyects
        }

        //Name
        var xPosition = -18;
        // var yPosition = ;
        var zPosition = 18;
        var modelscale = 1;
        var xScale = 1.5;
        var yScale = 1.5;
        var zScale = 0.5;
        var modelMass = 1;
        var rotation = 1;
        const A_Word = new importModels();
        A_Word.init('../models/A.glb', scene, world, normalMaterial, q, modelscale, xPosition + 0, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const N_Word = new importModels();
        N_Word.init('../models/N.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 2, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const D_Word = new importModels();
        D_Word.init('../models/D.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 4, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const R_Word = new importModels();
        R_Word.init('../models/R.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 6, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const E_Word = new importModels();
        E_Word.init('../models/E.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 8, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const S_Word = new importModels();
        S_Word.init('../models/S.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 10, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const P_Word = new importModels();

        P_Word.init('../models/P.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 13, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const U_Word = new importModels();
        U_Word.init('../models/U.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 15, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const L_Word = new importModels();
        L_Word.init('../models/L.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 17, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const E2_Word = new importModels();
        E2_Word.init('../models/E.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 19, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const C_Word = new importModels();
        C_Word.init('../models/C.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 21, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const I_Word = new importModels();
        I_Word.init('../models/I.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 23.3 , 1, zPosition, 0.6, yScale, zScale, modelMass, rotation);
        const O_Word = new importModels();
        O_Word.init('../models/O.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 25.3 , 1, zPosition, xScale, yScale, zScale, modelMass, rotation);

        const DEVOPS_Word = new importModels();
        DEVOPS_Word.init('../models/DEVOPS.glb', scene, world, normalMaterial, q, modelscale/2, xPosition + 27, 1.5, zPosition + 4, 3.5, 0.3, 1, modelMass, rotation);

        //Signs
        const signInformation = new importModels();
        signInformation.init('../models/signInformation.glb', scene, world, normalMaterial, q, 0.4, -5 , 0, 80, 0.2, 2, 0.2, 0, 1);
        const signPlayzone = new importModels();
        signPlayzone.init('../models/signPlayzone.glb', scene, world, normalMaterial, q, 0.4, -8 , 0, 65, 0.2, 2, 0.2, 0, 1);
        const signProjects = new importModels();
        signProjects.init('../models/signProjects.glb', scene, world, normalMaterial, q, 0.4, 10 , 0, 64, 0.2, 2, 0.2, 0, 1);
        //location
        const location = new importModels();
        location.init('../models/location.glb', scene, world, normalMaterial, q, 1, -8 , 0, 100, 1, 2, 0.3, 0, 1);
        //flag
        const flag = new importModels();
        flag.init('../models/flag.glb', scene, world, normalMaterial, q, 2.5, -7.6 , 0, 99, 0.2, 1.2, 0.2, 0, 1);
        //cup
        const cup = new importModels();
        cup.init('../models/cup.glb', scene, world, normalMaterial, q, 1, -4.2 , 0.5, 103.7, 0.7, 0.5, 0.7, 1, 1);
        //plate
        const plate = new importModels();
        plate.init('../models/plate.glb', scene, world, normalMaterial, q, 1, -4.2 , 0, 103.7, 2, 0.4, 2, 1, 1);
        //Palm
        const palm = new importModels();
        palm.init('../models/palm.glb', scene, world, normalMaterial, q, 2, -11 , 0, 98, 0.3, 1.5, 0.3, 0, 1);
        //Watermelon
        const watermelon = new importModels();
        watermelon.init('../models/watermelon.glb', scene, world, normalMaterial, q, 12, -11 , 0, 103.5, 1.1, 1.1, 0.5, 1, 1);
        //Banana
        const banana = new importModels();
        banana.init('../models/banana.glb', scene, world, normalMaterial, q, 10, -12 , 1, 102, 1, 0.5, 0.5, 1, 1);


        // Wall start left
        var xPosition = -16;
        // var yPosition = ;
        var zPosition = 6;
        var modelscale = 0.6;
        var xScale = 1.08;
        var yScale = 0.42;
        var zScale = 0.6;
        var modelMass = 0.5;
        var rotation = 2;
        const bricks1 = new importModels();
        bricks1.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + 0, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const bricks2 = new importModels();
        bricks2.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 2, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const bricks3 = new importModels();
        bricks3.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition +xScale * 4, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);

        const bricks4 = new importModels();
        bricks4.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 3, 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const bricks5 = new importModels();
        bricks5.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale , 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);

        // Wall start left
        var xPosition = 14;
        // var yPosition = ;
        var zPosition = -12;
        var modelscale = 0.6;
        var xScale = 1.08;
        var yScale = 0.42;
        var zScale = 0.6;
        var modelMass = 0.5;
        var rotation = 2;
        const bricks6 = new importModels();
        bricks6.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + 0, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const bricks7 = new importModels();
        bricks7.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 2, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const bricks8 = new importModels();
        bricks8.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition +xScale * 4, 1, zPosition, xScale, yScale, zScale, modelMass, rotation);

        const bricks9 = new importModels();
        bricks9.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale * 3, 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);
        const bricks10 = new importModels();
        bricks10.init('../models/brick.glb', scene, world, normalMaterial, q, modelscale, xPosition + xScale , 1 + yScale * 2, zPosition, xScale, yScale, zScale, modelMass, rotation);

        //Messages
        const keysMessage = new importModels();
        keysMessage.init('../models/keysMessage.glb', scene, world, normalMaterial, q, 5, 0, 0, 3, 0.1, 0.1, 0.1, 0, 1);
        const restartMessage = new importModels();
        restartMessage.init('../models/restartMessage.glb', scene, world, normalMaterial, q, 5, 3, 0, 8, 0.1, 0.1, 0.1, 0, 1);

        //Keys
        const keysLeft = new importModels();
        keysLeft.init('../models/keysLeft.glb', scene, world, normalMaterial, q, 5, 5.2, 1, 2.3, 0.55, 0.5, 0.55, 1, 2);
        const keysUp = new importModels();
        keysUp.init('../models/keysUp.glb', scene, world, normalMaterial, q, 5, 6.4, 1, 1.2, 0.55, 0.5, 0.55, 1, 2);
        const keysRight = new importModels();
        keysRight.init('../models/keysRight.glb', scene, world, normalMaterial, q, 5, 7.6, 1, 2.3, 0.55, 0.5, 0.55, 1, 2);
        const keysDown = new importModels();
        keysDown.init('../models/keysDown.glb', scene, world, normalMaterial, q, 5, 6.4, 1, 2.3, 0.55, 0.5, 0.55, 1, 2);
        const keysR = new importModels();
        keysR.init('../models/keysR.glb', scene, world, normalMaterial, q, 5, 5.6, 1, 7.5, 0.55, 0.5, 0.55, 1, 2);

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

        function updatePhysics() {
            world.step(1/60);
            // update the chassis position
            // box.position.copy(chassisBody.position);
            // box.quaternion.copy(chassisBody.quaternion);
            // box.getWorldPosition(objectPosition);
            // update the sphare position
            sphereMesh.position.copy(sphereBody.position);
            sphereMesh.quaternion.copy(sphereBody.quaternion);
            // update the box position
            boxMesh.position.copy(boxBody.position);
            boxMesh.quaternion.copy(boxBody.quaternion);
            // update the icosahedron position
            icosahedronMesh.position.copy(icosahedronBody.position);
            icosahedronMesh.quaternion.copy(icosahedronBody.quaternion);

            camera.position.x = chassisBody.position.x + cameraOffset.x;
            camera.position.z = chassisBody.position.z + cameraOffset.z;

            sunlight.position.copy(chassisBody.position).add(lightOffset);
            plane.position.copy(chassisBody.position).add(planeOffset);
            plane.position.copy(chassisBody.position).add(planeOffset);
            
        }
        
        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
            updatePhysics();
            CarMesh.position.copy(chassisBody.position);
            CarMesh.quaternion.copy(chassisBody.quaternion);

            bricks1.mesh_param.position.copy(bricks1.body_param.position);
            bricks1.mesh_param.quaternion.copy(bricks1.body_param.quaternion);
            bricks2.mesh_param.position.copy(bricks2.body_param.position);
            bricks2.mesh_param.quaternion.copy(bricks2.body_param.quaternion);
            bricks3.mesh_param.position.copy(bricks3.body_param.position);
            bricks3.mesh_param.quaternion.copy(bricks3.body_param.quaternion);
            bricks4.mesh_param.position.copy(bricks4.body_param.position);
            bricks4.mesh_param.quaternion.copy(bricks4.body_param.quaternion);
            bricks5.mesh_param.position.copy(bricks5.body_param.position);
            bricks5.mesh_param.quaternion.copy(bricks5.body_param.quaternion);

            bricks6.mesh_param.position.copy(bricks6.body_param.position);
            bricks6.mesh_param.quaternion.copy(bricks6.body_param.quaternion);
            bricks7.mesh_param.position.copy(bricks7.body_param.position);
            bricks7.mesh_param.quaternion.copy(bricks7.body_param.quaternion);
            bricks8.mesh_param.position.copy(bricks8.body_param.position);
            bricks8.mesh_param.quaternion.copy(bricks8.body_param.quaternion);
            bricks9.mesh_param.position.copy(bricks9.body_param.position);
            bricks9.mesh_param.quaternion.copy(bricks9.body_param.quaternion);
            bricks10.mesh_param.position.copy(bricks10.body_param.position);
            bricks10.mesh_param.quaternion.copy(bricks10.body_param.quaternion);

            keysLeft.mesh_param.position.copy(keysLeft.body_param.position);
            keysLeft.mesh_param.quaternion.copy(keysLeft.body_param.quaternion);
            keysUp.mesh_param.position.copy(keysUp.body_param.position);
            keysUp.mesh_param.quaternion.copy(keysUp.body_param.quaternion);
            keysRight.mesh_param.position.copy(keysRight.body_param.position);
            keysRight.mesh_param.quaternion.copy(keysRight.body_param.quaternion);
            keysDown.mesh_param.position.copy(keysDown.body_param.position);
            keysDown.mesh_param.quaternion.copy(keysDown.body_param.quaternion);
            keysR.mesh_param.position.copy(keysR.body_param.position);
            keysR.mesh_param.quaternion.copy(keysR.body_param.quaternion);
            A_Word.mesh_param.position.copy(A_Word.body_param.position);
            A_Word.mesh_param.quaternion.copy(A_Word.body_param.quaternion);
            N_Word.mesh_param.position.copy(N_Word.body_param.position);
            N_Word.mesh_param.quaternion.copy(N_Word.body_param.quaternion);
            D_Word.mesh_param.position.copy(D_Word.body_param.position);
            D_Word.mesh_param.quaternion.copy(D_Word.body_param.quaternion);
            R_Word.mesh_param.position.copy(R_Word.body_param.position);
            R_Word.mesh_param.quaternion.copy(R_Word.body_param.quaternion);
            E_Word.mesh_param.position.copy(E_Word.body_param.position);
            E_Word.mesh_param.quaternion.copy(E_Word.body_param.quaternion);
            S_Word.mesh_param.position.copy(S_Word.body_param.position);
            S_Word.mesh_param.quaternion.copy(S_Word.body_param.quaternion);
            P_Word.mesh_param.position.copy(P_Word.body_param.position);
            P_Word.mesh_param.quaternion.copy(P_Word.body_param.quaternion);
            U_Word.mesh_param.position.copy(U_Word.body_param.position);
            U_Word.mesh_param.quaternion.copy(U_Word.body_param.quaternion);
            L_Word.mesh_param.position.copy(L_Word.body_param.position);
            L_Word.mesh_param.quaternion.copy(L_Word.body_param.quaternion);
            E2_Word.mesh_param.position.copy(E2_Word.body_param.position);
            E2_Word.mesh_param.quaternion.copy(E2_Word.body_param.quaternion);
            C_Word.mesh_param.position.copy(C_Word.body_param.position);
            C_Word.mesh_param.quaternion.copy(C_Word.body_param.quaternion);
            I_Word.mesh_param.position.copy(I_Word.body_param.position);
            I_Word.mesh_param.quaternion.copy(I_Word.body_param.quaternion);
            O_Word.mesh_param.position.copy(O_Word.body_param.position);
            O_Word.mesh_param.quaternion.copy(O_Word.body_param.quaternion);
            DEVOPS_Word.mesh_param.position.copy(DEVOPS_Word.body_param.position);
            DEVOPS_Word.mesh_param.quaternion.copy(DEVOPS_Word.body_param.quaternion);
            cup.mesh_param.position.copy(cup.body_param.position);
            cup.mesh_param.quaternion.copy(cup.body_param.quaternion);
            plate.mesh_param.position.copy(plate.body_param.position);
            plate.mesh_param.quaternion.copy(plate.body_param.quaternion);
            watermelon.mesh_param.position.copy(watermelon.body_param.position);
            watermelon.mesh_param.quaternion.copy(watermelon.body_param.quaternion);
            banana.mesh_param.position.copy(banana.body_param.position);
            banana.mesh_param.quaternion.copy(banana.body_param.quaternion);

            //Test hitbox
            // banana.boxMesh_param.position.copy(banana.body_param.position);
            // banana.boxMesh_param.quaternion.copy(banana.body_param.quaternion);
        }

        function navigate(e) {
            if (e.type != 'keydown' && e.type != 'keyup' && e.type != 'restart') return;
            var keyup = e.type == 'keyup';
            vehicle.setBrake(0, 0);
            vehicle.setBrake(0, 1);
            vehicle.setBrake(0, 2);
            vehicle.setBrake(0, 3);

            var engineForce = 1600,
                maxSteerVal = 0.5;
            switch(e.keyCode) {

                case 38: // forward
                vehicle.applyEngineForce(keyup ? 0 : -engineForce, 2);
                vehicle.applyEngineForce(keyup ? 0 : -engineForce, 3);
                break;

                case 40: // backward
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
                chassisBody.position.x = 0;
                chassisBody.position.y = 2;
                chassisBody.position.z = 0;
                break;
            }
        }
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        }

        window.addEventListener('keydown', navigate)
        window.addEventListener('keyup', navigate)

        render();
    }
}
export default world;