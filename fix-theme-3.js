const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'theme-3', 'index.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the footer closing tag
const footerIdx = content.indexOf('</footer>');
if (footerIdx !== -1) {
    // Keep everything up to the end of the content-wrapper
    const cutIdx = content.indexOf('</div>', footerIdx);
    if (cutIdx !== -1) {
        let cleanContent = content.substring(0, cutIdx + 6);
        
        // Add the scripts back
        cleanContent += `
    <!-- Replaced Three.js with Custom Paper Physics 2D Canvas -->
    <script src="script.js"></script>
    <script src="paper-physics.js"></script>
    
    <!-- Theme Switcher & CSS injected via script -->
    <style>
      .theme-switcher {
        position: fixed;
        bottom: 1rem;
        left: 1rem;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
      }
      .switcher-toggle {
        background: #111;
        color: #fff;
        border: 1px solid #333;
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .switcher-toggle:hover {
        background: #333;
      }
      .switcher-menu {
        position: absolute;
        bottom: calc(100% + 0.5rem);
        left: 0;
        background: #111;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-width: 250px;
        opacity: 0;
        pointer-events: none;
        transform: translateY(10px);
        transition: all 0.3s;
      }
      .switcher-menu::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 1rem;
        background: transparent;
      }
      .theme-switcher:hover .switcher-menu {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }
      .switcher-menu a {
        text-decoration: none;
        color: #aaa;
        font-size: 1rem;
        padding: 0.5rem;
        border-radius: 4px;
        transition: background 0.2s;
      }
      .switcher-menu a:hover {
        background: #333;
        color: #fff;
      }
      .switcher-menu a.active-theme {
        color: #fff;
        font-weight: bold;
        border-left: 2px solid #fff;
      }
    </style>
    <div class="theme-switcher">
      <button class="switcher-toggle">🔄 Change Dimensions</button>
      <div class="switcher-menu">
        <a href="#" class="active-theme">1. Paper Sketchbook</a>
        <a href="../theme-4/index.html" class="">2. Interactive Neural Graph</a>
        <a href="../theme-5/index.html" class="">3. The 3D Solar System</a>
        <a href="../theme-2/index.html" class="">4. The Bento Grid UI</a>
        <a href="../theme-1/index.html" class="">5. Legacy 3D Space</a>
      </div>
    </div>
  </body>
</html>`;
        
        fs.writeFileSync(filePath, cleanContent);
        console.log('Fixed theme-3/index.html');
    }
}
