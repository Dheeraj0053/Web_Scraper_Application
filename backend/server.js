const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { scrapeKeyword } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 42069;

// Production CORS: Add your frontend URL to your .env file
const getAllowedOrigin = (origin, callback) => {
    const allowedUrl = process.env.FRONTEND_URL || '*';

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // If wildcard is set, allow all
    if (allowedUrl === '*') return callback(null, true);

    // Normalize URLs (remove trailing slashes) for comparison
    const normalize = (url) => url ? url.replace(/\/$/, '') : '';
    const allowed = normalize(allowedUrl);
    const requestOrigin = normalize(origin);

    console.log(`[CORS] Checking origin: ${requestOrigin} against allowed: ${allowed}`);

    if (allowed === requestOrigin) {
        callback(null, true);
    } else {
        console.warn(`[CORS] Blocked request from: ${origin}`);
        callback(new Error('Not allowed by CORS'));
    }
};

const corsOptions = {
    origin: getAllowedOrigin,
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const sanitizeKeyword = (k) => k.replace(/[^a-z0-9]/gi, '_').toLowerCase();

// Ensure the 'scrapes' directory exists
const scrapesDir = path.join(__dirname, 'scrapes');
if (!fs.existsSync(scrapesDir)) {
    fs.mkdirSync(scrapesDir);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', server: 'InsightScraper Backend' });
});

app.post('/api/scrape', async (req, res) => {
    const { keyword } = req.body;

    console.log(`[REQUEST] Received scrape request for: "${keyword}" from ${req.headers.origin || 'unknown'}`);

    if (!keyword) {
        return res.status(400).json({ error: 'Keyword is required' });
    }

    try {
        console.log(`Starting scrape for: ${keyword}`);
        const result = await scrapeKeyword(keyword, scrapesDir);
        res.json({
            message: 'Scraping completed successfully',
            data: result,
            zipUrl: `/api/download/${keyword}`
        });
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).json({
            error: 'Scraping failed',
            details: error.message,
            stack: process.env.NODE_ENV === 'production' ? 'hidden' : error.stack
        });
    }
});

// Endpoint to list results for a keyword
app.get('/api/results/:keyword', (req, res) => {
    const { keyword } = req.params;
    const safeKeyword = sanitizeKeyword(keyword);
    const folderPath = path.join(scrapesDir, safeKeyword);

    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: 'No results found for this keyword' });
    }

    const domains = fs.readdirSync(folderPath).filter(file => {
        return fs.statSync(path.join(folderPath, file)).isDirectory();
    });

    const results = domains.map(domain => {
        const contentPath = path.join(folderPath, domain, 'content.txt');
        let preview = '';
        if (fs.existsSync(contentPath)) {
            preview = fs.readFileSync(contentPath, 'utf8').substring(0, 200) + '...';
        }
        return { domain, preview };
    });

    res.json(results);
});

// Endpoint to get full content for a domain
app.get('/api/content/:keyword/:domain', (req, res) => {
    const { keyword, domain } = req.params;
    const safeKeyword = sanitizeKeyword(keyword);
    const filePath = path.join(scrapesDir, safeKeyword, domain, 'content.txt');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Content not found' });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    res.json({ content });
});

// Endpoint to download results as ZIP
app.get('/api/download/:keyword', (req, res) => {
    const { keyword } = req.params;
    const safeKeyword = sanitizeKeyword(keyword);
    const folderPath = path.join(scrapesDir, safeKeyword);

    if (!fs.existsSync(folderPath)) {
        return res.status(404).json({ error: 'Results not found' });
    }

    const archiver = require('archiver');
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment(`${keyword}.zip`);
    archive.pipe(res);
    archive.directory(folderPath, false);
    archive.finalize();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is in use, trying next one...`);
        app.listen(PORT + 1);
    } else {
        console.error('Server error:', err);
    }
});
