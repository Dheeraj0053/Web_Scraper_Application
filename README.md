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

