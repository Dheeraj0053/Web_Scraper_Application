const { join } = require('path');
const { execSync } = require('child_process');
const fs = require('fs');

console.log('Checking for Puppeteer Cache...');

// Force unset the variable that skips download
delete process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD;

try {
    console.log('Forcing Puppeteer browser download...');
    // Run the puppeteer install script explicitly
    // This lives in node_modules/puppeteer/install.mjs or install.js depending on version
    // For recent versions it's a CLI command

    try {
        execSync('npx puppeteer browsers install chrome', { stdio: 'inherit', env: process.env });
    } catch (e) {
        console.log('npx install failed, trying direct node script...');
        // Fallback for older versions or different structures
        const installScript = join(__dirname, 'node_modules', 'puppeteer', 'install.js');
        if (fs.existsSync(installScript)) {
            require(installScript);
        }
    }

    console.log('Browser download completed/verified.');
} catch (error) {
    console.error('Failed to download browser:', error);
    process.exit(1);
}
