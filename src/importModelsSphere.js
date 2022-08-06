import * as THREE from 'three';
import * as CANNON from "cannon-es";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//This class imports blender models in GLTF format and assigns them a hitbox

class importModels {
    constructor() {
        this.mesh_param 
        this.boxMesh_param 
        this.body_param
    }
	init(modelPath, scene, world, modelMaterial, q, modelscale,xPosition,yPosition,zPosition,Scale, modelMass) {
        const loaderStone = new GLTFLoader();
        loaderStone.load(modelPath, 
        (gltf) => {
            const Mesh = gltf.scene;
            Mesh.scale.set(Mesh.scale.x * modelscale, Mesh.scale.y * modelscale, Mesh.scale.z * modelscale);
            Mesh.position.set(xPosition, yPosition,zPosition);
            scene.add(Mesh);
            //hit box 
            var sphereShape = new CANNON.Sphere(Scale);
            const cubeBody = new CANNON.Body({
                mass: modelMass, // mass = 0 makes the body static
            })
            cubeBody.addShape(sphereShape)
            cubeBody.position.set(xPosition, yPosition,zPosition);
            world.addBody(cubeBody);

            //Test hitbox
            
            // const cubeGeometry = new THREE.BoxGeometry(Scale * 2,yScale * 2,zScale * 2)
            // const cubeMesh = new THREE.Mesh(cubeGeometry, modelMaterial)
            // scene.add(cubeMesh)
            // this.boxMesh_param = cubeMesh

            this.mesh_param = Mesh
            this.body_param = cubeBody
        });
    }
}
export default importModels;