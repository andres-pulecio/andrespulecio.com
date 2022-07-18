import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// let World, SAPBroadphase, vehicle;
let vehicle, objectPosition,cameraOffset;

class Car {
	init() {
        objectPosition = new THREE.Vector3();
        cameraOffset = new THREE.Vector3(5, 10, 10);

        var container = document.querySelector('body'),
            w = container.clientWidth,
            h = container.clientHeight,
            scene = new THREE.Scene(),
            camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100),
            renderConfig = {antialias: true, alpha: true},
            renderer = new THREE.WebGLRenderer(renderConfig);
            
            camera.position.set(5, 10, 10);            
            camera.lookAt(0,0,0);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(w, h);
            container.appendChild(renderer.domElement);
            
            // object.getWorldPosition(objectPosition);

            window.addEventListener('resize', function() {
                w = container.clientWidth;
                h = container.clientHeight;
                camera.aspect = w/h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            })
                        
            // camera.position.copy(objectPosition).add(cameraOffset);
            
            var geometry = new THREE.PlaneGeometry(10, 10, 10);
            var material = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});
            var plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = Math.PI/2;
            scene.add(plane);
            
            var sunlight = new THREE.DirectionalLight(0xffffff, 1.0);
            sunlight.position.set(-10, 10, 0);
            scene.add(sunlight)
            
            /**
             * Physics
             **/
            var world = new CANNON.World();
            world.broadphase = new CANNON.SAPBroadphase(world);
            world.gravity.set(0, -10, 0);
            world.defaultContactMaterial.friction = 0;
            
            var groundMaterial = new CANNON.Material('groundMaterial');
            var wheelMaterial = new CANNON.Material('wheelMaterial');
            var wheelGroundContactMaterial = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
                friction: 0.3,
                restitution: 0,
                contactEquationStiffness: 1000,
            });
            
            world.addContactMaterial(wheelGroundContactMaterial);
            
            // car physics body
            var chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.3, 2));
            var chassisBody = new CANNON.Body({mass: 150});
            chassisBody.addShape(chassisShape);
            chassisBody.position.set(0, 1, 0);
            chassisBody.angularVelocity.set(0, 0, 0); // initial velocity
            
            // car visual body
            var geometry = new THREE.BoxGeometry(2, 0.6, 4); // double chasis shape
            var material = new THREE.MeshBasicMaterial({color: 0x5DADE2, side: THREE.DoubleSide});
            var box = new THREE.Mesh(geometry, material);
            scene.add(box);
            
            // parent vehicle object
            vehicle = new CANNON.RaycastVehicle({
                chassisBody: chassisBody,
                indexRightAxis: 0, // x
                indexUpAxis: 1, // y
                indexForwardAxis: 2, // z
            });
            
            // wheel options
            var options = {
                radius: 0.3,
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
                maxSuspensionTravel: 0.25,
                customSlidingRotationalSpeed: -30,
                useCustomSlidingRotationalSpeed: true,
            };
            
            var axlewidth = 0.7;
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
                var geometry = new THREE.CylinderGeometry( wheel.radius, wheel.radius, 0.4, 32 );
                var material = new THREE.MeshPhongMaterial({
                    color: 0xd0901d,
                    emissive: 0xaa0000,
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
            
            // import models from blender
            const loaderTree1 = new GLTFLoader();
            loaderTree1.load('../models/tree-poly.glb', 
            (gltf) => {
                const treePolyMesh = gltf.scene;
                treePolyMesh.scale.set(treePolyMesh.scale.x * 0.4, treePolyMesh.scale.y * 0.4, treePolyMesh.scale.z * 0.4);
                treePolyMesh.position.set(5, 0.1, -7);
                scene.add(treePolyMesh);
            });
            const loaderTree2 = new GLTFLoader();
            loaderTree2.load('../models/tree-poly.glb', 
            (gltf) => {
                const treePolyMesh = gltf.scene;
                treePolyMesh.scale.set(treePolyMesh.scale.x * 0.2, treePolyMesh.scale.y * 0.2, treePolyMesh.scale.z * 0.2);
                treePolyMesh.position.set(6, 0.1, 4);
                treePolyMesh.rotateY(Math.PI/2);
                scene.add(treePolyMesh);
            });
            const loaderTree3 = new GLTFLoader();
            loaderTree2.load('../models/tree-poly.glb', 
            (gltf) => {
                const treePolyMesh = gltf.scene;
                treePolyMesh.scale.set(treePolyMesh.scale.x * 0.3, treePolyMesh.scale.y * 0.3, treePolyMesh.scale.z * 0.3);
                treePolyMesh.position.set(-6, 0.1, 4);
                treePolyMesh.rotateY(Math.PI/8);
                scene.add(treePolyMesh);
            });

            //light or sun
            const light= new THREE.PointLight(0xffffff,2,200);
            light.position.set(4.5,10,4.5);
            scene.add(light);


            /**
             * Main
             **/
            
            function updatePhysics() {
                world.step(1/60);
                // update the chassis position
                box.position.copy(chassisBody.position);
                box.quaternion.copy(chassisBody.quaternion);
                box.getWorldPosition(objectPosition);
                // console.log(objectPosition);
                camera.position.copy(objectPosition).add(cameraOffset);
            }
            
            function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        updatePhysics();
        }

        function navigate(e) {
        if (e.type != 'keydown' && e.type != 'keyup') return;
        var keyup = e.type == 'keyup';
        vehicle.setBrake(0, 0);
        vehicle.setBrake(0, 1);
        vehicle.setBrake(0, 2);
        vehicle.setBrake(0, 3);

        var engineForce = 800,
            maxSteerVal = 0.3;
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
        }
        }

        window.addEventListener('keydown', navigate)
        window.addEventListener('keyup', navigate)

        render();
    }
}
export default Car;