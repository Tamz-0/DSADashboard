import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

const tokens = {
  dark: {
    bg: '#080809',
    bgCard: '#0f0f11',
    bgGlass: 'rgba(255,255,255,0.025)',
    bgGlassHover: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.06)',
    borderStrong: 'rgba(255,255,255,0.12)',
    borderAccent: 'rgba(124,106,247,0.3)',
    text: '#e2e2e6',
    textMuted: '#5a5a68',
    textFaint: '#2a2a38',
    accent: '#7c6af7',
    accentGlow: 'rgba(124,106,247,0.12)',
    easy: '#22d492',
    easyBg: 'rgba(34,212,146,0.08)',
    medium: '#f5a623',
    mediumBg: 'rgba(245,166,35,0.08)',
    hard: '#f04f4f',
    hardBg: 'rgba(240,79,79,0.08)',
    codeBg: '#070709',
    shadow: '0 1px 2px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
    shadowHover: '0 2px 8px rgba(0,0,0,0.7), 0 16px 40px rgba(0,0,0,0.5)',
  },
  light: {
    bg: '#f0ede8',
    bgCard: '#ffffff',
    bgGlass: 'rgba(0,0,0,0.02)',
    bgGlassHover: 'rgba(0,0,0,0.04)',
    border: 'rgba(0,0,0,0.06)',
    borderStrong: 'rgba(0,0,0,0.12)',
    borderAccent: 'rgba(91,77,221,0.25)',
    text: '#18181c',
    textMuted: '#868692',
    textFaint: '#c4c4cc',
    accent: '#5b4ddd',
    accentGlow: 'rgba(91,77,221,0.08)',
    easy: '#129960',
    easyBg: 'rgba(18,153,96,0.08)',
    medium: '#b8720a',
    mediumBg: 'rgba(184,114,10,0.08)',
    hard: '#c42828',
    hardBg: 'rgba(196,40,40,0.08)',
    codeBg: '#f4f1ec',
    shadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)',
    shadowHover: '0 2px 8px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)',
  }
}

const TOPIC_MAP = {
  'Arrays': ['two-sum','contains-duplicate','product-of-array','maximum-subarray','maximum-product-subarray','maximum-absolute-sum','find-all-numbers-disappeared','move-zeroes','remove-element','subarray-sum-equals-k','subarray-sums-divisible','sum-multiples','replace-elements','how-many-numbers-are-smaller','divide-an-array-into-subarrays','sign-of-the-product','xor-operation','trionic'],
  'Two Pointers': ['two-sum-ii','three-sum','container-with-most-water','valid-palindrome','trapping-rain-water'],
  'Sliding Window': ['maximum-subarray','first-unique-character'],
  'Binary Search': ['binary-search','find-peak-element','find-smallest-letter'],
  'Hashing': ['group-anagrams','valid-anagram','first-unique-character','subarray-sum-equals-k','two-sum'],
  'Linked List': ['remove-duplicates-from-sorted-list','palindrome-linked-list'],
  'Trees': ['validate-binary-search-tree','lowest-common-ancestor'],
  'Dynamic Programming': ['climbing-stairs','unique-paths','maximum-subarray','maximum-product-subarray'],
  'Math': ['reverse-integer','palindrome-number','add-digits','missing-number','number-of-1-bits','find-pivot-index','minimum-time-visiting-all-points'],
  'Stack': ['valid-parentheses','basic-calculator'],
  'Matrix': ['spiral-matrix'],
  'Strings': ['longest-common-prefix','valid-anagram','first-unique-character','to-lower-case','first-letter-to-appear-twice','valid-palindrome','counter'],
  'Greedy': ['number-of-students-unable-to-eat-lunch','time-needed-to-buy-tickets','maximum-count-of-positive-integer','find-if-digit-game'],
  'Prefix Sum': ['find-pivot-index','subarray-sum-equals-k','subarray-sums-divisible','product-of-array'],
  'Bit Manipulation': ['number-of-1-bits','xor-operation','missing-number'],
}

function getTopicForSlug(slug) {
  for (const [topic, slugs] of Object.entries(TOPIC_MAP)) {
    if (slugs.some(s => slug.includes(s))) return topic
  }
  return 'Miscellaneous'
}

const LANG_META = {
  cpp:  { label: 'C++',        color: '#60a5fa', bg: 'rgba(96,165,250,0.09)' },
  java: { label: 'Java',       color: '#fb923c', bg: 'rgba(251,146,60,0.09)' },
  py:   { label: 'Python',     color: '#4ade80', bg: 'rgba(74,222,128,0.09)' },
  js:   { label: 'JavaScript', color: '#facc15', bg: 'rgba(250,204,21,0.08)' },
  ts:   { label: 'TypeScript', color: '#818cf8', bg: 'rgba(129,140,248,0.09)' },
  c:    { label: 'C',          color: '#94a3b8', bg: 'rgba(148,163,184,0.09)' },
}

function langLabel(ext) { return LANG_META[ext]?.label || ext.toUpperCase() }
function langHL(ext) { return { cpp:'cpp', java:'java', js:'javascript', py:'python', ts:'typescript', c:'c' }[ext] || 'text' }
function langColor(ext) { return LANG_META[ext]?.color || 'var(--text-muted)' }
function langBg(ext) { return LANG_META[ext]?.bg || 'var(--bg-glass)' }

function diffColor(d) {
  const l = (d || '').toLowerCase()
  if (l === 'easy') return 'var(--easy)'
  if (l === 'medium') return 'var(--medium)'
  if (l === 'hard') return 'var(--hard)'
  return 'var(--text-muted)'
}
function diffBg(d) {
  const l = (d || '').toLowerCase()
  if (l === 'easy') return 'var(--easy-bg)'
  if (l === 'medium') return 'var(--medium-bg)'
  if (l === 'hard') return 'var(--hard-bg)'
  return 'transparent'
}

