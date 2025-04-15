document.addEventListener('DOMContentLoaded', function() {
    // Only initialize Three.js if the model container exists
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        initThreeJS();
    }

    // Initialize panorama viewer
    const panoramaContainer = document.getElementById('panorama-container');
    if (panoramaContainer) {
        initPanorama();
    }
});

function initThreeJS() {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('model-container').appendChild(renderer.domElement);
    
    // Create a veterinary themed 3D object (simplified for example)
    const geometry = new THREE.SphereGeometry(2, 32, 32);
    const textureLoader = new THREE.TextureLoader();
    
    // Simplified: Use a placeholder texture. In reality, use an animal texture.
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x4CAF50,
        roughness: 0.5,
        metalness: 0.2
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.01;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Make the model responsive
    window.addEventListener('resize', onWindowResize);
    
    function onWindowResize() {
        const container = document.getElementById('model-container');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }
    
    onWindowResize();
}

function initPanorama() {
    // For a real implementation, you'd include a panorama image of your facility
    pannellum.viewer('panorama-container', {
        type: "equirectangular",
        panorama: "https://pannellum.org/images/alma.jpg", // Placeholder - replace with your own panorama image
        autoLoad: true,
        compass: true,
        hotSpots: [
            {
                pitch: -3,
                yaw: 117,
                type: "info",
                text: "Laboratorio de Diagnóstico"
            },
            {
                pitch: -9,
                yaw: 222,
                type: "info",
                text: "Quirófano Didáctico"
            },
            {
                pitch: -10,
                yaw: 20,
                type: "info",
                text: "Sala de Anatomía"
            }
        ]
    });
}