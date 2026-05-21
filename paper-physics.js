document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('paper-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // --- CHALKBOARD THEME ---
    const themeBtn = document.getElementById('theme-toggle');
    let isChalkboard = false;
    
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('chalkboard');
            isChalkboard = document.body.classList.contains('chalkboard');
            themeBtn.innerText = isChalkboard ? '☀️ Paper Mode' : '💡 Chalkboard';
        });
    }

    // Dynamic stroke color based on theme
    function getStrokeColor() {
        return isChalkboard ? '#f4f4f4' : '#2c2c2c';
    }
    function getFillColor() {
        return isChalkboard ? '#2b2b2b' : '#f4f1ea';
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = 500;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    let lastScrollY = scrollY;
    let scrollSpeed = 0;
    let distanceTraveled = 0;
    
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    });

    // --- CYCLIST & JUMP ---
    const cyclist = {
        baseX: 250, 
        baseY: 320,
        y: 320,
        wheelRadius: 45,
        pedalAngle: 0,
        xOffset: 0,
        vx: 0 // For stumbling backward
    };

    let isJumping = false;
    let jumpVy = 0;
    const jumpGravity = 0.8;

    window.addEventListener('mousedown', (e) => {
        // Prevent jump if clicking on a UI element (like the theme button)
        if (e.target.closest('.navbar')) return;

        // Check airplane clicks first
        let clickedAirplane = false;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        airplanes.forEach(plane => {
            if (Math.abs(plane.x - mx) < 40 && Math.abs(plane.y - my) < 40) {
                plane.isLooping = true;
                plane.loopAngle = 0;
                clickedAirplane = true;
            }
        });

        // If didn't click airplane, pop a wheelie/jump!
        if (!clickedAirplane && !isJumping && cyclist.y >= cyclist.baseY) {
            isJumping = true;
            jumpVy = -16;
        }
    });

    // --- OBSTACLES (Mini-Game) ---
    const obstacles = [];
    let nextObstacleDistance = 1000; // First obstacle spawns after 1000px

    function spawnObstacle() {
        obstacles.push({
            x: canvas.width + 100,
            y: 400,
            width: 30,
            height: 20,
            active: true
        });
    }

    function drawObstacle(obs) {
        // Draw a sketchy eraser
        ctx.beginPath();
        ctx.rect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = getStrokeColor();
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(obs.x + 10, obs.y);
        ctx.lineTo(obs.x + 10, obs.y + obs.height);
        ctx.stroke();
    }

    // --- TECH STACK (Physics Boxes) ---
    const techStack = [
        { name: "Node.js", color: "#8CC84B", x: 0, y: 400, vx: 0, vy: 0 },
        { name: "Python", color: "#3776AB", x: -120, y: 400, vx: 0, vy: 0 },
        { name: "GenAI", color: "#FF9900", x: -240, y: 400, vx: 0, vy: 0 }
    ];

    const spring = 0.05;
    const friction = 0.8;
    const gravity = 0.6;
    const groundY = 420;
    const ropeLength = 110;

    // --- PARTICLES & AIRPLANES ---
    let particles = [];
    let airplanes = [
        { x: 800, baseY: 150, y: 150, vx: -2.5, time: Math.random() * 100, isLooping: false, loopAngle: 0, loopBaseY: 0, rotation: 0 }
    ];

    function drawSketchyLine(ctx, x1, y1, x2, y2, color, width = 4) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 6;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 6;
        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    function drawSaggingRope(ctx, x1, y1, x2, y2, color) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        
        // Sag amount increases if nodes are closer together (not taut)
        const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const sag = Math.max(0, ropeLength - dist) * 1.5; 
        
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 + sag + (Math.random()-0.5)*3; // Add jitter to sag

        ctx.quadraticCurveTo(midX, midY, x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawAirplane(plane) {
        ctx.save();
        ctx.translate(plane.x, plane.y);
        
        if (plane.isLooping) {
            ctx.rotate(plane.loopAngle);
        } else {
            ctx.rotate(plane.rotation);
        }
        
        ctx.beginPath();
        ctx.moveTo(-15, 0); // Nose points LEFT
        ctx.lineTo(15, 10); // Bottom wing
        ctx.lineTo(5, 0); // Back
        ctx.lineTo(15, -10); // Top wing
        ctx.closePath();
        
        ctx.strokeStyle = getStrokeColor();
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Fold line
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(5, 0);
        ctx.stroke();
        
        ctx.restore();
    }

    function drawCloud(x, y, scale) {
        ctx.beginPath();
        ctx.arc(x, y, 20 * scale, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(x + 15 * scale, y - 15 * scale, 25 * scale, Math.PI * 1, Math.PI * 2);
        ctx.arc(x + 40 * scale, y - 10 * scale, 20 * scale, Math.PI * 1, Math.PI * 2);
        ctx.arc(x + 50 * scale, y, 15 * scale, Math.PI * 1.5, Math.PI * 0.5);
        ctx.moveTo(x + 50 * scale, y + 15 * scale);
        ctx.lineTo(x, y + 20 * scale);
        ctx.strokeStyle = isChalkboard ? 'rgba(255, 255, 255, 0.3)' : 'rgba(44, 44, 44, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawMountain(x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width / 2, y - height);
        ctx.lineTo(x + width, y);
        ctx.moveTo(x + width / 2, y - height);
        ctx.lineTo(x + width / 2 + 10, y);
        ctx.strokeStyle = isChalkboard ? 'rgba(255, 255, 255, 0.2)' : 'rgba(44, 44, 44, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawCyclist(x, y, pedalAngle) {
        const stroke = getStrokeColor();
        const fill = getFillColor();

        // Frame
        drawSketchyLine(ctx, x - 54, y, x + 36, y, stroke); 
        drawSketchyLine(ctx, x - 54, y, x - 72, y + 72, stroke); 
        drawSketchyLine(ctx, x + 36, y, x - 18, y + 72, stroke); 
        drawSketchyLine(ctx, x - 72, y + 72, x - 108, y + 72, stroke); 
        drawSketchyLine(ctx, x - 108, y + 72, x - 54, y, stroke); 
        drawSketchyLine(ctx, x + 36, y, x + 54, y + 72, stroke); 

        // Handlebars & Seat
        drawSketchyLine(ctx, x + 36, y, x + 45, y - 27, stroke);
        drawSketchyLine(ctx, x - 54, y, x - 54, y - 27, stroke);
        
        // Wheels
        ctx.beginPath();
        ctx.arc(x - 108, y + 72, cyclist.wheelRadius, 0, Math.PI * 2);
        ctx.fillStyle = fill; 
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = stroke;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(x + 54, y + 72, cyclist.wheelRadius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.stroke();
        
        // Spokes
        drawSketchyLine(ctx, x - 108, y + 72, x - 108 + Math.cos(pedalAngle) * cyclist.wheelRadius, y + 72 + Math.sin(pedalAngle) * cyclist.wheelRadius, stroke, 2);
        drawSketchyLine(ctx, x + 54, y + 72, x + 54 + Math.cos(pedalAngle) * cyclist.wheelRadius, y + 72 + Math.sin(pedalAngle) * cyclist.wheelRadius, stroke, 2);

        // Person
        drawSketchyLine(ctx, x - 54, y - 27, x - 18, y - 63, stroke); 
        ctx.beginPath();
        ctx.arc(x - 9, y - 81, 18, 0, Math.PI * 2); 
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.stroke();
        drawSketchyLine(ctx, x - 18, y - 63, x + 45, y - 27, stroke); 
        
        // Legs
        const pedalX = x - 18 + Math.cos(pedalAngle) * 18;
        const pedalY = y + 72 + Math.sin(pedalAngle) * 18;
        drawSketchyLine(ctx, x - 54, y - 27, pedalX, pedalY, stroke); 
    }

    function drawBox(box) {
        const bw = 110;
        const bh = 46;
        const fill = getFillColor();
        const stroke = getStrokeColor();
        
        ctx.fillStyle = fill;
        ctx.fillRect(box.x - bw/2, box.y - bh/2, bw, bh);
        
        ctx.fillStyle = box.color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(box.x - bw/2, box.y - bh/2, bw, bh);
        ctx.globalAlpha = 1.0;
        
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x - bw/2, box.y - bh/2, bw, bh);
        
        ctx.fillStyle = stroke;
        ctx.font = 'bold 22px "Patrick Hand", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(box.name, box.x, box.y);
    }

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const stroke = getStrokeColor();
        
        // Scroll Math
        scrollY += (targetScrollY - scrollY) * 0.1;
        scrollSpeed = Math.abs(scrollY - lastScrollY);
        
        if (targetScrollY > lastScrollY) {
            distanceTraveled += scrollSpeed;
        }
        
        lastScrollY = scrollY;
        
        const scrollProgress = scrollY / (document.body.scrollHeight - window.innerHeight);
        
        // Cyclist stumble recovery
        cyclist.vx *= 0.9; 
        
        cyclist.xOffset = scrollProgress * (canvas.width - 400);
        const currentCyclistX = cyclist.baseX + cyclist.xOffset + cyclist.vx;
        cyclist.pedalAngle = scrollY * 0.02;

        // --- BACKGROUND ---
        const cloudOffset = -(scrollY * 0.1) % 600;
        for(let i=0; i<5; i++) {
            drawCloud(cloudOffset + i * 400, 250 + (i%2)*40, 1.2);
        }
        
        const mountainOffset = -(scrollY * 0.3) % 800;
        for(let i=0; i<4; i++) {
            drawMountain(mountainOffset + i * 500, groundY + 20, 300, 150);
        }

        // --- AIRPLANES ---
        airplanes.forEach(plane => {
            if (plane.isLooping) {
                if (plane.loopAngle === 0) plane.loopBaseY = plane.y;
                
                plane.loopAngle += 0.15; // Loop upwards (clockwise)
                plane.x -= Math.sin(plane.loopAngle) * 5; // Move left as it loops
                plane.y = plane.loopBaseY - Math.cos(plane.loopAngle) * 30 + 30;
                
                if (plane.loopAngle >= Math.PI * 2) {
                    plane.isLooping = false;
                    plane.loopAngle = 0;
                    plane.y = plane.loopBaseY;
                }
            } else {
                // Realistic Swooping Glider Physics
                plane.time += 0.02;
                plane.x += plane.vx;
                
                // Swooping Y calculation (combination of slow dive and fast bob)
                const swoop = Math.sin(plane.time) * 30 + Math.sin(plane.time * 2.5) * 10;
                plane.y = plane.baseY + swoop;
                
                // Rotation (pitch) matches the derivative (slope) of the swoop
                const slope = Math.cos(plane.time) * 30 + Math.cos(plane.time * 2.5) * 25;
                // Since nose points left (-X), a positive Y slope means pitching UP (negative rotation in canvas)
                plane.rotation = -slope * 0.015;

                if (plane.x < -100) plane.x = canvas.width + 100; // Reset
            }
            drawAirplane(plane);
        });

        // --- OBSTACLES & COLLISION ---
        if (distanceTraveled > nextObstacleDistance) {
            spawnObstacle();
            nextObstacleDistance += 800 + Math.random() * 1000;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            const obs = obstacles[i];
            
            // Move obstacle relative to camera
            obs.x -= scrollSpeed * 0.8;
            
            drawObstacle(obs);

            // Collision check (front wheel is roughly x + 54, y + 72)
            const frontWheelX = currentCyclistX + 54;
            const frontWheelY = cyclist.y + 72 + cyclist.wheelRadius;
            
            if (obs.active && 
                frontWheelX > obs.x && 
                frontWheelX < obs.x + obs.width &&
                frontWheelY > obs.y) {
                
                // HIT! Stumble backward
                cyclist.vx = -100;
                obs.active = false; // Cannot hit again
                
                // Tech stacks bounce violently on hit
                techStack.forEach(box => { box.vy = -15 + Math.random() * -10; });
            }

            if (obs.x < -100) obstacles.splice(i, 1);
        }

        // --- JUMP LOGIC ---
        if (isJumping) {
            cyclist.y += jumpVy;
            jumpVy += jumpGravity;
            
            if (cyclist.y >= cyclist.baseY) {
                cyclist.y = cyclist.baseY;
                isJumping = false;
                jumpVy = 0;
            }
        }

        // --- DUST PARTICLES ---
        if (scrollSpeed > 2 && !isJumping) {
            if (Math.random() > 0.5) {
                particles.push({
                    x: currentCyclistX - 108, 
                    y: cyclist.y + 72 + cyclist.wheelRadius,
                    vx: -Math.random() * 5 - 2,
                    vy: -Math.random() * 3,
                    life: 1.0
                });
            }
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.life * 10, 0, Math.PI * 2);
            ctx.fillStyle = isChalkboard ? `rgba(200, 200, 200, ${p.life * 0.5})` : `rgba(150, 150, 150, ${p.life * 0.5})`;
            ctx.fill();
        }

        // Draw road
        ctx.beginPath();
        ctx.moveTo(0, groundY + 20);
        for(let i = 0; i < canvas.width; i+=50) {
            ctx.lineTo(i, groundY + 20 + Math.sin(i * 0.05 - scrollY*0.01) * 6);
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 3;
        ctx.stroke();

        // --- PHYSICS BOXES & SAGGING ROPES ---
        let leaderX = currentCyclistX - 108; 
        let leaderY = cyclist.y + 72;

        for (let i = 0; i < techStack.length; i++) {
            const box = techStack[i];
            const dx = leaderX - box.x;
            const dy = leaderY - box.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > ropeLength) {
                const force = (distance - ropeLength) * spring;
                box.vx += (dx / distance) * force;
                box.vy += (dy / distance) * force;
            }

            box.vy += gravity;
            box.vx *= friction;
            box.vy *= friction;
            box.x += box.vx;
            box.y += box.vy;
            if(isNaN(box.y)) box.y = groundY;

            if (box.y > groundY) {
                box.y = groundY;
                box.vy *= -0.5; 
                box.vx *= 0.8; 
            }
            
            // Draw Dynamic Sagging Rope
            drawSaggingRope(ctx, leaderX, leaderY, box.x, box.y - 23, stroke);
            
            drawBox(box);

            leaderX = box.x - 55;
            leaderY = box.y;
        }

        drawCyclist(currentCyclistX, cyclist.y, cyclist.pedalAngle);

        requestAnimationFrame(render);
    }

    document.fonts.ready.then(() => {
        render();
    });
});
