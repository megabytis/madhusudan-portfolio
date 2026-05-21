document.addEventListener("DOMContentLoaded", () => {
    // We attach Three.js to the widget container instead of the whole body
    const container = document.getElementById('three-widget');
    if (!container) return;

    // Set up the scene
    const scene = new THREE.Scene();
    
    // Camera settings
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 25;

    // Renderer settings
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Append canvas to the widget container
    container.appendChild(renderer.domElement);

    // Group for the globe
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. The Wireframe Globe
    const sphereGeometry = new THREE.SphereGeometry(8, 24, 24);
    const sphereMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x333333, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.3 
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(sphere);

    // 2. The Inner Core (Solid glowing sphere)
    const coreGeometry = new THREE.SphereGeometry(3, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x3b82f6, // Accent blue
        transparent: true,
        opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    globeGroup.add(core);

    // 3. Orbiting Nodes (Satellites)
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const numSatellites = 15;
    const satellites = [];

    for (let i = 0; i < numSatellites; i++) {
        const satGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const satMesh = new THREE.Mesh(satGeometry, satelliteMaterial);
        
        // Random orbit distance and angle
        const distance = 9 + Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        satMesh.position.x = distance * Math.sin(phi) * Math.cos(theta);
        satMesh.position.y = distance * Math.sin(phi) * Math.sin(theta);
        satMesh.position.z = distance * Math.cos(phi);
        
        // Save initial parameters for orbit animation
        satMesh.userData = {
            theta: theta,
            phi: phi,
            distance: distance,
            speed: (Math.random() * 0.02) + 0.005
        };

        globeGroup.add(satMesh);
        satellites.push(satMesh);
    }

    // 4. Connecting lines from core to satellites
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3b82f6, 
        transparent: true, 
        opacity: 0.2 
    });
    
    // We will update the geometry in the render loop
    const lineGeometry = new THREE.BufferGeometry();
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    globeGroup.add(lines);

    // Interaction (Mouse hover causes globe to tilt slightly)
    let targetRotationX = 0;
    let targetRotationY = 0;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Normalize mouse coordinates to -1 to 1
        const normX = (x / rect.width) * 2 - 1;
        const normY = -(y / rect.height) * 2 + 1;

        targetRotationY = normX * 0.5;
        targetRotationX = normY * -0.5;
    });

    container.addEventListener('mouseleave', () => {
        targetRotationX = 0;
        targetRotationY = 0;
    });

    // Resize handler specifically for the container
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Animation loop
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate to target rotation for interactive tilt
        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;
        globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
        
        // Base continuous rotation
        sphere.rotation.y = elapsedTime * 0.1;
        sphere.rotation.x = elapsedTime * 0.05;

        // Animate satellites and update lines
        const linePositions = [];
        
        satellites.forEach(sat => {
            // Update orbit angle
            sat.userData.theta += sat.userData.speed;
            
            // Calculate new position
            sat.position.x = sat.userData.distance * Math.sin(sat.userData.phi) * Math.cos(sat.userData.theta);
            sat.position.y = sat.userData.distance * Math.sin(sat.userData.phi) * Math.sin(sat.userData.theta);
            sat.position.z = sat.userData.distance * Math.cos(sat.userData.phi);

            // Add line segment (from center to satellite)
            linePositions.push(0, 0, 0);
            linePositions.push(sat.position.x, sat.position.y, sat.position.z);
        });

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        // Core pulsing
        const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
        core.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    }

    // Start animation
    animate();
});
