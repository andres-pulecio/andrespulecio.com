import {
	BoxGeometry,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


let camera, scene, renderer, cube;

class Car {

	init() {

		camera = new PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 100 );
		camera.position.z = 10;

		scene = new Scene();

		const geometry = new BoxGeometry();
		const material = new MeshBasicMaterial({color: 0xFF2D00});

		const cube = new Mesh( geometry, material );

		scene.add( cube );
		
		renderer = new WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		
		window.addEventListener( 'resize', onWindowResize, false );
		
		const controls = new OrbitControls( camera, renderer.domElement );
		
		animate();
		
		document.onkeydown = keyboard; 
		
		function keyboard(e){
			console.log(e);
			if (e.keyCode === 37) {
				cube.position.x -= 0.1;	
			}
			if (e.keyCode === 39) {
				cube.position.x += 0.1;	
			}
			if (e.keyCode === 38) {
				cube.position.z -= 0.1;	
			}
			if (e.keyCode === 40) {
				cube.position.z += 0.1;	
			}
		}
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


export default Car;
