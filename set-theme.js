const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ==========================================
// ⚙️ CHANGE YOUR PRIMARY THEME HERE
// ==========================================
// Options: 
// 'theme-1' (Legacy 3D Space)
// 'theme-2' (Bento Grid)
// 'theme-3' (Paper Sketchbook - Gamified)
// 'theme-4' (Interactive Neural Graph)
// 'theme-5' (The 3D Solar System)
const PRIMARY_THEME = 'theme-1'; 
// ==========================================

console.log('\n🚀 Switching primary theme to: ' + PRIMARY_THEME + '...\n');

// 1. Clean root directory of old theme files (only HTML, CSS, JS)
const rootFiles = fs.readdirSync(__dirname);
rootFiles.forEach(file => {
    if (file.endsWith('.html') || file.endsWith('.css') || (file.endsWith('.js') && !file.includes('-theme'))) {
        // Don't delete our config scripts
        if (!['set-theme.js', 'update-menu.js', 'fix-themes.js', 'fix-themes-hover.js'].includes(file)) {
            fs.unlinkSync(path.join(__dirname, file));
        }
    }
});

// 2. Copy new theme files to root
const themeDir = path.join(__dirname, PRIMARY_THEME);
if (!fs.existsSync(themeDir)) {
    console.error('❌ Error: ' + PRIMARY_THEME + ' does not exist!');
    process.exit(1);
}

const newFiles = fs.readdirSync(themeDir);
newFiles.forEach(file => {
    if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(themeDir, file), 'utf-8');
        
        // If it's HTML, we need to fix the asset paths from relative (../) to root (./)
        if (file.endsWith('.html')) {
            content = content.split('../img/').join('img/');
            content = content.split('../assets/').join('./assets/');
        }
        
        fs.writeFileSync(path.join(__dirname, file), content);
        console.log('✅ Copied ' + file + ' to root');
    }
});

// 3. Re-generate the Theme Switcher menus across ALL files
console.log('\n🔄 Updating navigation menus across all dimensions...');

const allDirs = ['.', 'theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5'];

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

allDirs.forEach(dir => {
    const indexPath = path.join(__dirname, dir, 'index.html');
    if (!fs.existsSync(indexPath)) return;
    
    let content = fs.readFileSync(indexPath, 'utf-8');
    
    let currentThemeContext = dir === '.' ? PRIMARY_THEME : dir;
    
    const getPath = (target) => {
        if (target === currentThemeContext) return '#';
        if (dir === '.') return './' + target + '/index.html';
        if (target === PRIMARY_THEME) return '../index.html';
        return '../' + target + '/index.html';
    };
    
    const switcherHTML = `
    <div class="theme-switcher">
      <button class="switcher-toggle">🔄 Change Dimensions</button>
      <div class="switcher-menu">
        <a href="` + getPath('theme-3') + `" class="` + (currentThemeContext === 'theme-3' ? 'active-theme' : '') + `">1. Paper Sketchbook</a>
        <a href="` + getPath('theme-4') + `" class="` + (currentThemeContext === 'theme-4' ? 'active-theme' : '') + `">2. Interactive Neural Graph</a>
        <a href="` + getPath('theme-5') + `" class="` + (currentThemeContext === 'theme-5' ? 'active-theme' : '') + `">3. The 3D Solar System</a>
        <a href="` + getPath('theme-2') + `" class="` + (currentThemeContext === 'theme-2' ? 'active-theme' : '') + `">4. The Bento Grid UI</a>
        <a href="` + getPath('theme-1') + `" class="` + (currentThemeContext === 'theme-1' ? 'active-theme' : '') + `">5. Legacy 3D Space</a>
      </div>
    </div>
    `;

    // Instead of complex regex, just split and replace string chunks safely
    let parts = content.split('<!-- Theme Switcher & CSS injected via script -->');
    if (parts.length > 1) {
        let closingTag = parts[1].split('</style>');
        content = parts[0] + (closingTag[1] || '');
    }

    parts = content.split('<!-- Theme Switcher -->');
    if (parts.length > 1) {
        let closingDiv = parts[1].split('</div>\n    </div>'); // The end of the switcher
        if (closingDiv.length > 1) {
            content = parts[0] + closingDiv.slice(1).join('</div>\n    </div>');
        } else {
            // fallback
            let backupClosing = parts[1].split('</div>\n  </body>');
            content = parts[0] + '</body>';
        }
    }

    // fallback regex for rogue switchers
    content = content.replace(/<div class="theme-switcher">[\s\S]*?<\/div>\s*<\/div>/g, '');

    if (dir === '.' && PRIMARY_THEME === 'theme-3') {
        content = content.replace('</body>', '\n    <!-- Theme Switcher -->\n' + switcherHTML + '\n  </body>');
    } else {
        content = content.replace('</body>', '\n' + switcherCSS + '\n' + switcherHTML + '\n  </body>');
    }
    
    fs.writeFileSync(indexPath, content);
});

console.log('\n✨ Done! Your portfolio is now running ' + PRIMARY_THEME + ' as the primary index.');
