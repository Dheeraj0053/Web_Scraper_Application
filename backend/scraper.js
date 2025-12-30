const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

async function scrapeKeyword(keyword, baseDir) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Create keyword folder
    const keywordPath = path.join(baseDir, keyword.replace(/[^a-z0-9]/gi, '_').toLowerCase());
    if (!fs.existsSync(keywordPath)) {
        fs.mkdirSync(keywordPath, { recursive: true });
    }

    const results = [];

    try {
        console.log(`Searching for "${keyword}"...`);
        let links = [];

        // Strategy 1: DuckDuckGo (Regular/Lite)
        try {
            console.log("Strategy 1: Attempting DuckDuckGo...");
            await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(keyword)}&kl=wt-wt`, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });

            // Try multiple selector patterns for various DDG layouts
            const selectors = [
                'a[data-testid="result-title-a"]',
                '.results--main .result__a',
                '.result__title a',
                '#links .result__a'
            ];

            links = await page.evaluate((selList) => {
                for (const selector of selList) {
                    const anchors = Array.from(document.querySelectorAll(selector));
                    if (anchors.length > 0) {
                        return anchors.slice(0, 5).map(a => a.href);
                    }
                }
                return [];
            }, selectors);

            if (links.length > 0) {
                console.log(`DDG success: Found ${links.length} sources.`);
            }
        } catch (e) {
            console.log("DuckDuckGo strategy failed or timed out.");
        }

        // Strategy 2: Google Fallback (if Strategy 1 failed or returned no links)
        if (links.length === 0) {
            try {
                console.log("Strategy 2: Attempting Google Search...");
                await page.goto(`https://www.google.com/search?q=${encodeURIComponent(keyword)}`, {
                    waitUntil: 'networkidle2',
                    timeout: 30000
                });

                links = await page.evaluate(() => {
                    const anchors = Array.from(document.querySelectorAll('div.g a, div.tF2Cxc a, a h3'));
                    const urls = [];
                    for (const a of anchors) {
                        const href = a.closest('a')?.href;
                        if (href && href.startsWith('http') && !href.includes('google.com')) {
                            urls.push(href);
                        }
                        if (urls.length >= 5) break;
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
            throw new Error('Search failed: No intelligence sources could be discovered on the web.');
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
                await detailPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 30000 });

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

    } catch (error) {
        console.error('Search failed:', error);
        throw error;
    } finally {
        await browser.close();
    }

    return results;
}

module.exports = { scrapeKeyword };
