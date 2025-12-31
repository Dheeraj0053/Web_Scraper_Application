# Web Scraper Application - InsightScraper

A high-fidelity web intelligence scraping engine that transforms keywords into structured, actionable data. Built with React, Node.js, and Puppeteer.

## 🚀 Features

- **Intelligent Web Scraping**: Automatically discovers and scrapes top authority sources for any keyword
- **Multi-Engine Support**: Uses both DuckDuckGo and Google for comprehensive results
- **Beautiful UI**: Modern, responsive interface with real-time progress tracking
- **Data Export**: Download scraped data as organized ZIP files
- **Content Viewer**: Preview scraped content directly in the browser

## 📁 Project Structure

```
web_scrapper application/
├── backend/                 # Node.js Express API
│   ├── server.js           # Main server file
│   ├── scraper.js          # Puppeteer scraping logic
│   └── package.json        # Backend dependencies
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx        # Main application component
│   │   └── index.css      # Styling
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

## 🛠️ Local Development

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:42069`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🌐 Deployment to Render

We provide comprehensive deployment guides for Render:

### Quick Start

1. **Read the deployment checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. **Follow the detailed guide**: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
3. **Use the render.yaml**: Automated infrastructure-as-code configuration included

### Key Files for Deployment

- `render.yaml` - Render infrastructure configuration
- `frontend/.env.production.example` - Template for production environment variables
- `RENDER_DEPLOYMENT_GUIDE.md` - Comprehensive deployment instructions
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment checklist

## 📖 How to Use

1. Enter a keyword in the search bar
2. Click "Generate Insights" to start scraping
3. Wait for the discovery, extraction, and structuring phases to complete
4. View scraped data from individual domains
5. Download all results as a ZIP file

## 🔧 Technologies Used

### Frontend
- React 19
- Vite
- Axios
- Lucide React (icons)
- Framer Motion (animations)

### Backend
- Node.js
- Express
- Puppeteer (web scraping)
- Archiver (ZIP creation)
- CORS

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Made with ❤️ using modern web technologies**