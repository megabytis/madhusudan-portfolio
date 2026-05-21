document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // --- THREE.JS SETUP ---
    const scene = new THREE.Scene();
    
    // Add Fog for deep space feel
    scene.fog = new THREE.FogExp2(0x020205, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Camera starts back from the origin
    const startZ = 30;
    const endZ = -120; // How far we fly into space
    camera.position.z = startZ;
    camera.position.y = 5;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- CELESTIAL BODIES ---
    const celestialBodies = [];

    // Helper: Create a glowing wireframe sphere
    function createPlanet(radius, color, x, y, z, rotationSpeed) {
        const geometry = new THREE.IcosahedronGeometry(radius, 2);
        
        // Inner solid to block stars behind it
        const solidMat = new THREE.MeshBasicMaterial({ color: 0x020205 });
        const solid = new THREE.Mesh(geometry, solidMat);
        
        // Outer glowing wireframe
        const wireMat = new THREE.MeshBasicMaterial({ 
            color: color, 
            wireframe: true, 
            transparent: true,
            opacity: 0.8
        });
        const wire = new THREE.Mesh(geometry, wireMat);
        
        const group = new THREE.Group();
        group.add(solid);
        group.add(wire);
        
        group.position.set(x, y, z);
        scene.add(group);
        
        celestialBodies.push({ mesh: group, speed: rotationSpeed });
        return group;
    }

    // 0. The Central Sun (Madhusudan)
    createPlanet(8, 0xffffff, 0, 0, 0, 0.002);

    // 1. Planet: RAG QnA
    createPlanet(4, 0x64ffda, 15, 0, -30, 0.005);

    // 2. Planet: ShopNexus
    createPlanet(5, 0xb392f0, -18, -5, -60, -0.004);

    // 3. Planet: LearnSphere
    createPlanet(3.5, 0x64ffda, 12, 8, -90, 0.006);
    
    // 4. Massive distant structure (Skills)
    createPlanet(15, 0x333344, 0, -15, -130, 0.001);

    // --- STARFIELD ---
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const posArray = new Float32Array(starsCount * 3);
    for(let i=0; i < starsCount * 3; i++) {
        // Spread stars widely
        posArray[i] = (Math.random() - 0.5) * 300;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.8
    });
    const starMesh = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starMesh);

    // --- SCROLL LOGIC ---
    let scrollPercent = 0;
    let targetZ = startZ;
    
    const sections = document.querySelectorAll('.ui-section');
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
        // Calculate scroll percentage (0.0 to 1.0)
        scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Update progress bar
        if (progressBar) progressBar.style.width = `${scrollPercent * 100}%`;

        // Update target Z for the camera to fly through space
        targetZ = startZ + scrollPercent * (endZ - startZ);

        // UI Section active state logic
        // We have 5 sections (0 to 4).
        const sectionIndex = Math.floor(scrollPercent * 4.99); // 4.99 to ensure we hit index 4 at the very bottom
        
        sections.forEach((sec, i) => {
            if (i === sectionIndex) {
                sec.classList.add('active');
            } else {
                sec.classList.remove('active');
            }
        });
    });

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // --- ANIMATION LOOP ---
    function animate() {
        requestAnimationFrame(animate);

        // Rotate planets
        celestialBodies.forEach(body => {
            body.mesh.rotation.y += body.speed;
            body.mesh.rotation.x += body.speed * 0.5;
        });

        // Rotate starfield slowly
        starMesh.rotation.y += 0.0005;

        // Smooth camera movement (Lerp)
        camera.position.z += (targetZ - camera.position.z) * 0.05;
        
        // Slight subtle mouse look effect (optional, keep it simple for now)
        
        renderer.render(scene, camera);
    }

    animate();
    
    // Trigger scroll event on load to initialize UI visibility
    window.dispatchEvent(new Event('scroll'));
});
