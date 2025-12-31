<<<<<<< HEAD
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
=======
# InsightScraper 
# Overview
InsightScraper is a web application that automatically collects information from the internet based on keywords. It searches the web, visits relevant websites, extracts useful content, and presents it in an organized way.
# How It Works (Simple Flow)
User enters keyword → Frontend sends request → Backend searches web → Visits top 5 websites → Extracts content → Saves to files → Returns results
## ✨ Features
- **🎯 Intelligent Discovery**: Automatically identifies top authority sources using DuckDuckGo and Google fallback
- **🔍 Deep Extraction**: Uses Puppeteer to scrape full-page content with noise filtering
- **🎨 Premium UI**: Modern glassmorphic design with smooth animations and real-time progress tracking
- **📊 Sequential Processing**: Visual feedback through Discovery → Extraction → Structuring phases
- **💾 Data Export**: Download all scraped data as organized ZIP files
- **👁️ Content Viewer**: Preview scraped intelligence directly in a modal interface
- 
## ⚙️ Technical Approach

### **Search Strategy**
1. **DuckDuckGo First:**  
   - Scrapes DuckDuckGo for the keyword  
   - Fetches top 5 relevant links using multiple fallback selectors  

2. **Google Backup:**  
   - Automatically used if DuckDuckGo fails or returns no results  

✅ *This two-step search ensures reliability and avoids CAPTCHAs.*

---

### **Content Extraction Steps**
1. **Open the page** using Puppeteer  
2. **Clean the DOM** — removes ads, navigation, and scripts  
3. **Extract content:**
   - Page title  
   - Headings (H1, H2, H3)  
   - Meaningful paragraphs (over 20 characters)  
4. **Save results** into keyword-based folders  

---

## 🖥️ User Interface Flow

| Phase | Description | Duration |
|-------|--------------|-----------|
| **Discovery** | Finds best websites | 2–3s |
| **Extraction** | Visits sites and collects data | 20–40s |
| **Structuring** | Organizes and prepares results | 1–2s |

**Final Output:**  
A responsive grid showing all scraped websites, each with:
- “View Data” and “Open” buttons  
- “Export ZIP” option to download all results  

---

## ⚠️ Limitations

1. **Speed:** 30–60 seconds for 5 sites due to loading time  
2. **Compatibility:** Some websites block automated browsers  
3. **Dynamic Pages:** JavaScript-heavy sites may not fully render  
4. **Search Engine Changes:** Layout updates may temporarily affect scraping  
5. **Storage:** Currently file-based (not suitable for very large-scale use)  
6. **Rate Limiting:** Scrapes sequentially to avoid bans  
7. **Hosting:** Free hosts may sleep after inactivity  

---

## 🔒 Security Features

- **Keyword Sanitization** – Prevents special character injection  
- **CORS Protection** – Restricts access to only authorized frontend  
- **Safe Browsing** – Puppeteer runs headless, avoiding open browser sessions  

---

## 🛠️ Technology Stack

### **Frontend**
- React  
- Vite  
- Axios  
- Lucide React (icons)  
- CSS (custom glassmorphic UI)

### **Backend**
- Node.js  
- Express  
- Puppeteer  
- Archiver (ZIP creation)

---


---

## 🌱 Future Improvements

- Add more search engines (Bing, Yahoo)  
- Support image and media scraping  
- Add filters by domain or date  
- Store data in a database  
- Enable concurrent scraping for speed  
- Provide exports in JSON, CSV, and Markdown  

---

## 🧭 Conclusion

**InsightScraper** makes online research smarter and faster.  
It automates information collection, keeps the data clean and structured, and delivers a polished user experience — all while staying secure and reliable.

---

### 💡 Author
Developed by **Dheeraj Kumar**  
📧 [GitHub Profile](https://github.com/Dheeraj0053)

# Screenshots
<img width="1920" height="1080" alt="Screenshot (172)" src="https://github.com/user-attachments/assets/cef88721-c79e-40c0-a040-1ac289151884" />

<img width="1920" height="1080" alt="Screenshot (170)" src="https://github.com/user-attachments/assets/cf436a4a-195e-4858-aae7-fd1692dcaf31" />

<img width="1920" height="1080" alt="Screenshot (169)" src="https://github.com/user-attachments/assets/22581812-37dd-4d71-85b0-81cda3e4cede" />

>>>>>>> 0709dcaab540dacdb17cb8b0790de6cd3006d6a3
