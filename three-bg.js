document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Set up the scene, camera, and renderer
    const scene = new THREE.Scene();
    
    // Camera settings
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer settings
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Group for all floating objects
    const group = new THREE.Group();
    scene.add(group);

    // Create elegant wireframe shapes
    const geometries = [
        new THREE.IcosahedronGeometry(6, 0),
        new THREE.OctahedronGeometry(5, 0),
        new THREE.TetrahedronGeometry(6, 0),
        new THREE.TorusGeometry(5, 1.5, 16, 32)
    ];

    // Subtle, low-opacity colors matching the theme
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.12 }),
        new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true, transparent: true, opacity: 0.12 }),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.12 })
    ];

    const shapes = [];

    // Add 12 shapes scattered gently around the background
    for (let i = 0; i < 12; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);

        // Position randomly in a wide area
        mesh.position.x = (Math.random() - 0.5) * 80;
        mesh.position.y = (Math.random() - 0.5) * 80;
        mesh.position.z = (Math.random() - 0.5) * 40 - 10;

        // Random initial rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;

        // Custom properties for very slow, calming animation
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.003,
                y: (Math.random() - 0.5) * 0.003,
                z: (Math.random() - 0.5) * 0.003
            },
            floatSpeed: (Math.random() * 0.5) + 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            initialY: mesh.position.y
        };

        group.add(mesh);
        shapes.push(mesh);
    }

    // Add some very faint background "space dust" (tiny particles)
    const dustGeometry = new THREE.BufferGeometry();
    const dustCount = 400;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i++) {
        dustPositions[i] = (Math.random() - 0.5) * 120;
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.2
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // Removed mouse parallax tracking to keep the background serene and non-disturbing

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Very slow overall scene rotation
        group.rotation.y = elapsedTime * 0.02;
        group.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

        // Animate individual shapes gently
        shapes.forEach(shape => {
            // Smooth rotation
            shape.rotation.x += shape.userData.rotationSpeed.x;
            shape.rotation.y += shape.userData.rotationSpeed.y;
            shape.rotation.z += shape.userData.rotationSpeed.z;

            // Gentle floating up and down
            shape.position.y = shape.userData.initialY + Math.sin(elapsedTime * shape.userData.floatSpeed + shape.userData.floatOffset) * 1.5;
        });
        
        // Slowly rotate the background dust
        dust.rotation.y = elapsedTime * 0.01;

        renderer.render(scene, camera);
    }

    // Start animation
    animate();
});
