import { useState, useEffect, useRef } from 'react'
import './index.css'

const API_BASE = (import.meta.env.VITE_API_BASE || 'http://localhost:5000/api').replace(/\/$/, '')

// ===== PREMIUM SVG ICONS =====
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const CameraIcon = () => (
  <svg className="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const SearchIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const LightbulbIcon = () => (
  <svg className="tip-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .5 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5"/>
    <line x1="9" y1="18" x2="15" y2="18"/>
    <line x1="10" y1="22" x2="14" y2="22"/>
  </svg>
)

const RemoveIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
)

const RefreshIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
  </svg>
)

const LinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
)

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
)

const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
)

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const RadarChart = ({ data, verdictClass }) => {
  if (!data) return null
  const labels = ['Language\nQuality', 'Source\nCredibility', 'Emotional\nManipulation', 'Factual\nAccuracy', 'Consistency']
  const keys = ['language_quality', 'source_credibility', 'emotional_manipulation', 'factual_accuracy', 'consistency']
  const values = keys.map(k => (data[k] ?? 50))
  
  const cx = 140, cy = 130, maxR = 90
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0]
  const angleStep = (2 * Math.PI) / 5
  const startAngle = -Math.PI / 2

  const getPoint = (i, r) => {
    const angle = startAngle + i * angleStep
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  }

  const dataPoints = values.map((v, i) => getPoint(i, (v / 100) * maxR))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'

  const colorMap = { safe: '#10b981', suspicious: '#fbbf24', fake: '#f43f5e' }
  const fillColor = colorMap[verdictClass] || '#7c3aed'

  return (
    <div className="radar-chart-container">
      <h4 className="radar-chart-title">Confidence Breakdown</h4>
      <svg viewBox="0 0 280 260" className="radar-chart-svg">
        <defs>
          <filter id="radar-glow">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {levels.map((lv, li) => {
          const pts = Array.from({ length: 5 }, (_, i) => getPoint(i, maxR * lv))
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'
          return <path key={li} d={path} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const end = getPoint(i, maxR)
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
        })}
        <path d={dataPath} fill={fillColor} fillOpacity="0.15" stroke={fillColor} strokeWidth="2" filter="url(#radar-glow)" className="radar-polygon"/>
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={fillColor} stroke="#fff" strokeWidth="1.5" className="radar-dot"/>
        ))}
        {labels.map((label, i) => {
          const labelR = maxR + 28
          const pt = getPoint(i, labelR)
          const lines = label.split('\n')
          return (
            <text key={i} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="middle" className="radar-axis-label">
              {lines.map((line, li) => (
                <tspan key={li} x={pt.x} dy={li === 0 ? 0 : 12}>{line}</tspan>
              ))}
            </text>
          )
        })}
        {dataPoints.map((p, i) => (
          <text key={`val-${i}`} x={p.x} y={p.y - 12} textAnchor="middle" className="radar-value-label">{values[i]}</text>
        ))}
      </svg>
    </div>
  )
}

