import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let vehicle, objectPosition,cameraOffset,vehicle1;

class Car {
	init() {
        var CarMesh;
        objectPosition = new THREE.Vector3();
        cameraOffset = new THREE.Vector3(8, 9, 16);
        // cameraOffset = new THREE.Vector3(0, 5, 0);
        
        var normalMaterial = new THREE.MeshNormalMaterial()
        normalMaterial.friction = 0.25;
        normalMaterial.restitution = 0.25;

        var container = document.querySelector('body'),
            w = container.clientWidth,
            h = container.clientHeight,
            scene = new THREE.Scene(),
            camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100),
            renderConfig = {antialias: true, alpha: true},
            renderer = new THREE.WebGLRenderer(renderConfig);
            
            camera.position.set(8, 9, 16);
            // camera.position.set(0, 5, 0);
            camera.lookAt(0,0,0);
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
                                    
            var geometry = new THREE.PlaneGeometry(100, 100, 100);
            var material = new THREE.MeshBasicMaterial({color: 0x6FE25D, side: THREE.DoubleSide});
            var plane = new THREE.Mesh(geometry, material);
            plane.rotation.x = Math.PI/2;
            scene.add(plane);
            
            var sunlight = new THREE.DirectionalLight(0xF9E79F, 1.0);
            sunlight.position.set(-100, 10, 0);
            scene.add(sunlight)
            
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
            var chassisShape = new CANNON.Box(new CANNON.Vec3(1, 0.3, 2));
            var chassisBody = new CANNON.Body({mass: 150});
            chassisBody.addShape(chassisShape);
            chassisBody.position.set(0, 1, 0);
            chassisBody.angularVelocity.set(0, 0, 0); // initial velocity
            world.addBody(chassisBody)
            
            // car visual body
            var geometry = new THREE.BoxGeometry(2, 0.6, 4); // double chasis shape
            var material = new THREE.MeshBasicMaterial({color: 0xC39BD3, side: THREE.DoubleSide});
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
                    color: 0x6FE25D,
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


            //box physics body
            var boxShape = new CANNON.Box(new CANNON.Vec3(2, 2, 2));
            var boxBody = new CANNON.Body({mass: 1});
            boxBody.addShape(boxShape);
            boxBody.position.set(5, 1, 3);
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
            sphereBody.position.set(5, 5, 5);
            sphereBody.angularVelocity.set(0, 0, 0); // initial velocity
            world.addBody(sphereBody)

            // sphere visual body
            var sphereGeometry = new THREE.SphereGeometry()
            var sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
            scene.add(sphereMesh)

            //icosahedron physics body
            var icosahedronShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1));
            var icosahedronBody = new CANNON.Body({mass: 1});
            icosahedronBody.addShape(icosahedronShape);
            icosahedronBody.position.set(-5, 1, -2.5);
            icosahedronBody.angularVelocity.set(0, 0, 0); // initial velocity
            world.addBody(icosahedronBody)
            
            //icosahedron visual body
            var icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
            var icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
            icosahedronMesh.castShadow = true
            scene.add(icosahedronMesh)




            // import models from blender
            const loaderTree1 = new GLTFLoader();
            loaderTree1.load('../models/tree-poly.glb', 
            (gltf) => {
                const treePolyMesh = gltf.scene;
                treePolyMesh.scale.set(treePolyMesh.scale.x * 0.4, treePolyMesh.scale.y * 0.4, treePolyMesh.scale.z * 0.4);
                treePolyMesh.position.set(5, 0, -7);
                treePolyMesh.rotateY(Math.PI/2);
                scene.add(treePolyMesh);
                //hit box trees
                const cubeShapeTree = new CANNON.Box(new CANNON.Vec3(1.5, 1.5, 1.5))//must be the double from gemoetry
                const cubeBodyTree = new CANNON.Body({
                    mass: 0, // mass = 0 makes the body static
                    material: groundMaterial,
                    shape: new CANNON.Plane(),
                    quaternion: new CANNON.Quaternion(-q._x, q._y, q._z, q._w)
                })
                cubeBodyTree.addShape(cubeShapeTree)
                cubeBodyTree.position.x = treePolyMesh.position.x 
                cubeBodyTree.position.y = treePolyMesh.position.y
                cubeBodyTree.position.z = treePolyMesh.position.z
                world.addBody(cubeBodyTree)
            });

            // var loaderCar = new GLTFLoader();
            // loaderCar.load('../models/poly-car.glb', 
            // function(gltf){
            //     var CarMesh = gltf.scene;
            //     CarMesh.scale.set(CarMesh.scale.x * 1, CarMesh.scale.y * 1, CarMesh.scale.z * 1);
            //     // CarMesh.position.set(5, 0, 7);
            //     // CarMesh.rotateY(Math.PI/2);
            //     scene.add(CarMesh);
            // });
            
            
            var loaderCar = new GLTFLoader();
            loaderCar.load('../models/poly-car.glb', 
            (gltf) => {
                CarMesh = gltf.scene;
                CarMesh.scale.set(CarMesh.scale.x * 1, CarMesh.scale.y * 1 ,CarMesh.scale.z * 1);
                CarMesh.position.set(0, 0, 0);
                scene.add(CarMesh);
            }
            );       

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
                // update the sphare position
                sphereMesh.position.copy(sphereBody.position);
                sphereMesh.quaternion.copy(sphereBody.quaternion);
                // update the box position
                boxMesh.position.copy(boxBody.position);
                boxMesh.quaternion.copy(boxBody.quaternion);
                // update the icosahedron position
                icosahedronMesh.position.copy(icosahedronBody.position);
                icosahedronMesh.quaternion.copy(icosahedronBody.quaternion);

                camera.position.copy(objectPosition).add(cameraOffset);
            }
            
        function render() {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
        updatePhysics();
        CarMesh.position.copy(chassisBody.position);
        CarMesh.quaternion.copy(chassisBody.quaternion);
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