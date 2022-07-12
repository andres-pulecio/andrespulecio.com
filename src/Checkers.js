import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
    Group,
	WebGLRenderer,
	PointLight
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var camera, scene, renderer, cube, controls, draughts, board;

class App {

	init() {
		draughts = new Draughts();
		console.log(draughts.fen());

		camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 1000 );
		camera.position.z = 4;

		scene = new Scene();

		const square = new BoxGeometry(1, 0.1, 1);
		const lightsquare = new MeshBasicMaterial({color: 0xE0C4A8});
		const darksquare = new MeshBasicMaterial({color: 0x6A4236});
        const board = new Group();
        
		let squareNumber = 1;
        for (let x = 0; x < 10; x++) {
            for (let z = 0; z < 10; z++) {
                let cube;
                if (z % 2 == 0) {
                    cube = new Mesh(square, x % 2 == 0 ? lightsquare : darksquare);
					if(x % 2 != 0){
						cube.userData.squareNumber = squareNumber;
						squareNumber ++;
					}
                } else {
                    cube = new Mesh(square, x % 2 == 0 ? darksquare : lightsquare);
					if(x % 2 == 0){
						cube.userData.squareNumber = squareNumber;
						squareNumber ++;
					}
                }   
                cube.position.set(x, 0, z);
                board.add(cube);
            }
        }

		const cube = new Mesh( square, lightsquare );
		scene.add( board );
		
		const loader = new GLTFLoader();
		loader.load('../models/checker.glb', 
		(gltf) => {
			const checkerMesh = gltf.scene;
			checkerMesh.scale.set(checkerMesh.scale.x * 0.4, checkerMesh.scale.y * 0.4, checkerMesh.scale.z * 0.4);
			checkerMesh.position.y += checkerMesh.scale.y - 0.3;
			scene.add(checkerMesh);
			// addCheckers(checkerMesh);
		});

		renderer = new WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		
		window.addEventListener( 'resize', onWindowResize, false );
		
		const light= new PointLight(0xffffff,2,200);
        light.position.set(4.5,10,4.5);
		scene.add(light);

		camera.position.y = 1;
		camera.position.z = 3;
		
		const controls = new OrbitControls( camera, renderer.domElement );
		controls.target.set(4.5, 0 , 4.5)
		controls.enablePan = false
		controls.maxPolarAngle = Math.PI / 2;
		controls.enableDamping = true;
		controls.update();

		
		animate();
		
	}
	
}

function onWindowResize() {
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	
	renderer.setSize( window.innerWidth, window.innerHeight );
	
}

function animate() {
	
	requestAnimationFrame( animate );
	renderer.render( scene, camera );

}

function positionForSquare(square){
	const found = board.children.find((child) => child.userData.squareNumber == square);
	if(found)
		return found.position;
	return null;
}

function addCheckers(checkerMesh) {
	console.log(draughts.fen());
   
	for (let i = 0; i < 1; i++) {
		let pieceOn = draughts.get(i);
		const piece = checkerMesh.clone(true);
		const squarePosition = positionForSquare(i);
   
	  if (pieceOn === 'b') {
		piece.material = new MeshStandardMaterial({color:0x222222});
		piece.userData.color = 'b';
		piece.userData.currentSquare = i;
		piece.position.set(squarePosition.x, piece.position.y, squarePosition.z);
		scene.add(piece);
	} else if (pieceOn === 'w') {
		piece.material = new MeshStandardMaterial({color:0xEEEEEE});
		piece.userData.color = 'w';
		piece.userData.currentSquare = i;
		piece.position.set(squarePosition.x, piece.position.y, squarePosition.z);
		scene.add(piece);
	  }
	}
  }

export default App;
