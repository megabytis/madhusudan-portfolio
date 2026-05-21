document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('neural-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Resize canvas
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Graph Data Structure
    const nodes = [
        { id: 'Me', label: 'Madhusudan', color: '#00f0ff', radius: 30, mass: 2 },
        { id: 'Node', label: 'Node.js', color: '#39ff14', radius: 20, mass: 1 },
        { id: 'Py', label: 'Python', color: '#b026ff', radius: 20, mass: 1 },
        { id: 'API', label: 'REST APIs', color: '#39ff14', radius: 15, mass: 0.8 },
        { id: 'Fast', label: 'FastAPI', color: '#b026ff', radius: 15, mass: 0.8 },
        { id: 'DB', label: 'MongoDB', color: '#39ff14', radius: 15, mass: 0.8 },
        { id: 'GenAI', label: 'GenAI', color: '#00f0ff', radius: 25, mass: 1.5 },
        { id: 'RAG', label: 'RAG Pipeline', color: '#b026ff', radius: 18, mass: 1 },
        { id: 'Chroma', label: 'ChromaDB', color: '#b026ff', radius: 15, mass: 0.8 },
        { id: 'LLM', label: 'Groq / OpenAI', color: '#00f0ff', radius: 15, mass: 0.8 }
    ];

    const links = [
        { source: 'Me', target: 'Node' },
        { source: 'Me', target: 'Py' },
        { source: 'Me', target: 'GenAI' },
        { source: 'Node', target: 'API' },
        { source: 'Node', target: 'DB' },
        { source: 'Py', target: 'Fast' },
        { source: 'GenAI', target: 'RAG' },
        { source: 'GenAI', target: 'LLM' },
        { source: 'RAG', target: 'Chroma' },
        { source: 'RAG', target: 'Py' }
    ];

    // Initialize node positions and velocities
    nodes.forEach(node => {
        node.x = canvas.width / 2 + (Math.random() - 0.5) * 400;
        node.y = canvas.height / 2 + (Math.random() - 0.5) * 400;
        node.vx = 0;
        node.vy = 0;
    });

    // Update Node Count in UI
    const countEl = document.getElementById('node-count');
    if (countEl) countEl.innerText = nodes.length;

    // Physics constants
    const repulsion = 1000;
    const springLength = 150;
    const springStrength = 0.02;
    const damping = 0.85; // Friction

    // Mouse Interaction
    let draggedNode = null;
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener('mousedown', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        // Find clicked node
        for (let node of nodes) {
            const dx = node.x - mx;
            const dy = node.y - my;
            if (dx * dx + dy * dy < node.radius * node.radius * 2) {
                draggedNode = node;
                break;
            }
        }
    });

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (draggedNode) {
            draggedNode.x = mouseX;
            draggedNode.y = mouseY;
            draggedNode.vx = 0;
            draggedNode.vy = 0;
        }
    });

    window.addEventListener('mouseup', () => {
        draggedNode = null;
    });

    // Resolve string references in links to actual node objects
    const resolvedLinks = links.map(link => ({
        source: nodes.find(n => n.id === link.source),
        target: nodes.find(n => n.id === link.target)
    }));

    // Animation Loop
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // --- Physics Calculation ---
        
        // 1. Repulsion between all nodes (Coulomb's Law)
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist === 0) dist = 0.01;
                
                // Repulsion force
                const force = repulsion / (dist * dist);
                
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;
                
                if (n1 !== draggedNode) {
                    n1.vx -= fx / n1.mass;
                    n1.vy -= fy / n1.mass;
                }
                if (n2 !== draggedNode) {
                    n2.vx += fx / n2.mass;
                    n2.vy += fy / n2.mass;
                }
            }
        }

        // 2. Attraction along links (Hooke's Law / Springs)
        resolvedLinks.forEach(link => {
            const dx = link.target.x - link.source.x;
            const dy = link.target.y - link.source.y;
            let dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist === 0) dist = 0.01;
            
            const displacement = dist - springLength;
            const force = displacement * springStrength;
            
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;
            
            if (link.source !== draggedNode) {
                link.source.vx += fx / link.source.mass;
                link.source.vy += fy / link.source.mass;
            }
            if (link.target !== draggedNode) {
                link.target.vx -= fx / link.target.mass;
                link.target.vy -= fy / link.target.mass;
            }
        });

        // 3. Keep nodes inside canvas (soft bounds)
        const margin = 50;
        nodes.forEach(node => {
            if (node.x < margin) node.vx += (margin - node.x) * 0.05;
            if (node.x > canvas.width - margin) node.vx -= (node.x - (canvas.width - margin)) * 0.05;
            if (node.y < margin) node.vy += (margin - node.y) * 0.05;
            if (node.y > canvas.height - margin) node.vy -= (node.y - (canvas.height - margin)) * 0.05;
        });

        // --- Drawing ---

        // Draw Links
        ctx.lineWidth = 1.5;
        resolvedLinks.forEach(link => {
            ctx.beginPath();
            ctx.moveTo(link.source.x, link.source.y);
            ctx.lineTo(link.target.x, link.target.y);
            
            // Glowing lines
            const grad = ctx.createLinearGradient(link.source.x, link.source.y, link.target.x, link.target.y);
            grad.addColorStop(0, link.source.color);
            grad.addColorStop(1, link.target.color);
            
            ctx.strokeStyle = grad;
            ctx.globalAlpha = 0.6;
            ctx.stroke();
        });
        ctx.globalAlpha = 1.0;

        // Apply Velocity and Draw Nodes
        nodes.forEach(node => {
            if (node !== draggedNode) {
                node.vx *= damping;
                node.vy *= damping;
                node.x += node.vx;
                node.y += node.vy;
            }

            // Draw Node Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = node.color;

            // Draw Node Circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#050508'; // Dark center
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = node.color;
            ctx.stroke();
            
            ctx.shadowBlur = 0; // reset

            // Draw Label
            ctx.fillStyle = '#fff';
            ctx.font = '12px "JetBrains Mono", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, node.x, node.y + node.radius + 15);
        });

        requestAnimationFrame(render);
    }

    render();
});