const SCAM_PATTERNS = [
  { id: 1, name: 'YouTube Like Job Scam', severity: 'CRITICAL', category: 'job', description: 'Scammers offer daily wages for liking YouTube videos or rating products online, then demand registration fees.', example: '"Earn ₹5000-₹10000 daily just by watching and liking YouTube videos! No experience needed. Join now via WhatsApp."', tips: 'Legitimate companies never ask you to pay to start working. No real job pays thousands for clicking likes.' },
  { id: 2, name: 'Fake Government Scheme', severity: 'CRITICAL', category: 'news', description: 'Fake messages claiming government is giving free money, laptops, or rations — often with links to phishing sites.', example: '"PM Modi announces ₹6000 free for every family under new scheme! Click link to register: bit.ly/free-money-gov"', tips: 'Verify government schemes only on official .gov.in websites. Government never distributes money via WhatsApp links.' },
  { id: 3, name: 'Deepfake News Video', severity: 'CRITICAL', category: 'news', description: 'AI-generated videos of celebrities or news anchors making fake announcements or endorsing products.', example: '"BREAKING: Famous news anchor announces all banks will freeze accounts for 7 days starting Monday!"', tips: 'Check official news channels for any breaking news. Deepfakes often have unnatural lip sync or blurring around the face.' },
  { id: 4, name: 'Lottery/Prize Winner Scam', severity: 'WARNING', category: 'job', description: 'Messages claiming you won a lottery or prize, asking for personal details or processing fees to claim.', example: '"Congratulations! Your number has been selected for ₹25 Lakhs in the WhatsApp Lucky Draw! Send your bank details to claim."', tips: 'You cannot win a lottery you never entered. Never share bank details with unknown contacts.' },
  { id: 5, name: 'Urgent Bank Account Freeze', severity: 'CRITICAL', category: 'news', description: 'Fake alerts claiming your bank account will be frozen, suspended, or debited unless you click a link immediately.', example: '"URGENT: Your SBI account will be blocked in 24 hours! Update your KYC immediately: http://sbi-update.fake.com"', tips: 'Banks never send urgent KYC links via SMS. Always visit your bank branch or official app directly.' },
  { id: 6, name: 'Crypto Investment Scam', severity: 'WARNING', category: 'job', description: 'Promises of guaranteed high returns on cryptocurrency investments with no risk, often using fake celebrity endorsements.', example: '"Invest ₹10,000 in our AI crypto bot and earn ₹1,00,000 in just 7 days! 100% guaranteed returns, zero risk."', tips: 'No legitimate investment guarantees returns. Crypto markets are highly volatile — "guaranteed profit" is always a scam.' },
  { id: 7, name: 'Phishing HR Email', severity: 'WARNING', category: 'job', description: 'Fake job offers from "HR" of reputed companies sent via Gmail/Yahoo instead of official company domains.', example: '"Dear Candidate, You have been selected for Software Engineer at Google. Salary: ₹45 LPA. Reply to hr.google.recruit@gmail.com"', tips: 'Real companies use official email domains (@google.com, not @gmail.com). Verify offers directly on the company career page.' },
  { id: 8, name: 'Health Misinformation', severity: 'WARNING', category: 'news', description: 'Viral WhatsApp forwards claiming miracle cures, dangerous food combinations, or false vaccine information.', example: '"DOCTORS EXPOSED: Drinking hot water with lemon at 5 AM cures cancer! Big Pharma doesn\'t want you to know this!"', tips: 'Always verify health claims with WHO, ICMR, or your doctor. Forwarded messages with ALL CAPS and exclamation marks are red flags.' },
  { id: 9, name: 'Job Requiring Upfront Fee', severity: 'CRITICAL', category: 'job', description: 'Legitimate-looking job offers that require you to pay for training, materials, ID cards, or background verification upfront.', example: '"You are hired as Data Entry Operator! Salary: ₹35,000/month. Please pay ₹2,500 registration fee to confirm your slot."', tips: 'Employers pay you, not the other way around. Any job asking for money before starting is a scam — no exceptions.' },
  { id: 10, name: 'AI-Generated Fake Article', severity: 'WARNING', category: 'news', description: 'Articles generated by AI that look professional but contain fabricated facts, fake quotes, and invented sources.', example: '"According to a study by the International Health Council (IHC), using smartphones for more than 2 hours causes permanent brain damage in children."', tips: 'Search for the cited organization or study. Fake articles often cite non-existent institutions or misquote real ones.' }
]

const renderVerdictIcon = (verdict) => {
  if (!verdict) return null
  const v = verdict.toLowerCase()
  if (v === 'safe') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    )
  }
  if (v === 'suspicious') {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    )
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  )
}

