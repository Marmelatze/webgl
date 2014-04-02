define([
    'vendor/greensock/TweenMax.min',
    'vendor/TrackballControls'
], function () {

    function Viewport(config) {
        this.world = config.world;
        this.container = config.container;

        this.initContainer();
        this.addCamera();

        this.initRenderer();
        this.initControls();

        this.render();

        // start animation loop
        TweenMax.ticker.addEventListener('tick', this.animate.bind(this));
    }

    Viewport.prototype.initContainer = function () {
        this.el = document.createElement('div');
        this.el.style.position = 'absolute';
        this.el.style.backgroundColor = '#aaa';

        this.el.style.userSelect = 'none';
        this.el.style.WebkitUserSelect = 'none';
        this.el.style.MozUserSelect = 'none';

        this.container.appendChild(this.el);
    };

    Viewport.prototype.initRenderer = function () {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor( 0xffffff, 1 );
        this.renderer.autoClear = false;
        this.renderer.autoUpdateScene = false;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;

        this.renderer.shadowMapEnabled = true;
        //this.renderer.shadowMapCullFrontFaces = true;
        //this.renderer.shadowMapSoft = true;

        this.renderer.shadowCameraNear = 3;
        this.renderer.shadowCameraFar = this.camera.far;
        this.renderer.shadowCameraFov = 100;

        this.renderer.shadowMapType = THREE.PCFSoftShadowMap; // options are THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
        // /this.renderer.shadowMapBias = 0.0001;
        this.renderer.shadowMapDarkness = 0.2;
        this.renderer.shadowMapWidth = 1024;
        this.renderer.shadowMapHeight = 1024;

        this.el.appendChild(this.renderer.domElement);
    };

    Viewport.prototype.initControls = function () {
        this.controls = new THREE.TrackballControls(this.camera);

        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.15;
    };

    Viewport.prototype.addCamera = function () {
        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20000);
        this.camera.position.set(0, 0, 1800);
    };

    Viewport.prototype.animate = function () {
        this.controls.update();
        this.render();
    };

    Viewport.prototype.render = function () {
        this.renderer.clear();
        this.renderer.render(this.world.getScene(), this.camera);

    };

    return Viewport;
});
