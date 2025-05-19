document.addEventListener('DOMContentLoaded', function() {
    // Only initialize Three.js if the model container exists
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        initVeterinaryModels();
    }

    // Initialize panorama viewer
    const panoramaContainer = document.getElementById('panorama-container');
    if (panoramaContainer) {
        initEnhancedPanorama();
    }
});

// Create more sophisticated 3D models for veterinary theme
function initVeterinaryModels() {
    // Scene setup with better rendering quality
    const scene = new THREE.Scene();
    scene.background = null; // Transparent background
    
    // Camera with better perspective
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 2000);
    camera.position.z = 5;
    camera.position.y = 0.5;
    
    // Renderer with enhanced settings
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true,
        precision: 'highp',
        powerPreference: 'high-performance'
    });
    renderer.setSize(500, 500);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    const container = document.getElementById('model-container');
    container.innerHTML = ''; // Clear any existing content
    container.appendChild(renderer.domElement);
    
    // Add loading indicator
    const loadingElement = document.createElement('div');
    loadingElement.className = 'model-loading';
    loadingElement.innerHTML = '<div class="spinner"></div><p>Cargando modelo 3D...</p>';
    container.appendChild(loadingElement);

    // Scene group to manage all objects
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    
    // Add better lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    
    // Better shadow map settings
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.bias = -0.001;
    scene.add(directionalLight);
    
    // Add fill light from the other side
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);
    
    // Add ground reflection
    const groundLight = new THREE.PointLight(0xffffff, 0.2);
    groundLight.position.set(0, -5, 0);
    scene.add(groundLight);

    let modelLoaded = false;
    let mixer;
    
    // Load a more complex model using GLTFLoader
    try {
        // Try to create a more complex animal model if GLTFLoader is available
        if (typeof THREE.GLTFLoader !== 'undefined') {
            const loader = new THREE.GLTFLoader();
            
            // Load a veterinary-themed model (dog or cat)
            // Note: You would need to have a model file available
            loader.load(
                'models/animal.glb', // Replace with your model path
                function(gltf) {
                    modelLoaded = true;
                    loadingElement.style.display = 'none';
                    
                    // Process the model
                    const model = gltf.scene;
                    model.scale.set(1.5, 1.5, 1.5);
                    model.position.y = -1;
                    model.traverse(function(node) {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                        }
                    });
                    
                    modelGroup.add(model);
                    
                    // Handle animations if available
                    if (gltf.animations && gltf.animations.length) {
                        mixer = new THREE.AnimationMixer(model);
                        const action = mixer.clipAction(gltf.animations[0]);
                        action.play();
                    }
                },
                function(xhr) {
                    // Loading progress
                    const percent = (xhr.loaded / xhr.total) * 100;
                    if (loadingElement.querySelector('p')) {
                        loadingElement.querySelector('p').textContent = `Cargando: ${Math.round(percent)}%`;
                    }
                },
                function(error) {
                    console.error('Error loading GLTF model:', error);
                    createFallbackModel();
                }
            );
        } else {
            createFallbackModel();
        }
    } catch (error) {
        console.error('Error initializing GLTF loader:', error);
        createFallbackModel();
    }

    function createFallbackModel() {
        // Create a more appealing fallback with multiple geometries 
        // to simulate a simple animal shape
        modelLoaded = true;
        loadingElement.style.display = 'none';
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(1.2, 32, 32);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,  // Brown color for an animal
            shininess: 30,
            specular: 0x333333
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        body.receiveShadow = true;
        modelGroup.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            shininess: 30,
            specular: 0x333333
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(1.2, 0.4, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        modelGroup.add(head);
        
        // Ears
        const earGeometry = new THREE.ConeGeometry(0.3, 0.5, 32);
        const earMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            shininess: 30,
            specular: 0x333333
        });
        
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(1.3, 1.1, 0.4);
        leftEar.rotation.z = Math.PI / 6;
        leftEar.castShadow = true;
        modelGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(1.3, 1.1, -0.4);
        rightEar.rotation.z = Math.PI / 6;
        rightEar.castShadow = true;
        modelGroup.add(rightEar);
        
        // Legs
        const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 32);
        const legMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            shininess: 30,
            specular: 0x333333
        });
        
        for (let i = 0; i < 4; i++) {
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const xPos = i < 2 ? 0.7 : -0.7;
            const zPos = i % 2 === 0 ? 0.7 : -0.7;
            leg.position.set(xPos, -1.2, zPos);
            leg.castShadow = true;
            modelGroup.add(leg);
        }
        
        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 32);
        const tailMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            shininess: 30,
            specular: 0x333333
        });
        
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-1.5, 0, 0);
        tail.rotation.z = Math.PI / 2;
        tail.castShadow = true;
        modelGroup.add(tail);
        
        // Eyes
        const eyeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        const eyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 100,
            specular: 0xffffff
        });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(1.8, 0.6, 0.3);
        modelGroup.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(1.8, 0.6, -0.3);
        modelGroup.add(rightEye);
        
        // Nose
        const noseGeometry = new THREE.SphereGeometry(0.15, 32, 32);
        const noseMaterial = new THREE.MeshPhongMaterial({
            color: 0x000000,
            shininess: 100,
            specular: 0x666666
        });
        
        const nose = new THREE.Mesh(noseGeometry, noseMaterial);
        nose.position.set(2.0, 0.3, 0);
        modelGroup.add(nose);
        
        // Position the entire model
        modelGroup.rotation.y = -Math.PI / 4;
    }
    
    // Add orbit controls for user interaction
    let controls;
    try {
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.rotateSpeed = 0.5;
            controls.minDistance = 3;
            controls.maxDistance = 10;
            controls.enablePan = false;
            controls.autoRotate = true;
            controls.autoRotateSpeed = 1.0;
        }
    } catch (error) {
        console.warn('OrbitControls not available:', error);
    }
    
    // Clock for animation timing
    const clock = new THREE.Clock();
    
    // Enhanced animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        const delta = clock.getDelta();
        
        // Update mixer for GLTF animations
        if (mixer) {
            mixer.update(delta);
        }
        
        // Update controls if available
        if (controls) {
            controls.update();
        } else {
            // Simple rotation if no controls
            if (modelGroup) {
                modelGroup.rotation.y += 0.005;
            }
        }
        
        // Add gentle floating animation to the model
        if (modelGroup && modelLoaded) {
            modelGroup.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.1;
        }
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize for responsive model
    function onWindowResize() {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight || containerWidth * 0.8;
        
        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerWidth, containerHeight);
    }
    
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
    
    // Add touch/mouse interaction
    container.addEventListener('touchstart', function() {
        if (controls) {
            controls.autoRotate = false;
        }
    });
    
    container.addEventListener('mousedown', function() {
        if (controls) {
            controls.autoRotate = false;
        }
    });
    
    // Re-enable auto-rotation after a period of inactivity
    let inactivityTimeout;
    function resetAutoRotation() {
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(function() {
            if (controls) {
                controls.autoRotate = true;
            }
        }, 5000); // Re-enable auto-rotation after 5 seconds of inactivity
    }
    
    container.addEventListener('mousemove', resetAutoRotation);
    container.addEventListener('touchmove', resetAutoRotation);
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            animate(); // Restart animation if tab becomes visible again
        }
    });
    
    return {
        scene,
        camera,
        renderer,
        modelGroup
    };
}

