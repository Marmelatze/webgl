require({
    baseUrl: 'js',
    // three.js should have UMD support soon, but it currently does not
    shim:    {
        'vendor/three': { exports: 'THREE' },
        'vendor/TrackballControls': {
            deps: ['vendor/three'],
            exports: 'THREE'
        }
    }
}, [
    'vendor/three',
    'vendor/TrackballControls'
], function (THREE) {

    var camera, controls, scene, renderer;
    var geometry, material, mesh;

    init();
    animate();

    function init() {

        camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);
        camera.position.set(0, 0, 1800);

        scene = new THREE.Scene();

        scene.fog = new THREE.Fog(0xffffff, 1, 5000);
        scene.fog.color.setHSL(0.6, 0, 1);

        // Controls
        controls = new THREE.TrackballControls( camera );

        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;

        controls.noZoom = false;
        controls.noPan = false;

        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.15;

        // LIGHTS

        var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        hemiLight.color.setHSL(0.6, 1, 0.6);
        hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        hemiLight.position.set(0, 400, 0);
        scene.add(hemiLight);

        // directional light

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(0, 800, -400);
        dirLight.target.position.set( 0, 0, -200 );

        scene.add(dirLight);
        dirLight.castShadow = true;

        dirLight.shadowMapWidth = 2048;
        dirLight.shadowMapHeight = 2048;

        var d = 500;

        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;

        dirLight.shadowCameraFar = 1000;
        dirLight.shadowBias = -0.0001;
        dirLight.shadowDarkness = 0.35;
        dirLight.shadowCameraVisible = true;

        //scene.add( new THREE.AmbientLight( 0x111111 ) );

/*
        var spotLight = new THREE.SpotLight( 0xffffff, 1.15 );
        spotLight.position.set( 300, 3000, 0 );
        spotLight.castShadow = true;
        spotLight.shadowCameraVisible = true;
        spotLight.shadowMapWidth = 1024; // default is 512
        spotLight.shadowMapHeight = 1024; // default is 512
        scene.add( spotLight );*/
/*
        var pointLight = new THREE.PointLight( 0xff4400, 1.5 );
        pointLight.position.set( 0, 0, 0 );
        scene.add( pointLight );
*/
        // GROUND

        var groundGeo = new THREE.PlaneGeometry(10000, 10000);
        var groundMat = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xffffff, specular: 0x050505 });
        groundMat.color.setHSL(0.095, 1, 0.75);

        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -33;
        scene.add(ground);

        ground.receiveShadow = true;

        // SKYDOME

        var vertexShader = document.getElementById('vertexShader').textContent;
        var fragmentShader = document.getElementById('fragmentShader').textContent;
        var uniforms = {
            topColor:    { type: 'c', value: new THREE.Color(0x0077ff) },
            bottomColor: { type: 'c', value: new THREE.Color(0xffffff) },
            offset:      { type: 'f', value: 66 },
            exponent:    { type: 'f', value: 0.6 }
        };
        uniforms.topColor.value.copy(hemiLight.color);

        scene.fog.color.copy(uniforms.bottomColor.value);

        var skyGeo = new THREE.SphereGeometry(3000, 32, 15);
        var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });

        var sky = new THREE.Mesh(skyGeo, skyMat);
        scene.add(sky);


        geometry = new THREE.CubeGeometry(150, 150, 150);
        material = new THREE.MeshPhongMaterial({
            color:     0x9da4aa,
            wireframe: false
        });

        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 150, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // show wireframe
        var wfh = new THREE.WireframeHelper( mesh, 0x000000 );
        wfh.material.linewidth = 2;
        scene.add( wfh );

        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        renderer.setClearColor( scene.fog.color, 1 );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

        renderer.shadowCameraNear = 3;
        renderer.shadowCameraFar = camera.far;
        renderer.shadowCameraFov = 50;

        renderer.shadowMapBias = 0.0039;
        renderer.shadowMapDarkness = 0.5;
        renderer.shadowMapWidth = 1024;
        renderer.shadowMapHeight = 1024;
    }

    function animate() {

        // note: three.js includes requestAnimationFrame shim
        requestAnimationFrame(animate);

        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.02;
        controls.update();

        renderer.render(scene, camera);

    }

});
