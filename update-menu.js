const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    { dir: '.', theme: 'main' },
    { dir: 'theme-1', theme: 'theme-1' },
    { dir: 'theme-2', theme: 'theme-2' },
    { dir: 'theme-4', theme: 'theme-4' },
    { dir: 'theme-5', theme: 'theme-5' }
];

const switcherCSS = `
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
      /* Invisible bridge to prevent hover loss */
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
`;

filesToUpdate.forEach(item => {
    const indexPath = path.join(__dirname, item.dir, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    // In theme-4, we might need to fix asset paths if not done yet
    if (item.theme !== 'main') {
        content = content.replace(/(href|src)="(\.\/)?(assets|img)\//g, '$1="../$3/');
    }
    
    // Define paths specific to this theme
    const getPath = (target) => {
        if (target === item.theme) return '#';
        if (item.theme === 'main') {
            return target === 'main' ? '#' : './' + target + '/index.html';
        } else {
            return target === 'main' ? '../index.html' : '../' + target + '/index.html';
        }
    };
    
    const switcherHTML = `
    <div class="theme-switcher">
      <button class="switcher-toggle">🔄 Change Dimensions</button>
      <div class="switcher-menu">
        <a href="${getPath('main')}" class="${item.theme === 'main' ? 'active-theme' : ''}">1. Paper Sketchbook</a>
        <a href="${getPath('theme-4')}" class="${item.theme === 'theme-4' ? 'active-theme' : ''}">2. Interactive Neural Graph</a>
        <a href="${getPath('theme-5')}" class="${item.theme === 'theme-5' ? 'active-theme' : ''}">3. The 3D Solar System</a>
        <a href="${getPath('theme-2')}" class="${item.theme === 'theme-2' ? 'active-theme' : ''}">4. The Bento Grid UI</a>
        <a href="${getPath('theme-1')}" class="${item.theme === 'theme-1' ? 'active-theme' : ''}">5. Legacy 3D Space</a>
      </div>
    </div>
    `;

    // Regex to remove old injected style block and theme switcher block if they exist
    content = content.replace(/<!-- Theme Switcher & CSS injected via script -->[\s\S]*?<\/style>/, '');
    content = content.replace(/<div class="theme-switcher">[\s\S]*?<\/div>\s*<\/div>/, ''); // The extra </div> is in case of nested menu
    
    // We can also just remove from <div class="theme-switcher"> to the next closing div of the switcher.
    // It's safer to just do a strict regex on the outer div structure.
    content = content.replace(/<div class="theme-switcher">[\s\S]*?<\/div>(\s*)<\/div>/g, '');

    // For the root index.html, we also want to remove the old theme switcher block, which doesn't have the <style> wrapper
    if (item.theme === 'main') {
        content = content.replace(/<!-- Theme Switcher -->[\s\S]*?<div class="theme-switcher">[\s\S]*?<\/div>(\s*)<\/div>/g, '');
    }

    // Now inject right before </body>
    // Since we might have stripped it, we just replace </body>
    if (item.theme === 'main') {
        // Root already has CSS in style.css, so we only inject HTML
        content = content.replace('</body>', '\n    <!-- Theme Switcher -->\n' + switcherHTML + '\n  </body>');
    } else {
        content = content.replace('</body>', '\n' + switcherCSS + '\n' + switcherHTML + '\n  </body>');
    }
    
    fs.writeFileSync(indexPath, content);
    console.log('Patched menu in ' + item.dir);
});
