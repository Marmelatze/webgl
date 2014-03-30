define([
    'vendor/greensock/TweenMax.min'

], function () {

    function World() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0xffffff, 1000, 10000);
        //this.scene.fog.color.setHSL(0.6, 0, 1);

        this.addLights();
        this.addGround();
        this.addSky();
        this.addObjects();
    }

    World.prototype.getScene = function () {
        return this.scene;
    };

    World.prototype.addLights = function () {
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        this.hemiLight.color.setHSL(0.6, 1, 0.6);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 500, 0);
        this.scene.add(this.hemiLight);

        // directional light

        var dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.color.setHSL(0.1, 1, 0.95);
        dirLight.position.set(-300, 800, -400);

        dirLight.castShadow = true;
        dirLight.shadowMapWidth = 2048;
        dirLight.shadowMapHeight = 2048;

        var d = 2000;

        dirLight.shadowCameraLeft = -d;
        dirLight.shadowCameraRight = d;
        dirLight.shadowCameraTop = d;
        dirLight.shadowCameraBottom = -d;

        dirLight.shadowDarkness = 0.3;
        dirLight.shadowBias = 0.0001;
        dirLight.shadowCameraFar = 1500;
        dirLight.shadowCameraVisible = true;
        this.scene.add(dirLight);

        TweenMax.to(dirLight.position, 6, {x: 300, yoyo: true, repeat: -1, ease: Quad.easeInOut});
    };

    World.prototype.addGround = function () {
        var groundGeo = new THREE.PlaneGeometry(10000, 10000);
        var groundMat = new THREE.MeshPhongMaterial({ ambient: 0xffffff, color: 0xffffff, specular: 0x050505 });
        groundMat.color.setHSL(0.095, 1, 0.75);

        var ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -100;
        ground.receiveShadow = true;

        this.scene.add(ground);
    };

    World.prototype.addSky = function () {
        var vertexShader = document.getElementById('vertexShader').textContent;
        var fragmentShader = document.getElementById('fragmentShader').textContent;
        var uniforms = {
            topColor:    { type: 'c', value: new THREE.Color(0x0077ff) },
            bottomColor: { type: 'c', value: new THREE.Color(0xffffff) },
            offset:      { type: 'f', value: 700 },
            exponent:    { type: 'f', value: 0.6 }
        };
        uniforms.topColor.value.copy(this.hemiLight.color);

        //this.scene.fog.color.copy(uniforms.bottomColor.value);

        var skyGeo = new THREE.SphereGeometry(5000, 32, 15);
        var skyMat = new THREE.ShaderMaterial({ vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide });

        var sky = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(sky);
    };

    World.prototype.addObjects = function () {
        var cityGeometry = new THREE.Geometry();

        var x = -600;
        var z = 0;
        for (var i = 0; i < 10; i++) {
            var cube = new THREE.CubeGeometry(150, 200, 150);
            var cubeMesh = new THREE.Mesh(cube);
            cubeMesh.position.set(x, 0, z);
            x += 300;
            if (i === 4) {
                x = -600;
                z += 200;
            }

            THREE.GeometryUtils.merge(cityGeometry, cubeMesh);
        }


        var material = new THREE.MeshPhongMaterial({
            color: 0x9da4aa
        });

        var cityMesh = new THREE.Mesh(cityGeometry, material );
        cityMesh.castShadow = true;
        cityMesh.receiveShadow = true;
        this.scene.add(cityMesh);
    };

    return World;
});