var phi = 1.618033988749894848;
var pi = 3.14159265359;
var tau = 6.28318530717958;

// Setup three.js WebGL renderer
var renderer = new THREE.WebGLRenderer( { antialias: true } );

// Append the canvas element created by the renderer to document body element.
document.body.appendChild( renderer.domElement );

//Create a three.js scene
var scene = new THREE.Scene();

//Create a three.js camera
var camera = new THREE.PerspectiveCamera( 110, window.innerWidth / window.innerHeight, 0.01, 10000 );
scene.add(camera);

//Apply VR headset positional data to camera.
var controls = new THREE.VRControls( camera );

//Apply VR stereo rendering to renderer
var effect = new THREE.VREffect( renderer );
effect.setSize( window.innerWidth, window.innerHeight );

var everything = new THREE.Object3D();

//greyground
var planeGeometry = new THREE.PlaneGeometry( 100, 100, 50, 50 );
var planeMaterial = new THREE.MeshPhongMaterial( {side: THREE.DoubleSide, wireframe:false} );
var plane = new THREE.Mesh( planeGeometry, planeMaterial );
plane.rotation.x = -pi/2;
everything.add( plane );

//make particles
  var cubicles = new THREE.Geometry();
  var n = 21; //width of cube of particles
  var partCount = n*n*n;
  var cubeWidth = 1.0;

  for (var p = 0; p<partCount; p++){
    var part = new THREE.Vector3( //place particles in space particles yeah
          (p % n) / ( n - 1), //x position between 0 and 1 over and over
          (Math.floor(p/n) % n) / (n - 1),
          Math.floor(p/(n*n)) / (n - 1)
      );
    cubicles.vertices.push(part);
  }

  //colors:
  // var colors = [];
  // for( var i = 0; i < partCount; i++ ) {
  //     // random color
  //     colors[i] = new THREE.Color();
  //     // colors[i].setHSL( i/partCount, 1.0, 0.5 ); //hue by number
  //     // colors[i].setRGB(cubicles.vertices[i].x, cubicles.vertices[i].y, cubicles.vertices[i].z); // color cube rgb
  //     colors[i].setHSL(1, 1, i%2); //checkerboard
  // }

  var partMat = new THREE.PointCloudMaterial( {
    size: 0.01,
    //do the following if colors:
    // transparent: true,
    // opacity: 1,
    // vertexColors: THREE.VertexColors
    //do the following if puppies:
    map: THREE.ImageUtils.loadTexture("media/puppy.png"),
    blending: THREE.AdditiveBlending,
    transparent: true
  } );

  var particleSystem = new THREE.PointCloud(cubicles, partMat);

//if colors:
  // particleSystem.geometry.colors = colors;

  particleSystem.position.set(-cubeWidth/2,1,-cubeWidth/2);
  particleSystem.scale.set(cubeWidth, cubeWidth, cubeWidth);

  // particleSystem.sortParticles = false;
  particleSystem.frustumCulled = false;
  everything.add(particleSystem);

  //lights    
  var light = new THREE.PointLight( 0xffffff, 0.7, 100);
  light.position.set( -10,25,-2);
  light.castShadow = true;
  everything.add( light );

  scene.add(everything);

  camera.position.set(0, (1 + cubeWidth/2), 0);

/*
Request animation frame loop function
*/
function animate() {
  // TODO: Apply any desired changes for the next frame here.


  //Update VR headset position and apply to camera.
  controls.update();

  // Render the scene through the VREffect.
  effect.render( scene, camera );
  requestAnimationFrame( animate );
}

animate();	// Kick off animation loop



/***************** TODO: Generate Your VR Scene Above *****************/



/*
Listen for click event to enter full-screen mode.
We listen for single click because that works best for mobile for now
*/
document.body.addEventListener( 'click', function(){
  effect.setFullScreen( true );
})

/*
Listen for keyboard events
*/
function onkey(event) {
  event.preventDefault();

  if (event.keyCode == 90) { // z
    controls.resetSensor(); //zero rotation
  } else if (event.keyCode == 70 || event.keyCode == 13) { //f or enter
    effect.setFullScreen(true) //fullscreen
  } else if (event.keyCode == 77){ //m to toggle mono / stereo
    monoToggle = 1 - monoToggle;
  }
};
window.addEventListener("keydown", onkey, true);

/*
Handle window resizes
*/
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  effect.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize, false );