const darkCodeTheme = {
  'code[class*="language-"]': { color: '#c9d1d9', background: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', lineHeight: '1.75' },
  'comment': { color: '#3d4050', fontStyle: 'italic' },
  'keyword': { color: '#a78bfa' }, 'string': { color: '#6ee7b7' }, 'number': { color: '#fcd34d' },
  'function': { color: '#93c5fd' }, 'class-name': { color: '#5eead4' }, 'operator': { color: '#94a3b8' },
  'punctuation': { color: '#475569' }, 'boolean': { color: '#f87171' }, 'builtin': { color: '#fcd34d' },
}
const lightCodeTheme = {
  'code[class*="language-"]': { color: '#2d333b', background: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: '13px', lineHeight: '1.75' },
  'comment': { color: '#a0a8b0', fontStyle: 'italic' },
  'keyword': { color: '#7c3aed' }, 'string': { color: '#065f46' }, 'number': { color: '#92400e' },
  'function': { color: '#1d4ed8' }, 'class-name': { color: '#0f766e' }, 'operator': { color: '#64748b' },
  'punctuation': { color: '#94a3b8' }, 'boolean': { color: '#b91c1c' }, 'builtin': { color: '#92400e' },
}

function parseShas(stats) {
  const shas = stats?.leetcode?.shas || {}
  const problems = []
  for (const [slug, data] of Object.entries(shas)) {
    if (typeof data !== 'object' || !data.difficulty) continue
    const idMatch = slug.match(/^(\d+)/)
    if (!idMatch) continue
    const id = parseInt(idMatch[1], 10)
    const title = slug.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const langs = Object.keys(data).filter(k => !['README.md','difficulty',''].includes(k)).map(k => k.split('.').pop())
    const topic = getTopicForSlug(slug)
    problems.push({ id, slug, title, difficulty: data.difficulty, langs, topic })
  }
  return problems.sort((a, b) => a.id - b.id)
}

function GlobalStyles({ t }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Outfit:wght@300;400;500;600;700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg:${t.bg}; --bg-card:${t.bgCard}; --bg-glass:${t.bgGlass}; --bg-glass-hover:${t.bgGlassHover};
        --border:${t.border}; --border-strong:${t.borderStrong}; --border-accent:${t.borderAccent};
        --text:${t.text}; --text-muted:${t.textMuted}; --text-faint:${t.textFaint};
        --accent:${t.accent}; --accent-glow:${t.accentGlow};
        --easy:${t.easy}; --easy-bg:${t.easyBg}; --medium:${t.medium}; --medium-bg:${t.mediumBg};
        --hard:${t.hard}; --hard-bg:${t.hardBg}; --code-bg:${t.codeBg};
        --shadow:${t.shadow}; --shadow-hover:${t.shadowHover};
      }
      html, body { background:var(--bg); color:var(--text); font-family:'Outfit',system-ui,sans-serif; min-height:100vh; -webkit-font-smoothing:antialiased; }
      #root { min-height:100vh; }
      ::selection { background:var(--accent-glow); color:var(--accent); }
      ::-webkit-scrollbar { width:4px; height:4px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:99px; }
      a { color:inherit; text-decoration:none; }

      @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      @keyframes scaleIn { from{opacity:0;transform:scale(0.97)} to{opacity:1;transform:scale(1)} }
      @keyframes barGrow { from{width:0} to{width:var(--bar-w)} }

      .fade-up { animation:fadeUp 0.35s cubic-bezier(0.16,1,0.3,1) both; }
      .fade-in { animation:fadeIn 0.25s ease both; }

      .problem-card {
        background:var(--bg-card); border:1px solid var(--border); border-radius:14px;
        padding:18px 22px; cursor:pointer;
        transition:transform 0.2s cubic-bezier(0.16,1,0.3,1),box-shadow 0.2s cubic-bezier(0.16,1,0.3,1),border-color 0.2s ease;
        box-shadow:var(--shadow); position:relative; overflow:hidden;
      }
      .problem-card::after {
        content:''; position:absolute; inset:0;
        background:radial-gradient(ellipse at 20% 50%, var(--accent-glow) 0%, transparent 70%);
        opacity:0; transition:opacity 0.3s ease; pointer-events:none;
      }
      .problem-card:hover { transform:translateY(-1px); box-shadow:var(--shadow-hover); border-color:var(--border-strong); }
      .problem-card:hover::after { opacity:1; }
      .problem-card.bookmarked::before {
        content:''; position:absolute; top:0; left:0;
        width:3px; height:100%; background:var(--accent); border-radius:14px 0 0 14px;
      }

      .skeleton {
        background:linear-gradient(90deg, var(--border) 25%, var(--border-strong) 50%, var(--border) 75%);
        background-size:200% 100%; animation:shimmer 1.4s infinite; border-radius:5px;
      }

      .tab-btn {
        padding:6px 14px; border-radius:7px; font-size:12px; font-weight:500;
        font-family:'JetBrains Mono',monospace; cursor:pointer; border:1px solid transparent;
        transition:all 0.15s ease; letter-spacing:0.01em;
      }
      .tab-btn.active { background:var(--accent); color:#fff; border-color:var(--accent); }
      .tab-btn:not(.active) { background:var(--bg-glass); color:var(--text-muted); border-color:var(--border); }
      .tab-btn:not(.active):hover { border-color:var(--border-strong); color:var(--text); background:var(--bg-glass-hover); }

      .icon-btn {
        width:34px; height:34px; border-radius:9px; border:1px solid var(--border);
        background:var(--bg-glass); cursor:pointer; display:flex; align-items:center;
        justify-content:center; color:var(--text-muted); transition:all 0.15s ease;
      }
      .icon-btn:hover { border-color:var(--border-strong); color:var(--text); background:var(--bg-glass-hover); }
      .icon-btn.active { background:var(--accent-glow); border-color:var(--border-accent); color:var(--accent); }

      .filter-btn {
        padding:7px 13px; border-radius:8px; font-size:12px; font-weight:500;
        cursor:pointer; border:1px solid var(--border); background:var(--bg-glass);
        color:var(--text-muted); transition:all 0.15s ease; white-space:nowrap;
      }
      .filter-btn.active-easy { background:var(--easy-bg); color:var(--easy); border-color:var(--easy); }
      .filter-btn.active-medium { background:var(--medium-bg); color:var(--medium); border-color:var(--medium); }
      .filter-btn.active-hard { background:var(--hard-bg); color:var(--hard); border-color:var(--hard); }
      .filter-btn.active-all { background:var(--accent-glow); color:var(--accent); border-color:var(--accent); }
      .filter-btn.active-bookmarked { background:var(--accent-glow); color:var(--accent); border-color:var(--accent); }
      .filter-btn:hover:not([class*="active-"]) { border-color:var(--border-strong); color:var(--text); }

      .back-btn {
        display:inline-flex; align-items:center; gap:6px; padding:6px 12px;
        border-radius:8px; border:1px solid var(--border); background:var(--bg-glass);
        color:var(--text-muted); font-size:13px; font-weight:500; cursor:pointer; transition:all 0.15s ease;
      }
      .back-btn:hover { border-color:var(--border-strong); color:var(--text); background:var(--bg-glass-hover); }

      .search-input {
        width:100%; padding:9px 16px 9px 38px; background:var(--bg-card);
        border:1px solid var(--border); border-radius:10px; color:var(--text);
        font-family:'Outfit',sans-serif; font-size:14px; outline:none;
        transition:border-color 0.15s, box-shadow 0.15s;
      }
      .search-input::placeholder { color:var(--text-muted); }
      .search-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); }

      .problem-readme h1,.problem-readme h2,.problem-readme h3 {
        font-family:'Outfit',sans-serif; color:var(--text); margin-top:1.5em; margin-bottom:0.5em; line-height:1.3;
      }
      .problem-readme h1{font-size:20px;font-weight:700}
      .problem-readme h2{font-size:16px;font-weight:600}
      .problem-readme h3{font-size:14px;font-weight:600}
      .problem-readme p{color:var(--text);line-height:1.8;margin-bottom:1em;font-size:14px}
      .problem-readme a{color:var(--accent)}
      .problem-readme a:hover{text-decoration:underline}
      .problem-readme code{font-family:'JetBrains Mono',monospace;font-size:12px;background:var(--code-bg);border:1px solid var(--border);padding:1px 5px;border-radius:4px;color:var(--accent)}
      .problem-readme pre{background:var(--code-bg);border:1px solid var(--border);border-radius:10px;padding:14px;overflow-x:auto;margin-bottom:1em}
      .problem-readme pre code{background:none;border:none;padding:0;color:var(--text);font-size:12px}
      .problem-readme ul,.problem-readme ol{padding-left:1.5em;margin-bottom:1em;font-size:14px;line-height:1.8;color:var(--text)}
      .problem-readme strong{color:var(--text);font-weight:600}
      .problem-readme em{color:var(--text-muted)}
      .problem-readme hr{border:none;border-top:1px solid var(--border);margin:1.5em 0}
      .problem-readme table{width:100%;border-collapse:collapse;margin-bottom:1em;font-size:13px}
      .problem-readme th{background:var(--bg-glass);padding:8px 12px;text-align:left;border:1px solid var(--border);font-weight:600}
      .problem-readme td{padding:8px 12px;border:1px solid var(--border)}

      .cmd-overlay {
        position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);
        -webkit-backdrop-filter:blur(8px);z-index:999;display:flex;align-items:flex-start;
        justify-content:center;padding-top:15vh;animation:fadeIn 0.15s ease;
      }
      .cmd-box {
        width:560px;max-width:calc(100vw - 32px);background:var(--bg-card);
        border:1px solid var(--border-strong);border-radius:16px;overflow:hidden;
        box-shadow:0 24px 64px rgba(0,0,0,0.6);animation:scaleIn 0.2s cubic-bezier(0.16,1,0.3,1);
      }
      .cmd-row{padding:10px 16px;display:flex;align-items:center;gap:10px;cursor:pointer;transition:background 0.1s}
      .cmd-row:hover,.cmd-row.sel{background:var(--bg-glass-hover)}

      .topic-chip {
        display:inline-flex;align-items:center;padding:3px 9px;border-radius:5px;
        font-size:10px;font-weight:600;background:var(--accent-glow);color:var(--accent);
        border:1px solid var(--border-accent);font-family:'JetBrains Mono',monospace;
        letter-spacing:0.02em;white-space:nowrap;
      }

      .nav-tab {
        padding:8px 16px;font-size:13px;font-weight:500;cursor:pointer;
        background:none;border:none;border-bottom:2px solid transparent;
        transition:all 0.15s;margin-bottom:-1px;
      }

      .stat-block { background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:18px 20px; }
      .stat-block-title {
        font-size:10px;font-weight:600;color:var(--text-muted);text-transform:uppercase;
        letter-spacing:0.09em;font-family:'JetBrains Mono',monospace;
        margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border);
      }

      .abar { height:100%;border-radius:99px;animation:barGrow 0.7s cubic-bezier(0.16,1,0.3,1) both;animation-delay:var(--d,0ms);width:var(--w); }
      .list-card { padding:12px 18px!important;border-radius:10px!important; }
    `}</style>
  )
}

function Bar({ pct, color, delay = 0 }) {
  return (
    <div style={{ flex:1, height:5, borderRadius:99, background:'var(--bg-glass)', overflow:'hidden' }}>
      <div className="abar" style={{ '--w':`${pct}%`, '--d':`${delay}ms`, background:color }} />
    </div>
  )
}

function Navbar({ theme, toggleTheme, stats, onCmdOpen }) {
  return (
    <nav style={{ position:'sticky', top:0, zIndex:100, background:theme==='dark'?'rgba(8,8,9,0.88)':'rgba(240,237,232,0.88)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1240, margin:'0 auto', padding:'0 24px', height:58, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5L4.5 9.5L11.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:15, letterSpacing:'-0.01em' }}>DSA Playground</span>
        </Link>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          {stats && (
            <div style={{ display:'flex', gap:5 }}>
              {[['E', stats.leetcode?.easy||0, 'var(--easy)'], ['M', stats.leetcode?.medium||0, 'var(--medium)'], ['H', stats.leetcode?.hard||0, 'var(--hard)']].map(([l,v,c]) => (
                <div key={l} style={{ display:'flex', alignItems:'center', gap:3, padding:'3px 7px', borderRadius:5, background:'var(--bg-glass)', border:'1px solid var(--border)', fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'var(--text-muted)' }}>
                  <span style={{ color:c, fontWeight:600 }}>{l}</span><span>{v}</span>
                </div>
              ))}
            </div>
          )}
          <button className="icon-btn" onClick={onCmdOpen} title="⌘K">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="7.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="1.5" y="7.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/><rect x="7.5" y="7.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
          <button className="icon-btn" onClick={toggleTheme}>
            {theme==='dark'
              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2.8" stroke="currentColor" strokeWidth="1.3"/><path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M12 7.4A5 5 0 1 1 6.6 2a3.8 3.8 0 0 0 5.4 5.4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
            }
          </button>
        </div>
      </div>
    </nav>
  )
}

function CommandPalette({ problems, onClose }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const navigate = useNavigate()
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus() }, [])
  const results = q.trim()
    ? problems.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || String(p.id).includes(q) || p.topic.toLowerCase().includes(q.toLowerCase())).slice(0,8)
    : problems.slice(0,8)
  useEffect(() => { setSel(0) }, [q])
  function go(p) { navigate(`/problem/${p.slug}`); onClose() }
  function onKey(e) {
    if (e.key==='Escape') onClose()
    if (e.key==='ArrowDown') setSel(s=>Math.min(s+1,results.length-1))
    if (e.key==='ArrowUp') setSel(s=>Math.max(s-1,0))
    if (e.key==='Enter' && results[sel]) go(results[sel])
  }
  return (
    <div className="cmd-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="cmd-box">
        <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color:'var(--text-muted)', flexShrink:0 }}><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onKey} placeholder="Search problems, topics..." style={{ flex:1, background:'none', border:'none', outline:'none', color:'var(--text)', fontSize:14, fontFamily:'Outfit,sans-serif' }} />
          <kbd style={{ padding:'2px 6px', borderRadius:4, border:'1px solid var(--border)', fontSize:10, color:'var(--text-muted)', fontFamily:'JetBrains Mono,monospace' }}>ESC</kbd>
        </div>
        <div style={{ maxHeight:360, overflowY:'auto' }}>
          {results.map((p,i) => (
            <div key={p.slug} className={`cmd-row${i===sel?' sel':''}`} onClick={()=>go(p)}>
              <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'var(--text-faint)', width:36, flexShrink:0 }}>#{String(p.id).padStart(4,'0')}</span>
              <span style={{ flex:1, fontSize:13 }}>{p.title}</span>
              <span className="topic-chip">{p.topic}</span>
              <span style={{ fontSize:11, fontWeight:600, color:diffColor(p.difficulty), background:diffBg(p.difficulty), padding:'2px 7px', borderRadius:4 }}>{p.difficulty}</span>
            </div>
          ))}
          {!results.length && <div style={{ padding:'32px 16px', textAlign:'center', color:'var(--text-muted)', fontSize:13 }}>No problems found</div>}
        </div>
        <div style={{ padding:'8px 16px', borderTop:'1px solid var(--border)', display:'flex', gap:12, fontSize:11, color:'var(--text-muted)', fontFamily:'JetBrains Mono,monospace' }}>
          <span>↑↓ navigate</span><span>↵ open</span><span>esc close</span>
        </div>
      </div>
    </div>
  )
}

function DonutChart({ easy, medium, hard }) {
  const total = easy + medium + hard
  if (!total) return null
  const r = 38, circ = 2 * Math.PI * r
  const eLen = (easy/total)*circ, mLen = (medium/total)*circ, hLen = (hard/total)*circ
  return (
    <svg width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="10"/>
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--easy)" strokeWidth="10" strokeDasharray={`${eLen} ${circ-eLen}`} strokeDashoffset={circ*0.25}/>
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--medium)" strokeWidth="10" strokeDasharray={`${mLen} ${circ-mLen}`} strokeDashoffset={circ*0.25+circ-eLen}/>
      <circle cx="48" cy="48" r={r} fill="none" stroke="var(--hard)" strokeWidth="10" strokeDasharray={`${hLen} ${circ-hLen}`} strokeDashoffset={circ*0.25+circ-eLen-mLen}/>
      <text x="48" y="44" textAnchor="middle" fill="var(--text)" fontSize="16" fontWeight="700" fontFamily="Outfit,sans-serif">{total}</text>
      <text x="48" y="58" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="Outfit,sans-serif">total</text>
    </svg>
  )
}

function StatsPanel({ stats, problems, bookmarks }) {
  const total = problems.length
  const easy = problems.filter(p=>p.difficulty==='easy').length
  const medium = problems.filter(p=>p.difficulty==='medium').length
  const hard = problems.filter(p=>p.difficulty==='hard').length

  const langCounts = {}
  problems.forEach(p => p.langs.forEach(l => { langCounts[l]=(langCounts[l]||0)+1 }))
  const sortedLangs = Object.entries(langCounts).sort((a,b)=>b[1]-a[1])
  const maxLang = sortedLangs[0]?.[1]||1

  const topicCounts = {}
  problems.forEach(p => { topicCounts[p.topic]=(topicCounts[p.topic]||0)+1 })
  const sortedTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1])

  const topicDiff = {}
  problems.forEach(p => {
    if (!topicDiff[p.topic]) topicDiff[p.topic]={easy:0,medium:0,hard:0}
    topicDiff[p.topic][p.difficulty]=(topicDiff[p.topic][p.difficulty]||0)+1
  })

  const multiLang = problems.filter(p=>p.langs.length>=2)
  const triLang = problems.filter(p=>p.langs.length>=3)
  const avgLangs = total>0 ? (problems.reduce((s,p)=>s+p.langs.length,0)/total).toFixed(1) : 0
  const hardPct = total>0 ? Math.round((hard/total)*100) : 0

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))', gap:10 }}>
        {[
          { label:'Total Problems', value:total, color:'var(--accent)', sub:`${sortedLangs.length} languages` },
          { label:'Hard Problems', value:hard, color:'var(--hard)', sub:`${hardPct}% of archive` },
          { label:'Multi-Language', value:multiLang.length, color:'var(--medium)', sub:'solved in 2+ langs' },
          { label:'Bookmarked', value:bookmarks.size, color:'var(--easy)', sub:'saved for revision' },
        ].map(s => (
          <div key={s.label} style={{ padding:'14px 16px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:12 }}>
            <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:26, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'var(--text)', fontWeight:600, marginTop:5, textTransform:'uppercase', letterSpacing:'0.04em' }}>{s.label}</div>
            <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="stat-block">
        <div className="stat-block-title">Difficulty distribution</div>
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <DonutChart easy={easy} medium={medium} hard={hard}/>
          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
            {[['Easy',easy,'var(--easy)'],['Medium',medium,'var(--medium)'],['Hard',hard,'var(--hard)']].map(([l,v,c],i) => (
              <div key={l} style={{ display:'flex', flexDirection:'column', gap:5 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:12, color:c, fontWeight:600 }}>{l}</span>
                  <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'var(--text-muted)' }}>
                    {v}<span style={{ opacity:.45 }}> / {total}</span>
                  </span>
                </div>
                <Bar pct={total>0?(v/total)*100:0} color={c} delay={i*80}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="stat-block">
        <div className="stat-block-title">Language mastery</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {sortedLangs.map(([lang,count],i) => (
            <div key={lang} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:80, flexShrink:0, display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:7, height:7, borderRadius:'50%', background:langColor(lang), flexShrink:0 }}/>
                <span style={{ fontSize:12, fontWeight:600 }}>{langLabel(lang)}</span>
              </div>
              <Bar pct={(count/maxLang)*100} color={langColor(lang)} delay={i*60}/>
              <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'var(--text-muted)', width:26, textAlign:'right', flexShrink:0 }}>{count}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid var(--border)', display:'flex', gap:18, flexWrap:'wrap' }}>
          {[
            ['Avg langs / problem', avgLangs, 'var(--accent)'],
            ['Solved in 3+ langs', triLang.length, 'var(--medium)'],
            ['Unique languages', sortedLangs.length, 'var(--easy)'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ fontSize:12 }}>
              <span style={{ color:'var(--text-muted)' }}>{label}: </span>
              <span style={{ fontFamily:'JetBrains Mono,monospace', color, fontWeight:700 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stat-block">
        <div className="stat-block-title">Topic depth — difficulty mix per topic</div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {sortedTopics.map(([topic,count]) => {
            const d = topicDiff[topic]||{}
            return (
              <div key={topic} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:12, color:'var(--text-muted)', width:140, flexShrink:0, fontWeight:500 }}>{topic}</span>
                <div style={{ flex:1, display:'flex', height:6, borderRadius:99, overflow:'hidden', gap:1 }}>
                  {d.easy>0 && <div style={{ width:`${(d.easy/count)*100}%`, background:'var(--easy)', height:'100%' }}/>}
                  {d.medium>0 && <div style={{ width:`${(d.medium/count)*100}%`, background:'var(--medium)', height:'100%' }}/>}
                  {d.hard>0 && <div style={{ width:`${(d.hard/count)*100}%`, background:'var(--hard)', height:'100%' }}/>}
                </div>
                <div style={{ display:'flex', gap:3, flexShrink:0 }}>
                  {d.easy>0 && <span style={{ fontSize:9, padding:'1px 4px', borderRadius:3, background:'var(--easy-bg)', color:'var(--easy)', fontFamily:'JetBrains Mono,monospace' }}>{d.easy}E</span>}
                  {d.medium>0 && <span style={{ fontSize:9, padding:'1px 4px', borderRadius:3, background:'var(--medium-bg)', color:'var(--medium)', fontFamily:'JetBrains Mono,monospace' }}>{d.medium}M</span>}
                  {d.hard>0 && <span style={{ fontSize:9, padding:'1px 4px', borderRadius:3, background:'var(--hard-bg)', color:'var(--hard)', fontFamily:'JetBrains Mono,monospace' }}>{d.hard}H</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {multiLang.length>0 && (
        <div className="stat-block">
          <div className="stat-block-title">Cross-language solutions ({multiLang.length} problems)</div>
          <p style={{ fontSize:12, color:'var(--text-muted)', marginBottom:14, lineHeight:1.6 }}>Problems you've solved in 2 or more languages — shows genuine fluency</p>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {multiLang.slice(0,10).map(p => (
              <Link key={p.slug} to={`/problem/${p.slug}`} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:8, border:'1px solid var(--border)', background:'var(--bg-glass)', transition:'border-color 0.15s' }}>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'var(--text-faint)', width:36, flexShrink:0 }}>#{String(p.id).padStart(4,'0')}</span>
                <span style={{ flex:1, fontSize:13, fontWeight:500 }}>{p.title}</span>
                <span style={{ fontSize:11, fontWeight:600, color:diffColor(p.difficulty), background:diffBg(p.difficulty), padding:'2px 7px', borderRadius:4, textTransform:'capitalize', flexShrink:0 }}>{p.difficulty}</span>
                <div style={{ display:'flex', gap:4 }}>
                  {p.langs.map(l => (
                    <span key={l} style={{ fontSize:9, padding:'2px 6px', borderRadius:4, background:langBg(l), color:langColor(l), fontFamily:'JetBrains Mono,monospace', fontWeight:600 }}>{langLabel(l)}</span>
                  ))}
                </div>
              </Link>
            ))}
            {multiLang.length>10 && <div style={{ fontSize:11, color:'var(--text-muted)', paddingLeft:12, fontFamily:'JetBrains Mono,monospace' }}>+{multiLang.length-10} more</div>}
          </div>
        </div>
      )}

      {hard>0 && (
        <div className="stat-block">
          <div className="stat-block-title">Hard problems in the archive ({hard})</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {problems.filter(p=>p.difficulty==='hard').map(p => (
              <Link key={p.slug} to={`/problem/${p.slug}`} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 10px', borderRadius:7, background:'var(--hard-bg)', border:'1px solid var(--hard)', color:'var(--hard)', fontSize:12, fontWeight:500 }}>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, opacity:.6 }}>#{p.id}</span>{p.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="fade-in" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'18px 22px' }}>
      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
        <div className="skeleton" style={{ width:48, height:14 }}/>
        <div className="skeleton" style={{ width:40, height:14 }}/>
      </div>
      <div className="skeleton" style={{ width:'65%', height:17, marginBottom:12 }}/>
      <div style={{ display:'flex', gap:4 }}>
        <div className="skeleton" style={{ width:26, height:17 }}/>
        <div className="skeleton" style={{ width:26, height:17 }}/>
      </div>
    </div>
  )
}

function ProblemCard({ problem, index, viewMode, bookmarks, onToggleBookmark }) {
  const navigate = useNavigate()
  const isBookmarked = bookmarks.has(problem.slug)
  function sp(fn) { return (e)=>{ e.stopPropagation(); fn() } }

  if (viewMode==='list') {
    return (
      <div className={`problem-card list-card fade-in${isBookmarked?' bookmarked':''}`}
        style={{ animationDelay:`${Math.min(index*20,200)}ms`, display:'flex', alignItems:'center', gap:14 }}
        onClick={()=>navigate(`/problem/${problem.slug}`)}>
        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'var(--text-faint)', width:38, flexShrink:0 }}>#{String(problem.id).padStart(4,'0')}</span>
        <span style={{ fontSize:11, fontWeight:600, color:diffColor(problem.difficulty), background:diffBg(problem.difficulty), padding:'2px 7px', borderRadius:4, textTransform:'capitalize', width:56, textAlign:'center', flexShrink:0 }}>{problem.difficulty}</span>
        <span style={{ flex:1, fontFamily:'Outfit,sans-serif', fontWeight:500, fontSize:14 }}>{problem.title}</span>
        <span className="topic-chip">{problem.topic}</span>
        <div style={{ display:'flex', gap:4 }}>
          {problem.langs.map(l => (
            <span key={l} style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, fontWeight:600, color:langColor(l), background:langBg(l), border:`1px solid ${langColor(l)}30`, padding:'1px 5px', borderRadius:3 }}>{langLabel(l)}</span>
          ))}
        </div>
        <button onClick={sp(()=>onToggleBookmark(problem.slug))} className={`icon-btn${isBookmarked?' active':''}`} style={{ width:28, height:28, borderRadius:7, flexShrink:0 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill={isBookmarked?'currentColor':'none'}><path d="M2 1.5h7v9L5.5 8.5 2 10.5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
        </button>
      </div>
    )
  }

  return (
    <div className={`problem-card fade-up${isBookmarked?' bookmarked':''}`}
      style={{ animationDelay:`${Math.min(index*30,300)}ms` }}
      onClick={()=>navigate(`/problem/${problem.slug}`)}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:7, flexWrap:'wrap' }}>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'var(--text-faint)', fontWeight:500 }}>#{String(problem.id).padStart(4,'0')}</span>
            <span style={{ fontSize:10, fontWeight:600, color:diffColor(problem.difficulty), background:diffBg(problem.difficulty), padding:'2px 7px', borderRadius:4, textTransform:'capitalize' }}>{problem.difficulty}</span>
            <span className="topic-chip">{problem.topic}</span>
          </div>
          <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:14, lineHeight:1.35, marginBottom:10 }}>{problem.title}</div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {problem.langs.map(l => (
              <span key={l} style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, fontWeight:600, color:langColor(l), background:langBg(l), border:`1px solid ${langColor(l)}30`, padding:'2px 6px', borderRadius:4 }}>{langLabel(l)}</span>
            ))}
          </div>
        </div>
        <button onClick={sp(()=>onToggleBookmark(problem.slug))} className={`icon-btn${isBookmarked?' active':''}`} style={{ flexShrink:0 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill={isBookmarked?'currentColor':'none'}><path d="M2 1.5h7v9L5.5 8.5 2 10.5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}

const ALL_TOPICS = Object.keys(TOPIC_MAP).concat(['Miscellaneous'])

function HomePage({ stats, problems, loading, bookmarks, onToggleBookmark }) {
  const [search, setSearch] = useState('')
  const [diffFilter, setDiffFilter] = useState('all')
  const [topicFilter, setTopicFilter] = useState('all')
  const [langFilter, setLangFilter] = useState('all')
  const [sortBy, setSortBy] = useState('id')
  const [viewMode, setViewMode] = useState('grid')
  const [activeTab, setActiveTab] = useState('problems')
  const navigate = useNavigate()

  const allLangs = [...new Set(problems.flatMap(p=>p.langs))]

  const filtered = problems
    .filter(p => {
      const mSearch = p.title.toLowerCase().includes(search.toLowerCase()) || String(p.id).includes(search)
      const mDiff = diffFilter==='all' || p.difficulty.toLowerCase()===diffFilter
      const mTopic = topicFilter==='all' || p.topic===topicFilter
      const mLang = langFilter==='all' || p.langs.includes(langFilter)
      const mBook = diffFilter!=='bookmarked' || bookmarks.has(p.slug)
      return mSearch && mDiff && mTopic && mLang && mBook
    })
    .sort((a,b) => {
      if (sortBy==='id') return a.id-b.id
      if (sortBy==='title') return a.title.localeCompare(b.title)
      if (sortBy==='difficulty') return ({easy:0,medium:1,hard:2}[a.difficulty]||0)-({easy:0,medium:1,hard:2}[b.difficulty]||0)
      if (sortBy==='langs') return b.langs.length-a.langs.length
      if (sortBy==='topic') return a.topic.localeCompare(b.topic)
      return 0
    })

  const grouped = {}
  if (sortBy==='topic') filtered.forEach(p=>{ if(!grouped[p.topic]) grouped[p.topic]=[]; grouped[p.topic].push(p) })
  const useGroups = sortBy==='topic' && Object.keys(grouped).length>0

  return (
    <div style={{ maxWidth:1240, margin:'0 auto', padding:'40px 24px 80px' }}>
      <div className="fade-up" style={{ marginBottom:36 }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', background:'var(--accent-glow)', border:'1px solid var(--border-accent)', borderRadius:5, marginBottom:14 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--accent)', animation:'pulse 2s infinite' }}/>
              <span style={{ fontSize:10, fontWeight:600, color:'var(--accent)', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.08em', textTransform:'uppercase' }}>LeetCode Solutions</span>
            </div>
            <h1 style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:'clamp(28px,4vw,44px)', lineHeight:1.1, letterSpacing:'-0.03em', marginBottom:10 }}>Problem Archive</h1>
            <p style={{ fontSize:15, color:'var(--text-muted)', maxWidth:440, lineHeight:1.65, fontWeight:300 }}>Every solution documented. Browse by topic, difficulty, or language.</p>
          </div>
          {!loading && stats && (
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {[
                { label:'Total', value:stats.leetcode?.solved||problems.length, color:'var(--accent)' },
                { label:'Easy', value:stats.leetcode?.easy, color:'var(--easy)' },
                { label:'Medium', value:stats.leetcode?.medium, color:'var(--medium)' },
                { label:'Hard', value:stats.leetcode?.hard, color:'var(--hard)' },
              ].map(s => (
                <div key={s.label} style={{ padding:'10px 16px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:10, minWidth:72 }}>
                  <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:800, fontSize:22, color:s.color }}>{s.value||0}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="fade-up" style={{ animationDelay:'60ms' }}>
        <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
          {[['problems','Problems'],['stats','Insights'],['bookmarks','Bookmarks']].map(([k,l]) => (
            <button key={k} className="nav-tab" onClick={()=>setActiveTab(k)}
              style={{ color:activeTab===k?'var(--accent)':'var(--text-muted)', borderBottomColor:activeTab===k?'var(--accent)':'transparent' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {activeTab==='stats' && (
        <div className="fade-up" style={{ paddingTop:24 }}>
          <StatsPanel stats={stats} problems={problems} bookmarks={bookmarks}/>
        </div>
      )}

      {activeTab==='bookmarks' && (
        <div className="fade-up" style={{ paddingTop:24 }}>
          {bookmarks.size===0 ? (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:32, marginBottom:10, opacity:.2 }}>⌗</div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:16, marginBottom:6 }}>No bookmarks yet</div>
              <div style={{ fontSize:13 }}>Bookmark any problem to save it here for revision</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:10 }}>
              {problems.filter(p=>bookmarks.has(p.slug)).map((p,i) => (
                <ProblemCard key={p.slug} problem={p} index={i} viewMode="grid" bookmarks={bookmarks} onToggleBookmark={onToggleBookmark}/>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab==='problems' && (
        <>
          <div className="fade-up" style={{ animationDelay:'80ms', display:'flex', gap:8, marginTop:20, marginBottom:10, flexWrap:'wrap', alignItems:'center' }}>
            <div style={{ position:'relative', flex:'1 1 200px', minWidth:160 }}>
              <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)' }} width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              <input className="search-input" placeholder="Search problems..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {['all','easy','medium','hard'].map(f => (
                <button key={f} className={`filter-btn${diffFilter===f?` active-${f}`:''}`} onClick={()=>setDiffFilter(f)}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="fade-up" style={{ animationDelay:'100ms', display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
            <select value={topicFilter} onChange={e=>setTopicFilter(e.target.value)} style={{ padding:'7px 12px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:12, cursor:'pointer', outline:'none', fontFamily:'Outfit,sans-serif' }}>
              <option value="all">All Topics</option>
              {ALL_TOPICS.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
            <select value={langFilter} onChange={e=>setLangFilter(e.target.value)} style={{ padding:'7px 12px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:12, cursor:'pointer', outline:'none', fontFamily:'Outfit,sans-serif' }}>
              <option value="all">All Languages</option>
              {allLangs.map(l=><option key={l} value={l}>{langLabel(l)}</option>)}
            </select>
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} style={{ padding:'7px 12px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:12, cursor:'pointer', outline:'none', fontFamily:'Outfit,sans-serif' }}>
              <option value="id">Sort: Number</option>
              <option value="title">Sort: A–Z</option>
              <option value="difficulty">Sort: Difficulty</option>
              <option value="topic">Sort: Topic (Grouped)</option>
              <option value="langs">Sort: Most Languages</option>
            </select>
            <div style={{ marginLeft:'auto', display:'flex', gap:5 }}>
              <button className={`icon-btn${viewMode==='grid'?' active':''}`} onClick={()=>setViewMode('grid')} title="Grid">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
              </button>
              <button className={`icon-btn${viewMode==='list'?' active':''}`} onClick={()=>setViewMode('list')} title="List">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 3.5h11M1 6.5h11M1 9.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </button>
              <button className="icon-btn" onClick={()=>{ if(problems.length) navigate(`/problem/${problems[Math.floor(Math.random()*problems.length)].slug}`) }} title="Random">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 4h2l1.5 5H10M10 4l-2-2m2 2l-2 2M1 9h2l1.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>
          {!loading && (
            <div style={{ marginBottom:14, fontSize:11, color:'var(--text-muted)', fontFamily:'JetBrains Mono,monospace' }}>
              {filtered.length} {filtered.length===1?'problem':'problems'}{(search||diffFilter!=='all'||topicFilter!=='all'||langFilter!=='all')?' matched':''}
            </div>
          )}
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:10 }}>
              {Array.from({length:12},(_,i)=><SkeletonCard key={i}/>)}
            </div>
          ) : useGroups ? (
            <div style={{ display:'flex', flexDirection:'column', gap:28 }}>
              {Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([topic,tPs]) => (
                <div key={topic}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                    <span style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:15 }}>{topic}</span>
                    <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:10, color:'var(--text-muted)', background:'var(--bg-glass)', border:'1px solid var(--border)', padding:'2px 7px', borderRadius:4 }}>{tPs.length}</span>
                    <div style={{ flex:1, height:1, background:'var(--border)' }}/>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:10 }}>
                    {tPs.map((p,i)=><ProblemCard key={p.slug} problem={p} index={i} viewMode={viewMode} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark}/>)}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length>0 ? (
            <div style={viewMode==='grid'?{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:10}:{display:'flex',flexDirection:'column',gap:6}}>
              {filtered.map((p,i)=><ProblemCard key={p.slug} problem={p} index={i} viewMode={viewMode} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark}/>)}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'80px 20px', color:'var(--text-muted)' }}>
              <div style={{ fontSize:32, marginBottom:10, opacity:.2 }}>∅</div>
              <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:16, marginBottom:6 }}>No problems found</div>
              <div style={{ fontSize:13 }}>Try a different filter or search term</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function ProblemPage({ problems, theme, bookmarks, onToggleBookmark }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [readme, setReadme] = useState(null)
  const [solutions, setSolutions] = useState({})
  const [activeTab, setActiveTab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [notes, setNotes] = useState(()=>{ try{return JSON.parse(localStorage.getItem('dsa-notes')||'{}')}catch{return{}} })
  const [notesOpen, setNotesOpen] = useState(false)
  const [noteText, setNoteText] = useState('')

  const problem = problems.find(p=>p.slug===slug)
  const idx = problems.findIndex(p=>p.slug===slug)
  const prev = idx>0 ? problems[idx-1] : null
  const next = idx<problems.length-1 ? problems[idx+1] : null

  useEffect(()=>{
    if (!slug) return
    setLoading(true); setReadme(null); setSolutions({}); setActiveTab(null)
    setNoteText(notes[slug]||'')
    const go = async () => {
      try { const r=await fetch(`/data/${slug}/README.md`); if(r.ok) setReadme(await r.text()) } catch {}
      if (problem?.langs) {
        const loaded={}
        await Promise.all(problem.langs.map(async ext=>{
          try { const r=await fetch(`/data/${slug}/${slug}.${ext}`); if(r.ok) loaded[ext]=await r.text() } catch {}
        }))
        setSolutions(loaded)
        const first=Object.keys(loaded)[0]
        if (first) setActiveTab(first)
      }
      setLoading(false)
    }
    go()
  }, [slug])

  function saveNote(t) {
    const u={...notes,[slug]:t}; setNotes(u)
    try{localStorage.setItem('dsa-notes',JSON.stringify(u))}catch{}
  }

  const handleCopy = useCallback(()=>{
    if (!activeTab||!solutions[activeTab]) return
    navigator.clipboard.writeText(solutions[activeTab]).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000) })
  }, [activeTab,solutions])

  const codeTheme = theme==='dark' ? darkCodeTheme : lightCodeTheme
  const isBookmarked = bookmarks.has(slug)
  const leetUrl = problem ? `https://leetcode.com/problems/${slug.replace(/^\d+-/,'')}` : null

  return (
    <div style={{ maxWidth:940, margin:'0 auto', padding:'32px 24px 80px' }}>
      <div className="fade-in" style={{ marginBottom:22, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <button className="back-btn" onClick={()=>navigate('/')}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5L3.5 5.5L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {prev && <button className="back-btn" onClick={()=>navigate(`/problem/${prev.slug}`)}><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5L3.5 5.5L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Prev</button>}
          {next && <button className="back-btn" onClick={()=>navigate(`/problem/${next.slug}`)}>Next<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 1.5L7.5 5.5L3.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}
          <button className={`icon-btn${isBookmarked?' active':''}`} onClick={()=>onToggleBookmark(slug)} title="Bookmark">
            <svg width="12" height="12" viewBox="0 0 12 12" fill={isBookmarked?'currentColor':'none'}><path d="M2 1.5h8v10L6 9 2 11.5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </button>
          {leetUrl && (
            <a href={leetUrl} target="_blank" rel="noopener noreferrer" className="back-btn" style={{ gap:5 }}>
              LeetCode<svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.5 1.5H8.5V4.5M8.5 1.5L4 7M2 3.5H1.5A.5.5 0 0 0 1 4v5a.5.5 0 0 0 .5.5H6a.5.5 0 0 0 .5-.5V8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          )}
        </div>
      </div>

      <div className="fade-up" style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10, flexWrap:'wrap' }}>
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'var(--text-faint)' }}>#{String(problem?.id||'').padStart(4,'0')}</span>
          {problem?.difficulty && <span style={{ fontSize:10, fontWeight:600, color:diffColor(problem.difficulty), background:diffBg(problem.difficulty), padding:'3px 9px', borderRadius:4, textTransform:'capitalize' }}>{problem.difficulty}</span>}
          {problem?.topic && <span className="topic-chip">{problem.topic}</span>}
          {problem?.langs.map(l=>(
            <span key={l} style={{ fontFamily:'JetBrains Mono,monospace', fontSize:9, fontWeight:600, color:langColor(l), background:langBg(l), border:`1px solid ${langColor(l)}30`, padding:'2px 7px', borderRadius:4 }}>{langLabel(l)}</span>
          ))}
        </div>
        <h1 style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:'clamp(20px,3.5vw,30px)', lineHeight:1.2, letterSpacing:'-0.02em' }}>
          {problem?.title || slug}
        </h1>
      </div>

      <div className="fade-up" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'24px 28px', marginBottom:20, animationDelay:'50ms' }}>
        <div style={{ fontSize:10, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.09em', fontFamily:'JetBrains Mono,monospace', marginBottom:18, paddingBottom:14, borderBottom:'1px solid var(--border)' }}>Problem Statement</div>
        {loading ? (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[100,85,90,70,55].map((w,i)=><div key={i} className="skeleton" style={{ width:`${w}%`, height:14 }}/>)}
          </div>
        ) : readme ? (
          <div className="problem-readme"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown></div>
        ) : (
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>No problem statement available.</p>
        )}
      </div>

      {!loading && Object.keys(solutions).length>0 && (
        <div className="fade-up" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', marginBottom:20, animationDelay:'100ms' }}>
          <div style={{ padding:'14px 18px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
              {Object.keys(solutions).map(ext=>(
                <button key={ext} className={`tab-btn${activeTab===ext?' active':''}`} onClick={()=>setActiveTab(ext)}
                  style={activeTab!==ext?{borderColor:`${langColor(ext)}40`,color:langColor(ext)}:{}}>
                  {langLabel(ext)}
                </button>
              ))}
            </div>
            <button onClick={handleCopy} style={{ padding:'5px 11px', borderRadius:7, border:`1px solid ${copied?'var(--easy)':'var(--border)'}`, background:copied?'var(--easy-bg)':'var(--bg-glass)', color:copied?'var(--easy)':'var(--text-muted)', fontSize:10, fontWeight:500, fontFamily:'JetBrains Mono,monospace', cursor:'pointer', transition:'all 0.15s', display:'flex', alignItems:'center', gap:4 }}>
              {copied?'Copied ✓':'Copy'}
            </button>
          </div>
          <div style={{ background:'var(--code-bg)', position:'relative' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:`linear-gradient(90deg, ${langColor(activeTab)} 0%, transparent 50%)`, opacity:.4 }}/>
            {activeTab && solutions[activeTab] && (
              <SyntaxHighlighter language={langHL(activeTab)} style={codeTheme}
                customStyle={{ margin:0, padding:'22px 24px', background:'transparent', fontSize:'13px', lineHeight:'1.75', maxHeight:'520px', overflow:'auto' }}
                showLineNumbers lineNumberStyle={{ color:'var(--text-faint)', fontSize:'11px', userSelect:'none', paddingRight:'18px', minWidth:'32px' }}>
                {solutions[activeTab]}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      )}

      <div className="fade-up" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, overflow:'hidden', animationDelay:'140ms' }}>
        <button onClick={()=>setNotesOpen(o=>!o)} style={{ width:'100%', padding:'14px 18px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2h9v7H8l-2 2-1-2H2V2z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
            <span style={{ fontSize:12, fontWeight:600, fontFamily:'JetBrains Mono,monospace', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.07em' }}>Notes</span>
            {notes[slug] && <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--accent)' }}/>}
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform:notesOpen?'rotate(180deg)':'none', transition:'transform 0.2s', color:'var(--text-muted)' }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {notesOpen && (
          <div style={{ padding:'0 18px 18px', borderTop:'1px solid var(--border)' }}>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="Write your approach, edge cases, complexity..."
              style={{ width:'100%', minHeight:120, padding:'12px 14px', background:'var(--code-bg)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text)', fontSize:13, fontFamily:'JetBrains Mono,monospace', resize:'vertical', outline:'none', lineHeight:1.7, marginTop:12 }}/>
            <button onClick={()=>saveNote(noteText)} style={{ marginTop:8, padding:'7px 16px', borderRadius:8, border:'none', background:'var(--accent)', color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>Save</button>
          </div>
        )}
      </div>

      {!loading && !Object.keys(solutions).length && (
        <div className="fade-up" style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:14, padding:'48px 28px', textAlign:'center', marginTop:20 }}>
          <div style={{ opacity:.2, fontSize:28, marginBottom:10 }}>∅</div>
          <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:600, fontSize:14, marginBottom:5 }}>No solutions available</div>
          <div style={{ fontSize:12, color:'var(--text-muted)' }}>Solution files were not found for this problem.</div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [theme, setTheme] = useState(()=>{ try{return localStorage.getItem('dsa-theme')||'dark'}catch{return'dark'} })
  const [stats, setStats] = useState(null)
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState(()=>{ try{return new Set(JSON.parse(localStorage.getItem('dsa-bookmarks')||'[]'))}catch{return new Set()} })

  const t = tokens[theme]||tokens.dark

  const toggleTheme = ()=>{
    setTheme(p=>{ const n=p==='dark'?'light':'dark'; try{localStorage.setItem('dsa-theme',n)}catch{}; return n })
  }

  const toggleBookmark = useCallback((slug)=>{
    setBookmarks(p=>{ const n=new Set(p); n.has(slug)?n.delete(slug):n.add(slug); try{localStorage.setItem('dsa-bookmarks',JSON.stringify([...n]))}catch{}; return n })
  }, [])

  useEffect(()=>{
    fetch('/data/stats.json').then(r=>r.json()).then(data=>{ setStats(data); setProblems(parseShas(data)); setLoading(false) }).catch(()=>setLoading(false))
  }, [])

  useEffect(()=>{
    function onKey(e){ if((e.metaKey||e.ctrlKey)&&e.key==='k'){ e.preventDefault(); setCmdOpen(o=>!o) } }
    window.addEventListener('keydown',onKey)
    return ()=>window.removeEventListener('keydown',onKey)
  }, [])

  return (
    <BrowserRouter>
      <GlobalStyles t={t}/>
      <Navbar theme={theme} toggleTheme={toggleTheme} stats={stats} onCmdOpen={()=>setCmdOpen(true)}/>
      {cmdOpen && <CommandPalette problems={problems} onClose={()=>setCmdOpen(false)}/>}
      <Routes>
        <Route path="/" element={<HomePage stats={stats} problems={problems} loading={loading} bookmarks={bookmarks} onToggleBookmark={toggleBookmark}/>}/>
        <Route path="/problem/:slug" element={<ProblemPage problems={problems} theme={theme} bookmarks={bookmarks} onToggleBookmark={toggleBookmark}/>}/>
        <Route path="*" element={
          <div style={{ textAlign:'center', padding:'120px 20px' }}>
            <div style={{ fontFamily:'Outfit,sans-serif', fontWeight:700, fontSize:22, marginBottom:8 }}>404</div>
            <div style={{ color:'var(--text-muted)', marginBottom:16, fontSize:13 }}>Page not found</div>
            <Link to="/" style={{ color:'var(--accent)', fontSize:13 }}>Go home</Link>
          </div>
        }/>
      </Routes>
    </BrowserRouter>
  )
}
