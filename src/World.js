import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import importModels from './importModels.js';
import importModelsSphere from './importModelsSphere.js';
import directionalLight from './directionalLight.js';

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
        //Load Page
        // const manager = new THREE.LoadingManager();
        // manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
        
        // 	console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
        
        // };


        //Car
        var CarMesh;
        var mailAnimationMesh;
        var linkedinAnimationMesh;


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
        chassisBody.position.set(0, 10, 0);
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

        //icosahedron physics body
        var icosahedronShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
        var icosahedronBody = new CANNON.Body({mass: 1});
        icosahedronBody.addShape(icosahedronShape);
        icosahedronBody.position.set(-85, 1, 93);
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
        
        const treeMedium = new importModels();
        treeMedium.init('../models/treeMedium.glb', scene, world, normalMaterial, q, 1, -12, 0, 3, 0.5, 1, 0.5, 0, 1);
        treeMedium.init('../models/treeMedium.glb', scene, world, normalMaterial, q, 1, -14, 0, -7, 0.5, 1, 0.5, 0, 1);
        treeMedium.init('../models/treeMedium.glb', scene, world, normalMaterial, q, 1, 4, 0, -12, 0.5, 1, 0.5, 0, 1);
        treeMedium.init('../models/treeMedium.glb', scene, world, normalMaterial, q, 1, 10, 0, -16, 0.5, 1, 0.5, 0, 1);
        treeMedium.init('../models/treeMedium.glb', scene, world, normalMaterial, q, 1, 18, 0, 150, 0.5, 1, 0.5, 0, 1);
        treeMedium.init('../models/treeMedium.glb', scene, world, normalMaterial, q, 1, 25, 0, 115, 0.5, 1, 0.5, 0, 1);
        
        //big Tree
        const treeBig = new importModels();
        treeBig.init('../models/treeBig.glb', scene, world, normalMaterial, q, 0.4, -15 , 0, 60, 1.2, 3, 1.8, 0, 1);
        treeBig.init('../models/treeBig2.glb', scene, world, normalMaterial, q, 0.4, 20, 0, 52, 1.2, 3, 1.8, 0, 1);
        treeBig.init('../models/treeBig.glb', scene, world, normalMaterial, q, 0.4, 30, 0, 100, 1.2, 3, 1.8, 0, 1);
        treeBig.init('../models/treeBig2.glb', scene, world, normalMaterial, q, 0.4, -60, 0, 45, 1.2, 3, 1.8, 0, 1);
        
        //Dead tree
        const treeDead = new importModels();
        treeDead.init('../models/treeDead1.glb', scene, world, normalMaterial, q, 0.4, -7 , 0, 150, 0.4, 3, 0.4, 0, 1);
        treeDead.init('../models/treeDead2.glb', scene, world, normalMaterial, q, 0.4, -7 , 0, 200, 0.4, 3, 0.4, 0, 1);
        treeDead.init('../models/treeDead3.glb', scene, world, normalMaterial, q, 0.4, -30 , 0, 180, 0.4, 3, 0.4, 0, 1);
        treeDead.init('../models/treeDead2.glb', scene, world, normalMaterial, q, 0.4, 97 , 0, 70, 0.4, 3, 0.4, 0, 1);
        treeDead.init('../models/treeDead1.glb', scene, world, normalMaterial, q, 0.4, -5 , 0, -9, 0.4, 3, 0.4, 0, 1);
        treeDead.init('../models/treeDead3.glb', scene, world, normalMaterial, q, 0.4, -45 , 0, 110, 0.4, 3, 0.4, 0, 1);

        //fence    
        const fence = new importModels();
        fence.init('../models/fence.glb', scene, world, normalMaterial, q, 2, 90, 0, 72, 0.4, 1, 2, 0, 1);

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
        for (var i=0; i<30; i=i+1.2) {
            zPosition = 72;
            xPosition = 2;
            tile.init('../models/tile.glb', scene, world, normalMaterial, q, 1, xPosition + (i*3), 0, zPosition -2 + getRndInteger(1, 5) , 1, 0.1, 1, 0, 1);
            //Path center to proyects
        }
        //Path center to information
        for (var i=0; i<35; i=i+1.2) {
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
        //Path to studies
        for (var i=0; i<30; i=i+1.2) {
            zPosition = 125;
            xPosition = 2;
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
        const signStudies = new importModels();
        signStudies.init('../models/signStudies.glb', scene, world, normalMaterial, q, 0.4, 6 , 0, 120, 0.2, 2, 0.2, 0, 1);
        const signContact = new importModels();
        signContact.init('../models/signContact.glb', scene, world, normalMaterial, q, 0.4, -6 , 0, 155, 0.2, 2, 0.2, 0, 1);
        const signConstruction = new importModels();
        signConstruction.init('../models/signConstruction.glb', scene, world, normalMaterial, q, 2.6, 91, 0, 68, 0.2, 2, 0.2, 0, 1);
        //location
        const location = new importModels();
        location.init('../models/location.glb', scene, world, normalMaterial, q, 1, -8 , 0, 100, 1, 2, 0.3, 0, 1);
        //flag
        const flag = new importModels();
        flag.init('../models/flag.glb', scene, world, normalMaterial, q, 2.5, -7.6 , 0, 99, 0.2, 1.2, 0.2, 0, 1);
        //cup
        const cup = new importModels();
        cup.init('../models/cup.glb', scene, world, normalMaterial, q, 1, -4.2 , 0.5, 103.7, 0.7, 0.5, 0.7, 1, 1);
        //cones
        const cone1 = new importModels();
        cone1.init('../models/cone.glb', scene, world, normalMaterial, q, 2, 85 , 1, 70, 0.4, 0.9, 0.4, 1, 1);
        const cone2 = new importModels();
        cone2.init('../models/cone.glb', scene, world, normalMaterial, q, 2, 85 , 1, 72, 0.4, 0.9, 0.4, 1, 1);
        const cone3 = new importModels();
        cone3.init('../models/cone.glb', scene, world, normalMaterial, q, 2, 85 , 1, 74, 0.4, 0.9, 0.4, 1, 1);
        const cone4 = new importModels();
        cone4.init('../models/cone.glb', scene, world, normalMaterial, q, 2, 85 , 1, 76, 0.4, 0.9, 0.4, 1, 1);
        //plate
        const plate = new importModels();
        plate.init('../models/plate.glb', scene, world, normalMaterial, q, 1, -4.2 , 0, 103.7, 2, 0.4, 2, 1, 1);
        //Palm
        const palm = new importModels();
        palm.init('../models/palm.glb', scene, world, normalMaterial, q, 2, -11 , 0, 96, 0.3, 1.5, 0.3, 0, 1);
        //Watermelon
        const watermelon = new importModels();
        watermelon.init('../models/watermelon.glb', scene, world, normalMaterial, q, 12, -5 , 0.5, 99, 1.1, 1.1, 0.5, 1, 1);
        //Banana
        const banana = new importModels();
        banana.init('../models/banana.glb', scene, world, normalMaterial, q, 10, -5 , 0.5, 97.7, 1, 0.5, 0.5, 1, 1);
        //Python
        const python = new importModels();
        python.init('../models/python.glb', scene, world, normalMaterial, q, 0.08, 59 , 2.5, 113, 2.6, 2.6, 0.5, 1, 1);
        //linuxPenguin
        const linuxPenguin = new importModels();
        linuxPenguin.init('../models/linuxPenguin.glb', scene, world, normalMaterial, q, 0.15, 72 , 2, 113, 1.5, 2, 1, 1, 1);
        //github
        const github = new importModels();
        github.init('../models/github.glb', scene, world, normalMaterial, q, 0.6, -33 , 4, 156, 1.5, 3.8, 1.5, 1, 1);
        //linkedin
        const linkedin = new importModels();
        linkedin.init('../models/linkedin.glb', scene, world, normalMaterial, q, 1, -24 , 2.5, 156, 2.6, 2.6, 1, 1, 1);
        //mailbox
        const mailbox = new importModels();
        mailbox.init('../models/mailbox.glb', scene, world, normalMaterial, q, 0.02, -15 , 0, 156, 0.3, 2, 0.3, 0, 1);      
        //fenceWood    
        const fenceWood = new importModels();
        for (var i=0; i>-5; i=i-1.2) {
            zPosition = 53;
            xPosition = -65;
            fenceWood.init('../models/fenceWood.glb', scene, world, normalMaterial, q, 2, xPosition + (i*7) , 0, zPosition -2, 3.7, 1, 0.4, 0, 1);
        }
        for (var i=0; i>-5; i=i-1.2) {
            zPosition = 67;
            xPosition = -65;
            fenceWood.init('../models/fenceWood.glb', scene, world, normalMaterial, q, 2, xPosition + (i*7) , 0, zPosition -2, 3.7, 1, 0.4, 0, 1);
        }
        for (var i=0; i>-5; i=i-1.2) {
            zPosition = 81;
            xPosition = -65;
            fenceWood.init('../models/fenceWood.glb', scene, world, normalMaterial, q, 2, xPosition + (i*7) , 0, zPosition -2, 3.7, 1, 0.4, 0, 1);
        }
        //bowlingBall
        const bowlingBall = new importModelsSphere();
        bowlingBall.init('../models/bowlingBall.glb', scene, world, normalMaterial, q, 10, -70 , 2, 72, 1, 0.5);
        const bowlingBall2 = new importModelsSphere();
        bowlingBall2.init('../models/bowlingBall.glb', scene, world, normalMaterial, q, 10, -70 , 2, 58, 1, 0.5);
        //pins
        xPosition = -90;
        zPosition = 72;
        separation = 1;
        const pin1 = new importModels();
        pin1.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition , 2, zPosition, 0.4, 2, 0.4, 0.1, 1);
        
        const pin2 = new importModels();
        pin2.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 1, 2, zPosition + separation * 1, 0.4, 2, 0.4, 0.1, 1);
        const pin3 = new importModels();
        pin3.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 1, 2, zPosition - separation * 1, 0.4, 2, 0.4, 0.1, 1);
        
        const pin4 = new importModels();
        pin4.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 2, 2, zPosition + separation * 2, 0.4, 2, 0.4, 0.1, 1);
        const pin5 = new importModels();
        pin5.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 2, 2, zPosition                 , 0.4, 2, 0.4, 0.1, 1);
        const pin6 = new importModels();
        pin6.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 2, 2, zPosition - separation * 2, 0.4, 2, 0.4, 0.1, 1);
        
        const pin7 = new importModels();
        pin7.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 3, 2, zPosition + separation * 3, 0.4, 2, 0.4, 0.1, 1);
        const pin8 = new importModels();
        pin8.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 3, 2, zPosition + separation * 1, 0.4, 2, 0.4, 0.1, 1);
        const pin9 = new importModels();
        pin9.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 3, 2, zPosition - separation * 1, 0.4, 2, 0.4, 0.1, 1);
        const pin10 = new importModels();
        pin10.init('../models/pins.glb', scene, world, normalMaterial, q, 10, xPosition - separation * 3, 2, zPosition - separation * 3, 0.4, 2, 0.4, 0.1, 1);
        
        const stoneDecoration1 = new importModels();
        stoneDecoration1.init('../models/stoneDecoration.glb', scene, world, normalMaterial, q, 1, -85, 0, 87, 0.8, 0.8, 0.8, 0, 1);
        stoneDecoration1.init('../models/stoneDecoration.glb', scene, world, normalMaterial, q, 1, 25, 0, 155, 0.8, 0.8, 0.8, 0, 1);
        //Dice
        const dice1 = new importModels();
        dice1.init('../models/dice.glb', scene, world, normalMaterial, q, 0.2, -75, 2, 90, 2, 2, 2, 1, 1);
        const dice2 = new importModels();
        dice2.init('../models/dice.glb', scene, world, normalMaterial, q, 0.2, -78, 2, 93, 2, 2, 2, 1, 1);
        //Domino
        separation = 4; 
        const domino1 = new importModels();
        domino1.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino2 = new importModels();
        domino2.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 1, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino3 = new importModels();
        domino3.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 2, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino4 = new importModels();
        domino4.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 3, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino5 = new importModels();
        domino5.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 4, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino6 = new importModels();
        domino6.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 5, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino7 = new importModels();
        domino7.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 6, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino8 = new importModels();
        domino8.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 7, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
        const domino9 = new importModels();
        domino9.init('../models/domino.glb', scene, world, dominoMaterial, q, 40, -90 - separation * 8, 2.7, 58, 0.1, 2.7, 1.5, 1, 1);
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


        //wall-e
        const wall_e = new importModels();
        wall_e.init('../models/r2d2.glb', scene, world, normalMaterial, q, 3, 12 , 0.01, 135, 2.3, 1.2, 2, 0, 1);
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
        keysMessage.init('../models/keysMessage.glb', scene, world, normalMaterial, q, 5, 0, 0.01, 3, 0.1, 0.1, 0.1, 0, 1);
        const restartMessage = new importModels();
        restartMessage.init('../models/restartMessage.glb', scene, world, normalMaterial, q, 5, 3, 0.01, 8, 0.1, 0.1, 0.1, 0, 1);
        const certificationsMessage = new importModels();
        certificationsMessage.init('../models/certificationsMessage.glb', scene, world, normalMaterial, q, 3, 35 , 0.01, 113, 0.1, 0.1, 0.1, 0, 1);
        const activitiesMessage = new importModels();
        activitiesMessage.init('../models/activitiesMessage.glb', scene, world, normalMaterial, q, 2, 0 , 0.01, 183, 0.1, 0.1, 0.1, 0, 1);
        const mailMessage = new importModels();
        mailMessage.init('../models/mailMessage.glb', scene, world, normalMaterial, q, 3, -15 , 0.01, 162, 0.1, 0.1, 0.1, 0, 1);

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
            // console.log(chassisBody.position);
            // update the chassis position
            // box.position.copy(chassisBody.position);
            // box.quaternion.copy(chassisBody.quaternion);
            // box.getWorldPosition(objectPosition);
            // update the sphare position

            // update the icosahedron position
            icosahedronMesh.position.copy(icosahedronBody.position);
            icosahedronMesh.quaternion.copy(icosahedronBody.quaternion);

            camera.position.x = chassisBody.position.x + cameraOffset.x;
            camera.position.z = chassisBody.position.z + cameraOffset.z;

            sunlight.position.copy(chassisBody.position).add(lightOffset);
            plane.position.x = chassisBody.position.x + planeOffset.x;
            plane.position.z = chassisBody.position.z + planeOffset.z;


        }
        
        clockButterfly = new THREE.Clock();
        clockMail = new THREE.Clock();
        clockLinkedin = new THREE.Clock();
        clockGithub= new THREE.Clock();
        
        function render() {           


            requestAnimationFrame(render);
            renderer.render(scene, camera);
            CarMesh.position.copy(chassisBody.position);
            CarMesh.quaternion.copy(chassisBody.quaternion);
            updatePhysics();

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
            python.mesh_param.position.copy(python.body_param.position);
            python.mesh_param.quaternion.copy(python.body_param.quaternion);
            linuxPenguin.mesh_param.position.copy(linuxPenguin.body_param.position);
            linuxPenguin.mesh_param.quaternion.copy(linuxPenguin.body_param.quaternion);
            linkedin.mesh_param.position.copy(linkedin.body_param.position);
            linkedin.mesh_param.quaternion.copy(linkedin.body_param.quaternion);
            github.mesh_param.position.copy(github.body_param.position);
            github.mesh_param.quaternion.copy(github.body_param.quaternion);
            cone1.mesh_param.position.copy(cone1.body_param.position);
            cone1.mesh_param.quaternion.copy(cone1.body_param.quaternion);        
            cone2.mesh_param.position.copy(cone2.body_param.position);
            cone2.mesh_param.quaternion.copy(cone2.body_param.quaternion);        
            cone3.mesh_param.position.copy(cone3.body_param.position);
            cone3.mesh_param.quaternion.copy(cone3.body_param.quaternion);        
            cone4.mesh_param.position.copy(cone4.body_param.position);
            cone3.mesh_param.quaternion.copy(cone3.body_param.quaternion);        
            cone4.mesh_param.position.copy(cone4.body_param.position);
            cone4.mesh_param.quaternion.copy(cone4.body_param.quaternion);        
            bowlingBall.mesh_param.position.copy(bowlingBall.body_param.position);
            bowlingBall.mesh_param.quaternion.copy(bowlingBall.body_param.quaternion);        
            bowlingBall2.mesh_param.position.copy(bowlingBall2.body_param.position);
            bowlingBall2.mesh_param.quaternion.copy(bowlingBall2.body_param.quaternion);        
            pin1.mesh_param.position.copy(pin1.body_param.position);
            pin1.mesh_param.quaternion.copy(pin1.body_param.quaternion);        
            pin2.mesh_param.position.copy(pin2.body_param.position);
            pin2.mesh_param.quaternion.copy(pin2.body_param.quaternion);        
            pin3.mesh_param.position.copy(pin3.body_param.position);
            pin3.mesh_param.quaternion.copy(pin3.body_param.quaternion);        
            pin4.mesh_param.position.copy(pin4.body_param.position);
            pin4.mesh_param.quaternion.copy(pin4.body_param.quaternion);        
            pin5.mesh_param.position.copy(pin5.body_param.position);
            pin5.mesh_param.quaternion.copy(pin5.body_param.quaternion);        
            pin6.mesh_param.position.copy(pin6.body_param.position);
            pin6.mesh_param.quaternion.copy(pin6.body_param.quaternion);        
            pin7.mesh_param.position.copy(pin7.body_param.position);
            pin7.mesh_param.quaternion.copy(pin7.body_param.quaternion);        
            pin8.mesh_param.position.copy(pin8.body_param.position);
            pin8.mesh_param.quaternion.copy(pin8.body_param.quaternion);        
            pin9.mesh_param.position.copy(pin9.body_param.position);
            pin9.mesh_param.quaternion.copy(pin9.body_param.quaternion);        
            pin10.mesh_param.position.copy(pin10.body_param.position);
            pin10.mesh_param.quaternion.copy(pin10.body_param.quaternion);        
            dice1.mesh_param.position.copy(dice1.body_param.position);
            dice1.mesh_param.quaternion.copy(dice1.body_param.quaternion);        
            dice2.mesh_param.position.copy(dice2.body_param.position);
            dice2.mesh_param.quaternion.copy(dice2.body_param.quaternion);        
            
            domino1.mesh_param.position.copy(domino1.body_param.position);
            domino1.mesh_param.quaternion.copy(domino1.body_param.quaternion);        
            domino2.mesh_param.position.copy(domino2.body_param.position);
            domino2.mesh_param.quaternion.copy(domino2.body_param.quaternion);        
            domino3.mesh_param.position.copy(domino3.body_param.position);
            domino3.mesh_param.quaternion.copy(domino3.body_param.quaternion);        
            domino4.mesh_param.position.copy(domino4.body_param.position);
            domino4.mesh_param.quaternion.copy(domino4.body_param.quaternion);        
            domino5.mesh_param.position.copy(domino5.body_param.position);
            domino5.mesh_param.quaternion.copy(domino5.body_param.quaternion);        
            domino6.mesh_param.position.copy(domino6.body_param.position);
            domino6.mesh_param.quaternion.copy(domino6.body_param.quaternion);        
            domino7.mesh_param.position.copy(domino7.body_param.position);
            domino7.mesh_param.quaternion.copy(domino8.body_param.quaternion);        
            domino8.mesh_param.position.copy(domino8.body_param.position);
            domino8.mesh_param.quaternion.copy(domino8.body_param.quaternion);        
            domino9.mesh_param.position.copy(domino9.body_param.position);
            domino9.mesh_param.quaternion.copy(domino9.body_param.quaternion);        
            mixers();
            contactLinks();
            //Test hitbox
            // fence.boxMesh_param.position.copy(fence.body_param.position);
            // fence.boxMesh_param.quaternion.co8y(fenc3.body_param.quaternion);
        }

        function navigate(e) {
            if (e.type != 'keydown' && e.type != 'keyup') return;
            var keyup = e.type == 'keyup';
            vehicle.setBrake(4, 0);
            vehicle.setBrake(4, 1);
            vehicle.setBrake(4, 2);
            vehicle.setBrake(4, 3);

            var engineForce = 1000,
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
                chassisBody.position.y = 5;
                chassisBody.position.z = 0;
                chassisBody.quaternion.set(0,0,0,1);
                break;
            }
        }
        function getRndInteger(min, max) {
            return Math.floor(Math.random() * (max - min) ) + min;
        }
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
        window.addEventListener('keydown', contactLinks)
        window.addEventListener('keyup', contactLinks)
        
        window.addEventListener('keydown', navigate)
        window.addEventListener('keyup', navigate)

        render();
    }
}
export default world;