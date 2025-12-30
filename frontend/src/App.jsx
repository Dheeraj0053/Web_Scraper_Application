import React, { useState } from 'react';
import axios from 'axios';
import {
  Search,
  Loader2,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  FileText,
  AlertCircle,
  Eye,
  RefreshCw,
  X,
  Layers,
  Sparkles
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:42069/api';

function App() {
  const [keyword, setKeyword] = useState('');
  // status flow: idle -> discovering -> extracting -> structuring -> completed
  const [status, setStatus] = useState('idle');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const startScraping = async () => {
    if (!keyword.trim()) return;

    setResults([]);
    setError(null);

    // Step 1: Start Discovery
    setStatus('discovering');

    try {
      // We simulate the discovery phase transition for UI feel, 
      // then trigger the actual backend work during the extraction phase.

      const timer = setTimeout(() => {
        setStatus('extracting');
      }, 2500);

      const response = await axios.post(`${API_BASE}/scrape`, { keyword });

      clearTimeout(timer);

      // Step 3: Transition to Structuring briefly
      setStatus('structuring');
      setResults(response.data.data);

      setTimeout(() => {
        setStatus('completed');
      }, 1500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.details || err.response?.data?.error || 'Intelligence engine encountered an error');
      setStatus('error');
    }
  };

  const handleDownload = () => {
    window.open(`${API_BASE}/download/${keyword}`, '_blank');
  };

  const viewContent = async (domain) => {
    try {
      const response = await axios.get(`${API_BASE}/content/${keyword}/${domain}`);
      setSelectedContent({
        domain,
        content: response.data.content
      });
      setIsModalOpen(true);
    } catch (err) {
      alert("Intelligence data retrieval failed");
    }
  };

  return (
    <div className="main-container">
      <div className="hero">
        <h1>Insight<span className="highlight">Scraper</span></h1>
        <p className="subtitle">High-fidelity web intelligence engine. Turn any keyword into deep, structured knowledge in seconds.</p>
      </div>

      <div className="search-wrapper">
        <div className="search-bar">
          <input
            type="text"
            placeholder="What knowledge do you seek today?"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            disabled={status !== 'idle' && status !== 'completed' && status !== 'error'}
            onKeyPress={(e) => e.key === 'Enter' && startScraping()}
          />
          <button
            className="primary-btn"
            onClick={startScraping}
            disabled={!keyword || (status !== 'idle' && status !== 'completed' && status !== 'error')}
          >
            {status !== 'idle' && status !== 'completed' && status !== 'error' ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            {status !== 'idle' && status !== 'completed' && status !== 'error' ? 'Analysing...' : 'Generate Insights'}
          </button>
        </div>
      </div>

      {status === 'error' && (
        <div className="error-bar">
          <AlertCircle size={20} />
          <span style={{ flex: 1 }}>{error}</span>
          <button
            onClick={() => setStatus('idle')}
            style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
          >
            <RefreshCw size={18} />
          </button>
        </div>
      )}

      {(status !== 'idle' && status !== 'error') && (
        <div className="status-grid">
          {/* Card 1: Discovery */}
          <div className={`status-card ${status === 'discovering' ? 'active' : status !== 'idle' ? 'completed' : ''}`}>
            <div className="icon-box">
              {status === 'discovering' ? <Loader2 className="animate-spin" size={24} /> : status !== 'idle' ? <CheckCircle2 size={24} /> : <Search size={24} />}
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Discovery</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Identifying top authority sources</p>
            </div>
          </div>

          {/* Card 2: Extraction */}
          <div className={`status-card ${status === 'extracting' ? 'active' : (status === 'structuring' || status === 'completed') ? 'completed' : ''}`}>
            <div className="icon-box">
              {status === 'extracting' ? <Loader2 className="animate-spin" size={24} /> : (status === 'structuring' || status === 'completed') ? <CheckCircle2 size={24} /> : <Layers size={24} />}
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Extraction</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Deep-scanning page intelligence</p>
            </div>
          </div>

          {/* Card 3: Structuring */}
          <div className={`status-card ${status === 'structuring' ? 'active' : status === 'completed' ? 'completed' : ''}`}>
            <div className="icon-box">
              {status === 'structuring' ? <Loader2 className="animate-spin" size={24} /> : status === 'completed' ? <CheckCircle2 size={24} /> : <FileText size={24} />}
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Structuring</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Finalizing data architecture</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Progress Message - Active during the extraction phase */}
      {(status === 'extracting') && (
        <div className="extraction-message">
          <Loader2 className="animate-spin" size={20} />
          <span>Web scraping is under progress. Please wait...</span>
        </div>
      )}

      {status === 'completed' && results.length > 0 && (
        <div className="results-container">
          <div className="results-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.5rem' }}>
              <Globe size={24} style={{ color: 'var(--primary)' }} /> Intelligence Map
            </h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button className="secondary-btn" onClick={() => setStatus('idle')}>
                <RefreshCw size={18} /> New Analysis
              </button>
              <button className="primary-btn" onClick={handleDownload} style={{ padding: '12px 25px' }}>
                <Download size={18} /> Export ZIP
              </button>
            </div>
          </div>

          <div className="results-grid">
            {results.map((res, i) => (
              <div key={i} className="result-card">
                <span className="domain-name">{res.domain}</span>
                <span className="url-text">{res.url}</span>
                <div className="card-footer">
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="action-link">
                    Open <ExternalLink size={16} />
                  </a>
                  <button className="secondary-btn" onClick={() => viewContent(res.domain)}>
                    <Eye size={16} /> View Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && selectedContent && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedContent.domain}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="secondary-btn"
                style={{ padding: '10px' }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <pre>{selectedContent.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
