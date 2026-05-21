const fs = require('fs');
const path = require('path');

const themes = ['theme-1', 'theme-2', 'theme-5'];

const switcherCSS = `
    <!-- Theme Switcher & CSS injected via script -->
    <style>
      .theme-switcher {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
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
        bottom: 100%;
        left: 0;
        margin-bottom: 1rem;
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
`;

themes.forEach(theme => {
    const indexPath = path.join(__dirname, theme, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    // Fix asset paths
    content = content.replace(/(href|src)="(\.\/)?(assets|img)\//g, '$1="../$3/');
    
    // Check if switcher already exists to avoid duplicates
    if (!content.includes('class="theme-switcher"')) {
        
        // Define paths specific to this theme
        const getPath = (target) => target === theme ? '#' : (target === 'main' ? '../index.html' : '../' + target + '/index.html');
        
        const switcherHTML = `
    <div class="theme-switcher">
      <button class="switcher-toggle">🔄 Change Dimensions</button>
      <div class="switcher-menu">
        <a href="../index.html">1. Paper Sketchbook</a>
        <a href="${getPath('theme-5')}" class="${theme === 'theme-5' ? 'active-theme' : ''}">2. Interactive Neural Graph</a>
        <a href="${getPath('theme-2')}" class="${theme === 'theme-2' ? 'active-theme' : ''}">3. The Bento Grid UI</a>
        <a href="${getPath('theme-1')}" class="${theme === 'theme-1' ? 'active-theme' : ''}">4. Legacy 3D Universe</a>
      </div>
    </div>
        `;
        
        // Inject right before </body>
        content = content.replace('</body>', '\n' + switcherCSS + '\n' + switcherHTML + '\n  </body>');
        fs.writeFileSync(indexPath, content);
        console.log('Patched ' + theme);
    } else {
        console.log(theme + ' already patched');
    }
});
