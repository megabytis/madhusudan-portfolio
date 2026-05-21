const fs = require('fs');
const path = require('path');

const themes = ['theme-1', 'theme-2', 'theme-5'];

themes.forEach(theme => {
    const indexPath = path.join(__dirname, theme, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    // Lower the button
    content = content.replace('bottom: 2rem;\n        left: 2rem;', 'bottom: 1rem;\n        left: 1rem;');
    
    // Fix the margin gap issue by using bottom calc and adding a pseudo element
    if (content.includes('margin-bottom: 1rem;')) {
        content = content.replace('bottom: 100%;\n        left: 0;\n        margin-bottom: 1rem;', 'bottom: calc(100% + 0.5rem);\n        left: 0;');
        
        // Add the pseudo element right after .switcher-menu { ... }
        const pseudoCSS = `
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
      .theme-switcher:hover .switcher-menu {`;
        content = content.replace('.theme-switcher:hover .switcher-menu {', pseudoCSS);
        
        fs.writeFileSync(indexPath, content);
        console.log('Fixed hover and position in ' + theme);
    }
});