// Enhanced panorama viewer
function initEnhancedPanorama() {
    const panoramaContainer = document.getElementById('panorama-container');
    
    // Add loading indicator
    panoramaContainer.innerHTML = '<div class="panorama-loading">Cargando panorama...</div>';
    
    try {
        pannellum.viewer('panorama-container', {
            type: "equirectangular",
            panorama: "https://pannellum.org/images/alma.jpg", // Placeholder - replace with your own panorama image
            autoLoad: true,
            compass: true,
            showFullscreenCtrl: true,
            showZoomCtrl: true,
            mouseZoom: true,
            friction: 0.2, // Smoother movement
            minHfov: 50, // Limit zoom
            maxHfov: 120,
            autoRotate: 1, // Slow auto-rotation
            autoRotateInactivityDelay: 3000, // Start rotating after 3 seconds of inactivity
            compass: true,
            northOffset: 247.5,
            preview: 'img/panorama-preview.jpg', // Add a preview image if available
            hotSpots: [
                {
                    pitch: -3,
                    yaw: 117,
                    type: "info",
                    text: "Laboratorio de Diagnóstico",
                    cssClass: "custom-hotspot",
                    createTooltipFunc: hotspotTooltip,
                    createTooltipArgs: "Aquí los estudiantes aprenden a realizar y analizar pruebas diagnósticas básicas."
                },
                {
                    pitch: -9,
                    yaw: 222,
                    type: "info",
                    text: "Quirófano Didáctico",
                    cssClass: "custom-hotspot",
                    createTooltipFunc: hotspotTooltip,
                    createTooltipArgs: "Espacio equipado para las prácticas de asistencia en cirugía veterinaria."
                },
                {
                    pitch: -10,
                    yaw: 20,
                    type: "info",
                    text: "Sala de Anatomía",
                    cssClass: "custom-hotspot",
                    createTooltipFunc: hotspotTooltip,
                    createTooltipArgs: "Aula especializada para el estudio de la anatomía animal con modelos didácticos."
                },
                {
                    pitch: 5,
                    yaw: 300,
                    type: "info",
                    text: "Biblioteca Especializada",
                    cssClass: "custom-hotspot", 
                    createTooltipFunc: hotspotTooltip,
                    createTooltipArgs: "Acceso a recursos bibliográficos especializados en medicina y cuidado animal."
                }
            ],
            sceneFadeDuration: 1000,
            
            // Handle events
            onLoad: function() {
                // Remove loading indicator on successful load
                const loadingElement = document.querySelector('.panorama-loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            },
            onError: function(err) {
                console.error('Error loading panorama:', err);
                panoramaContainer.innerHTML = '<div class="panorama-error">Error al cargar el panorama. Por favor, intente nuevamente más tarde.</div>';
            }
        });
    } catch (error) {
        console.error('Error initializing panorama:', error);
        panoramaContainer.innerHTML = '<div class="panorama-error">Error al inicializar el panorama. Por favor, intente nuevamente más tarde.</div>';
    }

    // Custom hotspot function for more interactive tooltips
    function hotspotTooltip(hotSpotDiv, args) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.classList.add('hotspot-tooltip');
        
        // Create close button
        const closeBtn = document.createElement('div');
        closeBtn.classList.add('hotspot-close');
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.remove('visible');
        });
        
        // Create content
        const content = document.createElement('div');
        content.classList.add('hotspot-content');
        content.innerHTML = args;
        
        // Assemble tooltip
        wrapper.appendChild(closeBtn);
        wrapper.appendChild(content);
        
        // Add tooltip to hotspot
        hotSpotDiv.appendChild(wrapper);
        
        // Toggle tooltip visibility on hotspot click
        hotSpotDiv.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Hide all other tooltips first
            document.querySelectorAll('.hotspot-tooltip.visible').forEach(function(el) {
                if (el !== wrapper) {
                    el.classList.remove('visible');
                }
            });
            
            // Toggle this tooltip
            wrapper.classList.toggle('visible');
        });
        
        return wrapper;
    }
}