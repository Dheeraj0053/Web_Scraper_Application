const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

async function scrapeKeyword(keyword, baseDir) {
    // Configure Puppeteer for Render deployment
    const launchOptions = {
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--window-size=1920x1080'
        ]
    };

    // Use system Chromium on Render
    // We check common paths because Render's path can vary by stack/image
    const chromePaths = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/opt/render/project/.render/chrome/opt/google/chrome/google-chrome'
    ].filter(Boolean);

    let executablePath = null;
    for (const p of chromePaths) {
        if (p && fs.existsSync(p)) {
            executablePath = p;
            console.log(`[Puppeteer] Found Chrome at: ${p}`);
            break;
        }
    }

    if (executablePath) {
        launchOptions.executablePath = executablePath;
    } else {
        console.warn('[Puppeteer] No system Chrome found. Trusting Puppeteer to find its own bundled browser (from cache)...');
        // Do NOT set executablePath to null/undefined explicitly if it was part of launchOptions
        // Just don't set it.
        if (launchOptions.executablePath) delete launchOptions['executablePath'];
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set a realistic user agent
    // Set a realistic user agent (Randomized)
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
    ];
    const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(randomUA);

    // Create keyword folder
    const keywordPath = path.join(baseDir, keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase());
    if (!fs.existsSync(keywordPath)) {
        fs.mkdirSync(keywordPath, { recursive: true });
    }

    const results = [];

    try {
        console.log(`Searching for "${keyword}"...`);
        let links = [];

        // Strategy 0: Direct URL (Bypass search engine if input looks like a URL)
        if (keyword.match(/^https?:\/\//) || keyword.match(/^[a-zA-Z0-9-]+\.[a-z]{2,}/)) {
            console.log("Input looks like a URL/Domain. Bypassing search engine...");
            let url = keyword;
            if (!url.startsWith('http')) url = 'https://' + url;
            links = [url];
        } else {
            // Proceed to search strategies...

            // Strategy 1: DuckDuckGo Lite (HTML Only, Robust for Cloud IPs)
            try {
                console.log("Strategy 1: Attempting DuckDuckGo Lite...");

                // Allow CSS/Fonts for search page to ensure layout renders, only blocking explicit heavy media
                await page.setRequestInterception(true);
                page.on('request', (req) => {
                    const resourceType = req.resourceType();
                    if (['image', 'media'].includes(resourceType)) {
                        req.abort();
                    } else {
                        req.continue();
                    }
                });

                // Use the Lite version - it's HTML only and much friendlier to scrapers
                await page.goto(`https://duckduckgo.com/lite/?q=${encodeURIComponent(keyword)}&kl=wt-wt`, {
                    waitUntil: 'domcontentloaded', // Lite loads fast
                    timeout: 30000
                });

                // DDG Lite uses table-based layout. Links are in .result-link
                links = await page.evaluate(() => {
                    const anchors = Array.from(document.querySelectorAll('.result-link'));
                    return anchors.slice(0, 3).map(a => a.href);
                });

                if (links.length > 0) {
                    console.log(`DDG Lite success: Found ${links.length} sources.`);
                }
            } catch (e) {
                console.log("DuckDuckGo Lite strategy failed:", e.message);
            }

            // Strategy 2: Bing Fallback
            if (links.length === 0) {
                try {
                    console.log("Strategy 2: Attempting Bing Search...");
                    await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(keyword)}`, {
                        waitUntil: 'domcontentloaded',
                        timeout: 45000
                    });

                    links = await page.evaluate(() => {
                        const anchors = Array.from(document.querySelectorAll('.b_algo h2 a'));
                        return anchors.slice(0, 3).map(a => a.href);
                    });

                    if (links.length > 0) {
                        console.log(`Bing success: Found ${links.length} sources.`);
                    }
                } catch (e) {
                    console.log("Bing strategy failed:", e.message);
                }
            }

            // Strategy 3: Yahoo Fallback
            if (links.length === 0) {
                try {
                    console.log("Strategy 3: Attempting Yahoo Search...");
                    await page.goto(`https://search.yahoo.com/search?p=${encodeURIComponent(keyword)}`, {
                        waitUntil: 'domcontentloaded',
                        timeout: 45000
                    });

                    links = await page.evaluate(() => {
                        const anchors = Array.from(document.querySelectorAll('.algo .compTitle a'));
                        return anchors.slice(0, 3).map(a => a.href);
                    });

                    if (links.length > 0) {
                        console.log(`Yahoo success: Found ${links.length} sources.`);
                    }
                } catch (e) {
                    console.log("Yahoo strategy failed:", e.message);
                }
            }

            // Strategy 4: Google Fallback (standard)
            if (links.length === 0) {
                try {
                    console.log("Strategy 4: Attempting Google Search...");
                    // Note: Request interception persists from above
                    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
                        waitUntil: 'networkidle2',
                        timeout: 60000
                    });

                    links = await page.evaluate(() => {
                        const anchors = Array.from(document.querySelectorAll('div.g a, div.tF2Cxc a, a h3'));
                        const urls = [];
                        for (const a of anchors) {
                            const href = a.closest('a')?.href;
                            if (href && href.startsWith('http') && !href.includes('google.com')) {
                                urls.push(href);
                            }
                            if (urls.length >= 3) break;
                        }
                        return urls;
                    });

                    if (links.length > 0) {
                        console.log(`Google success: Found ${links.length} sources.`);
                    }
                } catch (e) {
                    console.log("Google strategy failed or timed out.");
                }
            }

            if (!links || links.length === 0) {
                // Log page content for debugging if everything fails
                const content = await page.content();
                console.log("DEBUG: Page content length:", content.length);
                throw new Error('Search failed: No intelligence sources could be discovered. Search engine blocked request.');
            }

            console.log(`Deep scanning ${links.length} sources...`);

            for (const link of links) {
                try {
                    const domain = new URL(link).hostname;
                    const domainPath = path.join(keywordPath, domain);
                    if (!fs.existsSync(domainPath)) {
                        fs.mkdirSync(domainPath, { recursive: true });
                    }

                    console.log(`Scraping: ${link}`);
                    const detailPage = await browser.newPage();

                    // Optimize detail page as well
                    await detailPage.setRequestInterception(true);
                    detailPage.on('request', (req) => {
                        const resourceType = req.resourceType();
                        if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
                            req.abort();
                        } else {
                            req.continue();
                        }
                    });

                    // Increase timeout for individual pages
                    await detailPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });

                    // Remove noise
                    await detailPage.evaluate(() => {
                        const noiseSelectors = ['nav', 'footer', 'header', '.ads', '.cookie-banner', 'script', 'style', 'noscript', 'iframe'];
                        noiseSelectors.forEach(selector => {
                            document.querySelectorAll(selector).forEach(el => el.remove());
                        });
                    });

                    const content = await detailPage.evaluate(() => {
                        const data = {
                            title: document.title,
                            headings: [],
                            body: []
                        };

                        document.querySelectorAll('h1, h2, h3').forEach(h => {
                            data.headings.push(h.innerText.trim());
                        });

                        document.querySelectorAll('p').forEach(p => {
                            if (p.innerText.trim().length > 20) {
                                data.body.push(p.innerText.trim());
                            }
                        });

                        return data;
                    });

                    // Save to file
                    const filePath = path.join(domainPath, 'content.txt');
                    const fileContent = `URL: ${link}\nTITLE: ${content.title}\n\nHEADINGS:\n${content.headings.join('\n')}\n\nBODY:\n${content.body.join('\n\n')}`;
                    fs.writeFileSync(filePath, fileContent);

                    results.push({ domain, url: link, status: 'success' });
                    await detailPage.close();
                } catch (err) {
                    console.error(`Error scraping ${link}:`, err.message);
                    results.push({ url: link, status: 'failed', error: err.message });
                }
            }
        } // End of else block

    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    } finally {
        await browser.close();
    }

    return results;
}

module.exports = { scrapeKeyword };