function App() {
  const [mode, setMode] = useState('news') // 'news' or 'job'
  const [text, setText] = useState('')
  const [image, setImage] = useState(null) // base64 representation
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [analyzedText, setAnalyzedText] = useState('')
  const [selectedFlagIndex, setSelectedFlagIndex] = useState(null)
  const [history, setHistory] = useState([])
  const [apiReady, setApiReady] = useState(true)
  const [copied, setCopied] = useState(false)
  const [searchSummary, setSearchSummary] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [threats, setThreats] = useState([])
  const [threatsLoading, setThreatsLoading] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef(null)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallGuide, setShowInstallGuide] = useState(false)

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('truthguard_history')
    if (saved) setHistory(JSON.parse(saved))
    checkApiHealth()
    fetchThreats()

    // PWA install prompt capture
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Auto-refresh threat feed every 60 seconds
    const interval = setInterval(() => {
      fetchThreats()
    }, 60000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [])

  const fetchThreats = async () => {
    setThreatsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/threats`)
      const data = await res.json()
      if (data.success) {
        setThreats(data.threats)
      }
    } catch (err) {
      console.error("Failed to fetch threats:", err)
    } finally {
      setThreatsLoading(false)
    }
  }

  const handleScanThreat = (threat) => {
    setMode(threat.type)
    setText(threat.sample_text)
    setResult(null)
    setError(null)
    setAnalyzedText('')
    setSelectedFlagIndex(null)
    
    // Smooth scroll and focus content input
    setTimeout(() => {
      const inputEl = document.getElementById('content-input')
      if (inputEl) {
        inputEl.focus()
        inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  const checkApiHealth = async (retryCount = 0) => {
    try {
      const res = await fetch(`${API_BASE}/health`)
      const data = await res.json()
      setApiReady(data.api_configured)
    } catch {
      setApiReady(false)
      // Auto-retry every 5 seconds for up to 2 minutes (cold start)
      if (retryCount < 24) {
        setTimeout(() => checkApiHealth(retryCount + 1), 5000)
      }
    }
  }

  const saveToHistory = (text, type, result) => {
    const item = {
      id: Date.now(),
      text: text.substring(0, 100),
      type,
      verdict: result.verdict,
      trust_score: result.trust_score,
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    }
    const newHistory = [item, ...history].slice(0, 6) // Keep last 6
    setHistory(newHistory)
    localStorage.setItem('truthguard_history', JSON.stringify(newHistory))
  }

  const isUrl = (str) => {
    try {
      const url = new URL(str.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) processFile(file)
  }

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG).')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      setError('Image is too large. Please select an image smaller than 4MB.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result)
      setImagePreview(URL.createObjectURL(file))
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const handleAnalyze = async () => {
    const trimmedText = text.trim()
    if (!trimmedText && !image) {
      setError('Please enter text, paste a link, or upload an image to analyze.')
      return
    }

    if (trimmedText && trimmedText.length < 20 && !isUrl(trimmedText)) {
      setError('Please enter at least 20 characters to analyze.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)
    setSelectedFlagIndex(null)

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: trimmedText, 
          image: image, 
          type: mode 
        })
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Analysis failed. Please try again.')
      }

      setResult(data.result)
      setSearchSummary(data.search_summary || null)
      setSearchResults(data.search_results || null)
      setAnalyzedText((data.transcribed_text || data.analyzed_text || (image ? '' : trimmedText) || '').toString())
      
      const historyText = image 
        ? `Screenshot (${mode === 'news' ? 'News' : 'Job Offer'})`
        : (isUrl(trimmedText) ? `Link: ${trimmedText}` : trimmedText)
        
      saveToHistory(historyText, mode, data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictClass = (verdict) => {
    if (!verdict) return ''
    const v = verdict.toLowerCase()
    if (v === 'safe') return 'safe'
    if (v === 'suspicious') return 'suspicious'
    return 'fake'
  }

  const handleCopyResult = () => {
    if (!result) return
    const redFlagsText = (result.red_flags || []).map((rf) => {
      if (typeof rf === 'string') return rf
      return rf?.flag || ''
    }).filter(Boolean)
    const summary = `TruthGuard Analysis\nVerdict: ${result.verdict}\nTrust Score: ${result.trust_score}/100\n\n${result.explanation}\n\nRed Flags:\n${redFlagsText.map(f => '• ' + f).join('\n')}`
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setResult(null)
    setSearchSummary(null)
    setSearchResults(null)
    setError(null)
    setText('')
    setAnalyzedText('')
    setSelectedFlagIndex(null)
    setChatOpen(false)
    setChatMessages([])
    setChatInput('')
    handleRemoveImage()
  }

  const handleHistoryClick = (item) => {
    setMode(item.type)
    setText(item.text)
    setResult(null)
    setAnalyzedText('')
    setSelectedFlagIndex(null)
    setChatOpen(false)
    setChatMessages([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSendChat = async (msg) => {
    const message = (msg || chatInput).trim()
    if (!message || chatLoading) return
    const userMsg = { role: 'user', text: message }
    setChatMessages(prev => [...prev, userMsg])
    setChatInput('')
    setChatLoading(true)
    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: { original_text: analyzedText || text, result }
        })
      })
      const data = await res.json()
      if (data.success) {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.reply }])
      } else {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.error || 'Sorry, I could not process that.' }])
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'ai', text: 'Network error. Please try again.' }])
    } finally {
      setChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  const generateReportCard = () => {
    if (!result) return
    const canvas = document.createElement('canvas')
    const w = 800, h = 1000
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#030307'
    ctx.fillRect(0, 0, w, h)

    // Grid dots
    ctx.fillStyle = 'rgba(255,255,255,0.03)'
    for (let x = 0; x < w; x += 30) for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill() }

    // Header gradient bar
    const hGrad = ctx.createLinearGradient(0, 0, w, 0)
    hGrad.addColorStop(0, '#4f46e5')
    hGrad.addColorStop(0.5, '#7c3aed')
    hGrad.addColorStop(1, '#06b6d4')
    ctx.fillStyle = hGrad
    ctx.fillRect(0, 0, w, 6)

    // Brand
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 28px Sora, Inter, sans-serif'
    ctx.fillText('TruthGuard', 40, 60)
    ctx.fillStyle = '#475569'
    ctx.font = '600 12px Inter, sans-serif'
    ctx.fillText('AI-POWERED DETECTION REPORT', 40, 82)

    // Verdict
    const verdictColors = { safe: '#10b981', suspicious: '#fbbf24', fake: '#f43f5e', scam: '#f43f5e' }
    const vc = verdictColors[(result.verdict || '').toLowerCase()] || '#7c3aed'
    ctx.fillStyle = vc
    ctx.font = 'bold 42px Sora, Inter, sans-serif'
    ctx.fillText((result.verdict || 'UNKNOWN').toUpperCase(), 40, 150)

    // Trust Score circle
    ctx.beginPath()
    ctx.arc(700, 130, 50, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255,255,255,0.08)'
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(700, 130, 50, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * (result.trust_score || 0) / 100))
    ctx.strokeStyle = vc
    ctx.lineWidth = 6
    ctx.stroke()
    ctx.fillStyle = vc
    ctx.font = 'bold 36px Sora, Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(`${result.trust_score}`, 700, 138)
    ctx.fillStyle = '#475569'
    ctx.font = '600 10px Inter, sans-serif'
    ctx.fillText('TRUST SCORE', 700, 160)
    ctx.textAlign = 'left'

    // Category + Mode
    ctx.fillStyle = '#94a3b8'
    ctx.font = '500 14px Inter, sans-serif'
    ctx.fillText(`Category: ${result.category || 'General'}  |  Mode: ${mode === 'news' ? 'News Analysis' : 'Job Scam Analysis'}`, 40, 200)

    // Divider
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(40, 220); ctx.lineTo(w - 40, 220); ctx.stroke()

    // Explanation
    ctx.fillStyle = '#e2e8f0'
    ctx.font = '400 15px Inter, sans-serif'
    const expWords = (result.explanation || '').split(' ')
    let expLine = '', expY = 260
    for (const word of expWords) {
      if (ctx.measureText(expLine + word + ' ').width > w - 80) {
        ctx.fillText(expLine.trim(), 40, expY)
        expLine = word + ' '
        expY += 24
      } else {
        expLine += word + ' '
      }
    }
    if (expLine.trim()) ctx.fillText(expLine.trim(), 40, expY)

    // Red Flags
    let fy = expY + 50
    ctx.fillStyle = '#f43f5e'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillText('RED FLAGS', 40, fy)
    fy += 28
    ctx.fillStyle = '#fca5a5'
    ctx.font = '400 13px Inter, sans-serif'
    for (const flag of (result.red_flags || []).slice(0, 6)) {
      const label = typeof flag === 'string' ? flag : flag?.flag || ''
      if (label) {
        const flagWords = label.split(' ')
        let flagLine = '   •  '
        for (const fw of flagWords) {
          if (ctx.measureText(flagLine + fw + ' ').width > w - 80) {
            ctx.fillText(flagLine.trim(), 40, fy); flagLine = '       ' + fw + ' '; fy += 22
          } else { flagLine += fw + ' ' }
        }
        if (flagLine.trim()) { ctx.fillText(flagLine.trim(), 40, fy); fy += 26 }
      }
    }

    // Positives
    fy += 20
    ctx.fillStyle = '#10b981'
    ctx.font = 'bold 14px Inter, sans-serif'
    ctx.fillText('WHAT LOOKS OK', 40, fy)
    fy += 28
    ctx.fillStyle = '#a7f3d0'
    ctx.font = '400 13px Inter, sans-serif'
    for (const pos of (result.positives || []).slice(0, 4)) {
      ctx.fillText(`   •  ${pos}`, 40, fy)
      fy += 24
    }

    // Tip
    if (result.tip) {
      fy += 20
      ctx.fillStyle = '#a5b4fc'
      ctx.font = 'bold 14px Inter, sans-serif'
      ctx.fillText('SAFETY TIP', 40, fy)
      fy += 24
      ctx.fillStyle = '#94a3b8'
      ctx.font = '400 13px Inter, sans-serif'
      const tipWords = result.tip.split(' ')
      let tipLine = ''
      for (const tw of tipWords) {
        if (ctx.measureText(tipLine + tw + ' ').width > w - 80) {
          ctx.fillText(tipLine.trim(), 40, fy); tipLine = tw + ' '; fy += 22
        } else { tipLine += tw + ' ' }
      }
      if (tipLine.trim()) ctx.fillText(tipLine.trim(), 40, fy)
    }

    // Footer watermark
    ctx.fillStyle = '#334155'
    ctx.font = '500 11px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Analyzed by TruthGuard — AI-Powered Fake News & Job Scam Detector', w / 2, h - 30)

    // Bottom gradient bar
    ctx.fillStyle = hGrad
    ctx.fillRect(0, h - 6, w, 6)

    // Download
    canvas.toBlob((blob) => {
      if (!blob) return
      if (navigator.share && navigator.canShare) {
        const file = new File([blob], 'truthguard-report.png', { type: 'image/png' })
        navigator.share({ title: 'TruthGuard Analysis Report', text: `Verdict: ${result.verdict} | Trust Score: ${result.trust_score}/100`, files: [file] }).catch(() => {
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'truthguard-report.png'; a.click(); URL.revokeObjectURL(url)
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a'); a.href = url; a.download = 'truthguard-report.png'; a.click(); URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }

  const handleTestPattern = (pattern) => {
    setMode(pattern.category)
    setText(pattern.example.replace(/^"|"$/g, ''))
    setResult(null)
    setError(null)
    setAnalyzedText('')
    setSelectedFlagIndex(null)
    setChatOpen(false)
    setChatMessages([])
    setTimeout(() => {
      const inputEl = document.getElementById('content-input')
      if (inputEl) { inputEl.focus(); inputEl.scrollIntoView({ behavior: 'smooth', block: 'center' }) }
    }, 100)
  }

  const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const renderHighlightedText = (content, redFlags, activeIndex) => {
    const safeText = (content || '').toString()
    if (!safeText) return null
    if (activeIndex === null || activeIndex === undefined) {
      return safeText
    }
    const active = redFlags?.[activeIndex]
    const snippet = (typeof active === 'string' ? active : active?.snippet) || ''
    if (!snippet || !safeText.includes(snippet)) {
      return safeText
    }

    const regex = new RegExp(`(${escapeRegExp(snippet)})`, 'g')
    const parts = safeText.split(regex)
    return parts.map((part, idx) => {
      if (part === snippet) {
        return (
          <mark key={idx} className="holographic-highlight">
            {part}
          </mark>
        )
      }
      return <span key={idx}>{part}</span>
    })
  }

  return (
    <>
    {/* Full-screen splash loader while backend wakes up */}
    {!apiReady && (
      <div className="splash-screen">
        <div className="splash-content">
          <div className="splash-logo">
            <ShieldIcon />
          </div>
          <h2 className="splash-title">TruthGuard</h2>
          <div className="splash-loader">
            <div className="splash-loader-bar"></div>
          </div>
          <p className="splash-status">Initializing AI Engine...</p>
          <p className="splash-sub">This may take 20-30 seconds on first visit</p>
        </div>
      </div>
    )}

    <div className="app">
      {/* Ambient Blobs */}
      <div className="ambient-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="brand-icon">
            <ShieldIcon />
          </div>
          <div>
            <div className="brand-name">TruthGuard</div>
            <div className="brand-tagline">AI-Powered Detection</div>
          </div>
        </div>
        {!isStandalone && (
          <button className="install-app-btn" onClick={async () => {
            if (deferredPrompt) {
              deferredPrompt.prompt()
              const { outcome } = await deferredPrompt.userChoice
              if (outcome === 'accepted') setDeferredPrompt(null)
            } else {
              setShowInstallGuide(true)
            }
          }}>
            <DownloadIcon />
            &nbsp;&nbsp;Install App
          </button>
        )}
      </nav>

      {/* Install Guide Modal */}
      {showInstallGuide && (
        <div className="install-overlay" onClick={() => setShowInstallGuide(false)}>
          <div className="install-modal" onClick={(e) => e.stopPropagation()}>
            <button className="install-modal-close" onClick={() => setShowInstallGuide(false)}>
              <RemoveIcon />
            </button>
            <div className="install-modal-icon">
              <DownloadIcon />
            </div>
            <h3>Install TruthGuard</h3>
            <p className="install-modal-subtitle">Add TruthGuard to your home screen for instant access like a native app</p>
            
            {isIOS ? (
              <div className="install-steps">
                <div className="install-step">
                  <div className="install-step-number">1</div>
                  <div className="install-step-content">
                    <strong>Tap the Share button</strong>
                    <p>Tap the <span className="install-share-icon">&#x2191;&#x25A1;</span> share icon at the bottom of Safari</p>
                  </div>
                </div>
                <div className="install-step">
                  <div className="install-step-number">2</div>
                  <div className="install-step-content">
                    <strong>Scroll down and tap "Add to Home Screen"</strong>
                    <p>Find the option with a + icon in the share menu</p>
                  </div>
                </div>
                <div className="install-step">
                  <div className="install-step-number">3</div>
                  <div className="install-step-content">
                    <strong>Tap "Add" to confirm</strong>
                    <p>TruthGuard will appear on your home screen!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="install-steps">
                <div className="install-step">
                  <div className="install-step-number">1</div>
                  <div className="install-step-content">
                    <strong>Open browser menu</strong>
                    <p>Tap the three-dot menu ( &#x22EE; ) in the top right of your browser</p>
                  </div>
                </div>
                <div className="install-step">
                  <div className="install-step-number">2</div>
                  <div className="install-step-content">
                    <strong>Tap "Install app" or "Add to Home Screen"</strong>
                    <p>Look for the install option with a download or + icon</p>
                  </div>
                </div>
                <div className="install-step">
                  <div className="install-step-number">3</div>
                  <div className="install-step-content">
                    <strong>Confirm installation</strong>
                    <p>TruthGuard opens as a standalone app — no browser bar!</p>
                  </div>
                </div>
              </div>
            )}
            <button className="install-modal-done-btn" onClick={() => setShowInstallGuide(false)}>Got it!</button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          AI Detection Active
        </div>
        <h1>
          Detect <span className="gradient-text">Fake News</span> &<br />
          <span className="gradient-text">Job Scams</span> Instantly
        </h1>
        <p className="hero-subtitle">
          Paste any news article or job posting in English, Hindi, Gujarati, or other languages. 
          Our AI analyzes it in seconds and gives you a detailed trust score with specific red flags.
        </p>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value">98%</div>
            <div className="stat-label">Detection Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Under 3s</div>
            <div className="stat-label">Analysis Time</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">Free</div>
            <div className="stat-label">Always Free</div>
          </div>
        </div>
      </section>

      {/* Cyber Threat Intelligence Feed */}
      <section className="threat-feed-section">
        <div className="threat-feed-header">
          <div className="threat-feed-header-left">
            <div className="threat-feed-title">
              <span className="live-pulse-dot"></span>
              Threat Intelligence Feed
            </div>
            <span className="threat-feed-subtitle">Active global scams & misinformation campaigns</span>
          </div>
          <button className="threat-refresh-btn" onClick={fetchThreats} title="Sync Live Feed">
            <RefreshIcon />
            <span>Sync Live</span>
          </button>
        </div>
        
        {threatsLoading ? (
          <div className="threats-slider-container">
            <div className="threats-grid-feed">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="threat-card skeleton">
                  <div className="threat-card-border-glow"></div>
                  <div className="threat-header">
                    <span className="skeleton-line severity"></span>
                    <span className="skeleton-line time"></span>
                  </div>
                  <div className="skeleton-line title"></div>
                  <div className="skeleton-line title short"></div>
                  <div className="skeleton-line desc" style={{ marginTop: '12px' }}></div>
                  <div className="skeleton-line desc"></div>
                  <div className="skeleton-line desc short"></div>
                  <div className="threat-footer">
                    <span className="skeleton-line type"></span>
                    <span className="skeleton-line button"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : threats.length > 0 ? (
          <div className="threats-slider-container">
            <div className="threats-grid-feed">
              {threats.map((threat) => (
                <div key={threat.id} className="threat-card" onClick={() => handleScanThreat(threat)}>
                  <div className="threat-card-border-glow"></div>
                  <div className="threat-header">
                    <span className={`severity-badge ${threat.severity.toLowerCase()}`}>
                      <span className="severity-dot"></span>
                      {threat.severity}
                    </span>
                    <span className="threat-time">{threat.timestamp}</span>
                  </div>
                  <h3 className="threat-title">{threat.title}</h3>
                  <p className="threat-description">{threat.description}</p>
                  <div className="threat-footer">
                    <span className="threat-type-badge">
                      {threat.type === 'news' ? 'News Alert' : 'Job Scam'}
                    </span>
                    <button className="threat-action-btn">
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="threats-empty">
            No active threat alerts reported today.
          </div>
        )}
      </section>

      {/* Analyzer */}
      <section className="analyzer-section">


        {/* Mode Toggle */}
        <div className="mode-toggle" role="group" aria-label="Analysis mode">
          <button
            id="mode-news"
            className={`mode-btn ${mode === 'news' ? 'active' : ''}`}
            onClick={() => { setMode('news'); setResult(null); setError(null); setAnalyzedText(''); setSelectedFlagIndex(null) }}
          >
            News Detector
          </button>
          <button
            id="mode-job"
            className={`mode-btn ${mode === 'job' ? 'active' : ''}`}
            onClick={() => { setMode('job'); setResult(null); setError(null); setAnalyzedText(''); setSelectedFlagIndex(null) }}
          >
            Job Scam Detector
          </button>
        </div>

        {/* Input Card */}
        <div className="input-card">
          <div className="input-card-inner-corner"></div>
          <div className="input-label">
            <span>{mode === 'news' ? 'News Article, Headline or Link' : 'Job Posting Text or Link'}</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <div className="language-badge-container">
                <span className="language-support-label">English, Hindi, Gujarati & more</span>
                <div className="languages-tooltip">
                  <h4>Supported Languages (30+)</h4>
                  <div className="tooltip-section">
                    <strong>Indian:</strong> Hindi, Gujarati, Marathi, Bengali, Tamil, Telugu, Kannada, Malayalam, Punjabi, Urdu, Assamese
                  </div>
                  <div className="tooltip-section">
                    <strong>Global:</strong> English, Spanish, French, German, Portuguese, Italian, Chinese, Japanese, Korean, Arabic
                  </div>
                  <div className="tooltip-note">AI automatically detects the language of text and images.</div>
                </div>
              </div>
              <span className="analysis-indicator-badge">AI Analyzed</span>
            </div>
          </div>
          <textarea
            id="content-input"
            className="text-input"
            placeholder={
              mode === 'news'
                ? 'Paste a news link, headline, article, or social media post here...\n\nExample: "https://example.com/fake-news-article" or "Scientists discover coffee cures all diseases!"'
                : 'Paste a job link, description, or offer text here...\n\nExample: "https://linkedin.com/jobs/..." or "Work from home! Earn ₹50,000/day. No experience needed..."'
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Content to analyze"
          />

          {isUrl(text) && (
            <div className="url-badge">
              <LinkIcon />
              Link detected! TruthGuard will fetch the content and analyze it.
            </div>
          )}

          {/* Screenshot Upload Dropzone */}
          <div className="media-upload-container">
            {!imagePreview ? (
              <div 
                className={`dropzone ${isDragOver ? 'drag-over' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="file-input" 
                  className="file-input-hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input" className="dropzone-label">
                  <CameraIcon />
                  <span>Drag & drop a screenshot or <strong className="browse-link">browse</strong></span>
                </label>
              </div>
            ) : (
              <div className="preview-container">
                <img src={imagePreview} alt="Screenshot preview" className="image-preview-thumbnail" />
                <button className="remove-image-btn" onClick={handleRemoveImage}>
                  <RemoveIcon />
                  Remove Screenshot
                </button>
              </div>
            )}
          </div>

          <div className="input-footer">
            <span className="char-count">
              {image ? "Screenshot attached" : `${text.length} characters`}
            </span>
            <button
              id="analyze-btn"
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={loading || (!text.trim() && !image)}
              aria-label="Analyze content"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>Analyze Now</>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner" role="alert">
            <AlertIcon />
            <span>{error}</span>
          </div>
        )}

        {/* Loading HUD Scanner */}
        {loading && (
          <div className="scanning-hud-card">
            <div className="input-card-inner-corner"></div>
            <div className="scanner-glow-circle">
              <div className="scanner-pulse-ring"></div>
              <div className="scanner-pulse-ring delay-1"></div>
              <div className="scanner-pulse-ring delay-2"></div>
              <ShieldIcon />
            </div>
            <h3 className="scanner-title">Securing Connection & Analyzing Claims</h3>
            <p className="scanner-subtitle">Cross-referencing live databases and verifying web records...</p>
            <div className="scanner-progress-bar-container">
              <div className="scanner-progress-bar-fill"></div>
            </div>
            <div className="scanner-status-log">
              <div className="log-line">[SYSTEM] Connecting to Groq AI Node...</div>
              <div className="log-line">[SEARCH] Extracting entity verification keys...</div>
              <div className="log-line">[VERIFY] Auditing Live DuckDuckGo indexes...</div>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="result-card" id="result-card">
            <div className="input-card-inner-corner"></div>
            <div className={`result-header ${getVerdictClass(result.verdict)}`}>
              <div className="verdict-badge">
                <div className={`verdict-icon ${getVerdictClass(result.verdict)}`}>
                  {renderVerdictIcon(result.verdict)}
                </div>
                <div className="verdict-text">
                  <h2 className={getVerdictClass(result.verdict)}>{result.verdict}</h2>
                  <p>
                    {result.category && `Category: ${result.category} • `}
                    {mode === 'news' ? 'News Analysis' : 'Job Post Analysis'}
                  </p>
                </div>
              </div>
              <div className="trust-score-container">
                <div className="trust-circle-wrap" style={{ '--score': result.trust_score, '--verdict-color': `var(--${getVerdictClass(result.verdict)}-color)` }}>
                  <div className="trust-circle-inner">
                    <div className={`trust-score-number ${getVerdictClass(result.verdict)}`}>
                      {result.trust_score}
                    </div>
                    <div className="trust-circle-label">Trust Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="result-body">
              {/* Web Verification Summary */}
              {searchSummary && (
                <div className="web-search-box">
                  <div className="web-search-header">
                    <span className="search-icon"><SearchIcon /></span>
                    <div className="search-header-text">
                      <h4>Live Web Verification</h4>
                      <p className="search-summary-text">{searchSummary}</p>
                    </div>
                    <span className={`search-badge ${searchResults && !searchResults.includes("No verified web records") ? "verified" : "unverified"}`}>
                      {searchResults && !searchResults.includes("No verified web records") ? "Web Record Found" : "Unverified"}
                    </span>
                  </div>
                  {searchResults && (
                    <p className="search-details-text">{searchResults}</p>
                  )}
                </div>
              )}

              {/* Explanation */}
              <div className="explanation-box">
                <p>{result.explanation}</p>
              </div>

              {/* Confidence Radar Chart */}
              {result.confidence_breakdown && (
                <RadarChart data={result.confidence_breakdown} verdictClass={getVerdictClass(result.verdict)} />
              )}

              {/* Red Flags & Positives */}
              <div className="flags-grid">
                <div className="flags-section red">
                  <h3>Red Flags</h3>
                  {result.red_flags?.length > 0 ? (
                    result.red_flags.map((flag, i) => {
                      const label = typeof flag === 'string' ? flag : flag?.flag
                      const hasSnippet = typeof flag === 'object' && flag?.snippet
                      const isActive = selectedFlagIndex === i
                      return (
                        <div
                          key={i}
                          className={`flag-item red ${hasSnippet ? 'clickable-flag' : ''} ${isActive ? 'active' : ''}`}
                          role={hasSnippet ? 'button' : undefined}
                          tabIndex={hasSnippet ? 0 : undefined}
                          onClick={hasSnippet ? () => setSelectedFlagIndex(isActive ? null : i) : undefined}
                          onKeyDown={hasSnippet ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedFlagIndex(isActive ? null : i)
                            }
                          } : undefined}
                          aria-label={hasSnippet ? `Highlight: ${label}` : undefined}
                        >
                          <span>•</span> {label}
                        </div>
                      )
                    })
                  ) : (
                    <div className="flag-item green">No major red flags found</div>
                  )}
                </div>
                <div className="flags-section green">
                  <h3>What Looks OK</h3>
                  {result.positives?.length > 0 ? (
                    result.positives.map((pos, i) => (
                      <div key={i} className="flag-item green">
                        <span>•</span> {pos}
                      </div>
                    ))
                  ) : (
                    <div className="flag-item red">Nothing credible found</div>
                  )}
                </div>
              </div>

              {/* Safety Tip */}
              {result.tip && (
                <div className="tip-box">
                  <LightbulbIcon />
                  <div>
                    <h4>Safety Tip</h4>
                    <p>{result.tip}</p>
                  </div>
                </div>
              )}

              {/* Analyzed Content Explorer */}
              {analyzedText && (
                <div className="content-explorer-box">
                  <div className="content-explorer-header">
                    <h4>Analyzed Content Explorer</h4>
                    <p>Click a red flag to highlight the matching snippet in the analyzed text.</p>
                  </div>
                  <div className="content-explorer-body">
                    {renderHighlightedText(analyzedText, result.red_flags || [], selectedFlagIndex)}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="result-actions">
              <button id="copy-btn" className="action-btn" onClick={handleCopyResult}>
                <CopyIcon />
                &nbsp;&nbsp;{copied ? 'Copied!' : 'Copy Report'}
              </button>
              <button id="share-btn" className="action-btn share-btn" onClick={generateReportCard}>
                <ShareIcon />
                &nbsp;&nbsp;Share Report
              </button>
              <button id="chat-toggle-btn" className={`action-btn chat-toggle-btn ${chatOpen ? 'active' : ''}`} onClick={() => setChatOpen(!chatOpen)}>
                <ChatIcon />
                &nbsp;&nbsp;{chatOpen ? 'Close Chat' : 'Ask AI'}
              </button>
              <button id="analyze-another-btn" className="action-btn" onClick={handleReset}>
                <RefreshIcon />
                &nbsp;&nbsp;Analyze Another
              </button>
            </div>
          </div>
        )}

        {/* AI Follow-Up Chat Panel */}
        {result && chatOpen && (
          <div className="chat-panel" id="chat-panel">
            <div className="input-card-inner-corner"></div>
            <div className="chat-panel-header">
              <div className="chat-panel-header-left">
                <ChatIcon />
                <h4>Ask TruthGuard AI</h4>
              </div>
              <span className="chat-panel-badge">Context-Aware</span>
            </div>
            {chatMessages.length === 0 && (
              <div className="chat-suggestions">
                <p className="chat-suggestions-label">Quick questions:</p>
                <div className="chat-chips">
                  <button className="suggestion-chip" onClick={() => handleSendChat('Is this safe to share with others?')}>Is this safe to share?</button>
                  <button className="suggestion-chip" onClick={() => handleSendChat('What should I do next?')}>What should I do next?</button>
                  <button className="suggestion-chip" onClick={() => handleSendChat('How can I verify this independently?')}>How to verify this?</button>
                  <button className="suggestion-chip" onClick={() => handleSendChat('Can you explain the red flags in simple terms?')}>Explain red flags simply</button>
                </div>
              </div>
            )}
            <div className="chat-messages">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role}`}>
                  <span className="chat-bubble-role">{msg.role === 'user' ? 'You' : 'TruthGuard AI'}</span>
                  <p>{msg.text}</p>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-bubble ai">
                  <span className="chat-bubble-role">TruthGuard AI</span>
                  <div className="chat-typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                className="chat-input"
                placeholder="Ask a follow-up question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSendChat() }}
                disabled={chatLoading}
              />
              <button className="chat-send-btn" onClick={() => handleSendChat()} disabled={chatLoading || !chatInput.trim()}>
                <SendIcon />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* History */}
      {history.length > 0 && (
        <section className="history-section">
          <div className="history-title">
            Recent Analyses
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', marginLeft: '12px' }}>Click item to re-analyze</span>
          </div>
          <div className="history-grid">
            {history.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => handleHistoryClick(item)}
                role="button"
                tabIndex={0}
                aria-label={`History: ${item.verdict} - ${item.text}`}
              >
                <div className="history-item-header">
                  <span className={`history-verdict ${getVerdictClass(item.verdict)}`}>
                    {item.verdict}
                  </span>
                  <span className="history-score">{item.trust_score}/100</span>
                </div>
                <div className="history-text">{item.text}...</div>
                <div className="history-date">
                  {item.type === 'news' ? '[News]' : '[Job]'} {item.date}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="how-section">
        <h2>How It Works</h2>
        <p>Three simple steps to protect yourself from misinformation and scams</p>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Paste Content</h3>
            <p>Copy any news article, headline, or job posting text and paste it into the analyzer</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Analyzes</h3>
            <p>Groq + Llama 3.3 and Llama 4 Vision AI check for red flags and search live records</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Get Your Report</h3>
            <p>Receive a detailed trust score with specific red flags and verified search context</p>
          </div>
        </div>
      </section>

      {/* Scam Pattern Education Hub */}
      <section className="education-hub" id="education-hub">
        <div className="education-hub-header">
          <h2>Scam Pattern Library</h2>
          <p>Learn to recognize the top 10 most common scam and fake news patterns. Click "Test This" to analyze the sample.</p>
        </div>
        <div className="patterns-grid">
          {SCAM_PATTERNS.map((pattern) => (
            <div key={pattern.id} className="pattern-card">
              <div className="threat-card-border-glow"></div>
              <div className="pattern-card-header">
                <span className="pattern-number">#{pattern.id}</span>
                <span className={`severity-badge ${pattern.severity.toLowerCase()}`}>
                  <span className="severity-dot"></span>
                  {pattern.severity}
                </span>
              </div>
              <h3 className="pattern-name">{pattern.name}</h3>
              <p className="pattern-description">{pattern.description}</p>
              <div className="pattern-example">
                <span className="pattern-example-label">Example:</span>
                <p>{pattern.example}</p>
              </div>
              <div className="pattern-tip">
                <LightbulbIcon />
                <span>{pattern.tips}</span>
              </div>
              <button className="test-pattern-btn" onClick={() => handleTestPattern(pattern)}>
                <SearchIcon size={14} />
                &nbsp;Test This Pattern
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p style={{ fontSize: '12px' }}>© 2026 TruthGuard. All rights reserved.</p>
      </footer>
    </div>
    </>
  )
}

export default App

