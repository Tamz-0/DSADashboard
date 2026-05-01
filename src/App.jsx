import { useState, useEffect, useCallback, useRef } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

// ─── THEME TOKENS ────────────────────────────────────────────────────────────

const tokens = {
  dark: {
    bg: '#0a0a0b',
    bgCard: '#111113',
    bgCardHover: '#161618',
    bgGlass: 'rgba(255,255,255,0.03)',
    border: 'rgba(255,255,255,0.07)',
    borderStrong: 'rgba(255,255,255,0.14)',
    text: '#e8e8ea',
    textMuted: '#666672',
    textFaint: '#333340',
    accent: '#7c6af7',
    accentGlow: 'rgba(124,106,247,0.15)',
    accentHover: '#9080ff',
    easy: '#27c98f',
    easyBg: 'rgba(39,201,143,0.1)',
    medium: '#f0a429',
    mediumBg: 'rgba(240,164,41,0.1)',
    hard: '#f05656',
    hardBg: 'rgba(240,86,86,0.1)',
    codeBg: '#0d0d0f',
    shadow: '0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)',
    shadowHover: '0 4px 12px rgba(0,0,0,0.5), 0 24px 48px rgba(0,0,0,0.4)',
  },
  light: {
    bg: '#f5f4f0',
    bgCard: '#ffffff',
    bgCardHover: '#fdfcfa',
    bgGlass: 'rgba(0,0,0,0.02)',
    border: 'rgba(0,0,0,0.07)',
    borderStrong: 'rgba(0,0,0,0.14)',
    text: '#1a1a1e',
    textMuted: '#8a8a96',
    textFaint: '#c8c8d0',
    accent: '#5b4ddd',
    accentGlow: 'rgba(91,77,221,0.1)',
    accentHover: '#7060ee',
    easy: '#1a9e6e',
    easyBg: 'rgba(26,158,110,0.09)',
    medium: '#c47d0a',
    mediumBg: 'rgba(196,125,10,0.09)',
    hard: '#c73232',
    hardBg: 'rgba(199,50,50,0.09)',
    codeBg: '#f0efe9',
    shadow: '0 1px 3px rgba(0,0,0,0.07), 0 8px 24px rgba(0,0,0,0.06)',
    shadowHover: '0 4px 12px rgba(0,0,0,0.1), 0 24px 48px rgba(0,0,0,0.08)',
  }
}

// ─── SYNTAX HIGHLIGHT THEMES ──────────────────────────────────────────────────

const darkCodeTheme = {
  'code[class*="language-"]': { color: '#c9d1d9', background: 'none', fontFamily: '"DM Mono", monospace', fontSize: '13px', lineHeight: '1.7' },
  'comment': { color: '#4a4f5a', fontStyle: 'italic' },
  'keyword': { color: '#a78bfa' },
  'string': { color: '#7dd3a8' },
  'number': { color: '#f8c555' },
  'function': { color: '#60a5fa' },
  'class-name': { color: '#34d399' },
  'operator': { color: '#94a3b8' },
  'punctuation': { color: '#64748b' },
  'boolean': { color: '#f87171' },
  'builtin': { color: '#f8c555' },
  'type': { color: '#34d399' },
}

const lightCodeTheme = {
  'code[class*="language-"]': { color: '#2d333b', background: 'none', fontFamily: '"DM Mono", monospace', fontSize: '13px', lineHeight: '1.7' },
  'comment': { color: '#959da5', fontStyle: 'italic' },
  'keyword': { color: '#7c3aed' },
  'string': { color: '#1a7f5a' },
  'number': { color: '#c2830a' },
  'function': { color: '#2563eb' },
  'class-name': { color: '#0f7a5a' },
  'operator': { color: '#64748b' },
  'punctuation': { color: '#94a3b8' },
  'boolean': { color: '#dc2626' },
  'builtin': { color: '#c2830a' },
  'type': { color: '#0f7a5a' },
}

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────

function GlobalStyles({ t }) {
  return (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      :root {
        --bg: ${t.bg};
        --bg-card: ${t.bgCard};
        --bg-card-hover: ${t.bgCardHover};
        --bg-glass: ${t.bgGlass};
        --border: ${t.border};
        --border-strong: ${t.borderStrong};
        --text: ${t.text};
        --text-muted: ${t.textMuted};
        --text-faint: ${t.textFaint};
        --accent: ${t.accent};
        --accent-glow: ${t.accentGlow};
        --accent-hover: ${t.accentHover};
        --easy: ${t.easy};
        --easy-bg: ${t.easyBg};
        --medium: ${t.medium};
        --medium-bg: ${t.mediumBg};
        --hard: ${t.hard};
        --hard-bg: ${t.hardBg};
        --code-bg: ${t.codeBg};
        --shadow: ${t.shadow};
        --shadow-hover: ${t.shadowHover};
      }

      html, body {
        background: var(--bg);
        color: var(--text);
        font-family: 'DM Sans', system-ui, sans-serif;
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      html {
            scroll-behavior: smooth;
          }

      #root { min-height: 100vh; }

      ::selection { background: var(--accent-glow); color: var(--accent); }

      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--text-faint); }

      a { color: inherit; text-decoration: none; }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .fade-up {
        animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
      }

      .fade-in {
        animation: fadeIn 0.3s ease both;
      }

      .problem-card {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px 24px;
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.16,1,0.3,1),
                    box-shadow 0.2s cubic-bezier(0.16,1,0.3,1),
                    border-color 0.2s ease,
                    background 0.2s ease;
        box-shadow: var(--shadow);
        position: relative;
        overflow: hidden;
      }

      .problem-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, var(--accent-glow) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.3s ease;
        border-radius: 12px;
      }

      .problem-card:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-hover);
        border-color: var(--border-strong);
        background: var(--bg-card-hover);
      }

      .problem-card:hover::before {
        opacity: 1;
      }

      .skeleton {
        background: linear-gradient(
          90deg,
          var(--border) 25%,
          var(--border-strong) 50%,
          var(--border) 75%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
      }

      .tab-btn {
        padding: 7px 16px;
        border-radius: 7px;
        font-size: 12px;
        font-weight: 500;
        font-family: 'DM Mono', monospace;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.15s ease;
        letter-spacing: 0.02em;
      }

      .tab-btn.active {
        background: var(--accent);
        color: #fff;
        border-color: var(--accent);
      }

      .tab-btn:not(.active) {
        background: var(--bg-glass);
        color: var(--text-muted);
        border-color: var(--border);
      }

      .tab-btn:not(.active):hover {
        border-color: var(--border-strong);
        color: var(--text);
      }

      .theme-toggle {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: var(--bg-glass);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        transition: all 0.15s ease;
        font-size: 15px;
      }

      .theme-toggle:hover {
        border-color: var(--border-strong);
        color: var(--text);
        background: var(--bg-card);
      }

      .search-input {
        width: 100%;
        padding: 10px 16px 10px 40px;
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 10px;
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        outline: none;
        transition: border-color 0.15s ease, box-shadow 0.15s ease;
      }

      .search-input::placeholder { color: var(--text-muted); }

      .search-input:focus {
        border-color: var(--accent);
        box-shadow: 0 0 0 3px var(--accent-glow);
      }

      .filter-btn {
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid var(--border);
        background: var(--bg-glass);
        color: var(--text-muted);
        transition: all 0.15s ease;
        white-space: nowrap;
      }

      .filter-btn.active-easy {
        background: var(--easy-bg);
        color: var(--easy);
        border-color: var(--easy);
      }

      .filter-btn.active-medium {
        background: var(--medium-bg);
        color: var(--medium);
        border-color: var(--medium);
      }

      .filter-btn.active-hard {
        background: var(--hard-bg);
        color: var(--hard);
        border-color: var(--hard);
      }

      .filter-btn.active-all {
        background: var(--accent-glow);
        color: var(--accent);
        border-color: var(--accent);
      }

      .filter-btn:hover:not(.active-easy):not(.active-medium):not(.active-hard):not(.active-all) {
        border-color: var(--border-strong);
        color: var(--text);
      }

      .back-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 7px 12px;
        border-radius: 8px;
        border: 1px solid var(--border);
        background: var(--bg-glass);
        color: var(--text-muted);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .back-btn:hover {
        border-color: var(--border-strong);
        color: var(--text);
        background: var(--bg-card);
      }

      .problem-readme h1, .problem-readme h2, .problem-readme h3 {
        font-family: 'Syne', sans-serif;
        color: var(--text);
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        line-height: 1.3;
      }
      .problem-readme h1 { font-size: 22px; font-weight: 700; }
      .problem-readme h2 { font-size: 17px; font-weight: 600; }
      .problem-readme h3 { font-size: 15px; font-weight: 600; }
      .problem-readme p { color: var(--text); line-height: 1.75; margin-bottom: 1em; font-size: 14px; }
      .problem-readme a { color: var(--accent); }
      .problem-readme a:hover { text-decoration: underline; }
      .problem-readme code {
        font-family: 'DM Mono', monospace;
        font-size: 12px;
        background: var(--code-bg);
        border: 1px solid var(--border);
        padding: 1px 6px;
        border-radius: 4px;
        color: var(--accent);
      }
      .problem-readme pre {
        background: var(--code-bg);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 16px;
        overflow-x: auto;
        margin-bottom: 1em;
      }
      .problem-readme pre code {
        background: none;
        border: none;
        padding: 0;
        color: var(--text);
        font-size: 12px;
      }
      .problem-readme ul, .problem-readme ol {
        padding-left: 1.5em;
        margin-bottom: 1em;
        font-size: 14px;
        line-height: 1.75;
        color: var(--text);
      }
      .problem-readme strong { color: var(--text); font-weight: 600; }
      .problem-readme em { color: var(--text-muted); }
      .problem-readme hr { border: none; border-top: 1px solid var(--border); margin: 1.5em 0; }
    `}</style>
  )
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function difficultyColor(d) {
  if (!d) return 'var(--text-muted)'
  const l = d.toLowerCase()
  if (l === 'easy') return 'var(--easy)'
  if (l === 'medium') return 'var(--medium)'
  if (l === 'hard') return 'var(--hard)'
  return 'var(--text-muted)'
}

function difficultyBg(d) {
  if (!d) return 'transparent'
  const l = d.toLowerCase()
  if (l === 'easy') return 'var(--easy-bg)'
  if (l === 'medium') return 'var(--medium-bg)'
  if (l === 'hard') return 'var(--hard-bg)'
  return 'transparent'
}

function parseShas(stats) {
  const shas = stats?.leetcode?.shas || {}
  const problems = []
  for (const [slug, data] of Object.entries(shas)) {
    if (typeof data !== 'object' || !data.difficulty) continue
    const idMatch = slug.match(/^(\d+)/)
    if (!idMatch) continue
    const id = parseInt(idMatch[1], 10)
    const rawTitle = slug.replace(/^\d+-/, '').replace(/-/g, ' ')
    const title = rawTitle.replace(/\b\w/g, c => c.toUpperCase())
    const langs = Object.keys(data)
      .filter(k => !['README.md', 'difficulty', ''].includes(k))
      .map(k => {
        const ext = k.split('.').pop()
        return ext
      })
    problems.push({ id, slug, title, difficulty: data.difficulty, langs })
  }
  return problems.sort((a, b) => a.id - b.id)
}

function langLabel(ext) {
  const map = { cpp: 'C++', java: 'Java', js: 'JavaScript', py: 'Python', ts: 'TypeScript', c: 'C' }
  return map[ext] || ext.toUpperCase()
}

function langForHighlight(ext) {
  const map = { cpp: 'cpp', java: 'java', js: 'javascript', py: 'python', ts: 'typescript',c: 'C' }
  return map[ext] || 'text'
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ theme, toggleTheme, stats }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: theme === 'dark' ? 'rgba(10,10,11,0.85)' : 'rgba(245,244,240,0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L5.5 10.5L12 3.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>
            Taha's DSA Playground
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {stats && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--text-muted)' }}>Solved</span>
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontWeight: 500,
                color: 'var(--accent)',
                background: 'var(--accent-glow)',
                padding: '2px 8px',
                borderRadius: 5,
                fontSize: 12,
              }}>{stats.leetcode?.solved || 0}</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <StatPill label="E" value={stats?.leetcode?.easy || 0} color="var(--easy)" />
            <StatPill label="M" value={stats?.leetcode?.medium || 0} color="var(--medium)" />
            <StatPill label="H" value={stats?.leetcode?.hard || 0} color="var(--hard)" />
          </div>
          <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀' : '◑'}
          </button>
        </div>
      </div>
    </nav>
  )
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 5,
      background: 'var(--bg-glass)',
      border: '1px solid var(--border)',
      fontSize: 11, fontFamily: 'DM Mono, monospace',
      color: 'var(--text-muted)',
    }}>
      <span style={{ color, fontWeight: 600 }}>{label}</span>
      <span>{value}</span>
    </div>
  )
}

// ─── PROBLEM CARD ─────────────────────────────────────────────────────────────

function ProblemCard({ problem, index }) {
  const navigate = useNavigate()
  const diff = problem.difficulty
  const langIcons = { cpp: '⌥', java: '☕', js: 'JS', py: 'Py', ts: 'TS' }

  return (
    <div
      className="problem-card fade-up"
      style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
      onClick={() => navigate(`/problem/${problem.slug}`)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              color: 'var(--text-faint)',
              fontWeight: 500,
            }}>
              #{String(problem.id).padStart(4, '0')}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: difficultyColor(diff),
              background: difficultyBg(diff),
              padding: '2px 8px',
              borderRadius: 4,
              textTransform: 'capitalize',
            }}>
              {diff}
            </span>
          </div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 600,
            fontSize: 15,
            color: 'var(--text)',
            lineHeight: 1.35,
            marginBottom: 12,
          }}>
            {problem.title}
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {problem.langs.map(lang => (
              <span key={lang} style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--text-muted)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border)',
                padding: '2px 7px',
                borderRadius: 4,
              }}>
                {langLabel(lang)}
              </span>
            ))}
          </div>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-faint)',
          flexShrink: 0,
          transition: 'all 0.15s ease',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 6.5H10.5M10.5 6.5L7 3M10.5 6.5L7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

// ─── SKELETON CARD ────────────────────────────────────────────────────────────

function SkeletonCard({ delay = 0 }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '20px 24px',
      animationDelay: `${delay}ms`,
    }} className="fade-in">
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <div className="skeleton" style={{ width: 50, height: 14 }} />
        <div className="skeleton" style={{ width: 44, height: 14 }} />
      </div>
      <div className="skeleton" style={{ width: '70%', height: 18, marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 4 }}>
        <div className="skeleton" style={{ width: 28, height: 18 }} />
        <div className="skeleton" style={{ width: 28, height: 18 }} />
      </div>
    </div>
  )
}

// ─── HOMEPAGE ─────────────────────────────────────────────────────────────────

function HomePage({ stats, problems, loading }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = problems.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search)
    const matchFilter = filter === 'all' || p.difficulty.toLowerCase() === filter
    return matchSearch && matchFilter
  })

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
  ]

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
      {/* Hero */}
      <div className="fade-up" style={{ marginBottom: 48 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 12px',
          background: 'var(--accent-glow)',
          border: '1px solid var(--accent)',
          borderRadius: 6,
          marginBottom: 20,
          opacity: 0.85,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'block' }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', fontFamily: 'DM Mono, monospace', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            LeetCode Solutions
          </span>
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(32px, 5vw, 52px)',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 14,
          color: 'var(--text)',
        }}>
          Problem Archive
        </h1>
        <p style={{
          fontSize: 16,
          color: 'var(--text-muted)',
          maxWidth: 480,
          lineHeight: 1.65,
          fontWeight: 300,
        }}>
          A curated collection of algorithmic problem solutions. Browse, study, and explore implementations across multiple languages.
        </p>
      </div>

      {/* Stats bar */}
      {!loading && stats && (
        <div className="fade-up" style={{
          display: 'flex',
          gap: 12,
          marginBottom: 36,
          animationDelay: '60ms',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'Total Solved', value: stats.leetcode?.solved, color: 'var(--accent)' },
            { label: 'Easy', value: stats.leetcode?.easy, color: 'var(--easy)' },
            { label: 'Medium', value: stats.leetcode?.medium, color: 'var(--medium)' },
            { label: 'Hard', value: stats.leetcode?.hard, color: 'var(--hard)' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '14px 20px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              minWidth: 100,
            }}>
              <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, color: s.color }}>
                {s.value || 0}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter */}
      <div className="fade-up" style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap', animationDelay: '100ms' }}>
        <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
          <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <input
            className="search-input"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${filter === f.key ? `active-${f.key}` : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      {!loading && (
        <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'DM Mono, monospace' }}>
          {filtered.length} {filtered.length === 1 ? 'problem' : 'problems'}
          {search || filter !== 'all' ? ' found' : ' total'}
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 12,
      }}>
        {loading
          ? Array.from({ length: 12 }, (_, i) => <SkeletonCard key={i} delay={i * 40} />)
          : filtered.length > 0
            ? filtered.map((p, i) => <ProblemCard key={p.slug} problem={p} index={i} />)
            : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '80px 20px',
                color: 'var(--text-muted)',
              }}>
                <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>∅</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                  No problems found
                </div>
                <div style={{ fontSize: 13 }}>Try a different search or filter</div>
              </div>
            )
        }
      </div>
    </div>
  )
}

// ─── PROBLEM PAGE ─────────────────────────────────────────────────────────────

function ProblemPage({ problems, theme }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [readme, setReadme] = useState(null)
  const [solutions, setSolutions] = useState({})
  const [activeTab, setActiveTab] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copyState, setCopyState] = useState(false)

  const problem = problems.find(p => p.slug === slug)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setReadme(null)
    setSolutions({})
    setActiveTab(null)

    const fetchAll = async () => {
      try {
        const r = await fetch(`/data/${slug}/README.md`)
        if (r.ok) setReadme(await r.text())
      } catch {}

      if (problem?.langs) {
        const loaded = {}
        await Promise.all(
          problem.langs.map(async ext => {
            try {
              const res = await fetch(`/data/${slug}/${slug}.${ext}`)
              if (res.ok) loaded[ext] = await res.text()
            } catch {}
          })
        )
        setSolutions(loaded)
        const firstKey = Object.keys(loaded)[0]
        if (firstKey) setActiveTab(firstKey)
      }
      setLoading(false)
    }

    fetchAll()
  }, [slug])

  const handleCopy = useCallback(() => {
    if (!activeTab || !solutions[activeTab]) return
    navigator.clipboard.writeText(solutions[activeTab]).then(() => {
      setCopyState(true)
      setTimeout(() => setCopyState(false), 2000)
    })
  }, [activeTab, solutions])

  const diff = problem?.difficulty
  const codeTheme = theme === 'dark' ? darkCodeTheme : lightCodeTheme

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '36px 24px 80px' }}>
      {/* Back */}
      <div className="fade-in" style={{ marginBottom: 28 }}>
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
      </div>

      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 12,
            color: 'var(--text-faint)',
          }}>
            #{String(problem?.id || '').padStart(4, '0')}
          </span>
          {diff && (
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: difficultyColor(diff),
              background: difficultyBg(diff),
              padding: '3px 10px',
              borderRadius: 5,
              textTransform: 'capitalize',
            }}>
              {diff}
            </span>
          )}
          {problem?.langs.map(lang => (
            <span key={lang} style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 10,
              fontWeight: 500,
              color: 'var(--text-muted)',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
              padding: '2px 7px',
              borderRadius: 4,
            }}>
              {langLabel(lang)}
            </span>
          ))}
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontWeight: 700,
          fontSize: 'clamp(22px, 4vw, 32px)',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
        }}>
          {problem?.title || slug}
        </h1>
      </div>

      {/* Problem statement */}
      <div className="fade-up" style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '28px 32px',
        marginBottom: 24,
        animationDelay: '60ms',
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'DM Mono, monospace',
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid var(--border)',
        }}>
          Problem Statement
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[100, 85, 90, 70, 55].map((w, i) => (
              <div key={i} className="skeleton" style={{ width: `${w}%`, height: 14 }} />
            ))}
          </div>
        ) : readme ? (
          <div className="problem-readme">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No problem statement available.</p>
        )}
      </div>

      {/* Solutions */}
      {!loading && Object.keys(solutions).length > 0 && (
        <div className="fade-up" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
          animationDelay: '120ms',
        }}>
          {/* Code header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.keys(solutions).map(ext => (
                <button
                  key={ext}
                  className={`tab-btn ${activeTab === ext ? 'active' : ''}`}
                  onClick={() => setActiveTab(ext)}
                >
                  {langLabel(ext)}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              style={{
                padding: '6px 12px',
                borderRadius: 7,
                border: '1px solid var(--border)',
                background: copyState ? 'var(--easy-bg)' : 'var(--bg-glass)',
                color: copyState ? 'var(--easy)' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 500,
                fontFamily: 'DM Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              {copyState ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M1.5 5.5L4 8L9.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <rect x="1" y="3.5" width="6.5" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M3.5 3.5V2.5A1.5 1.5 0 0 1 5 1h3.5A1.5 1.5 0 0 1 10 2.5V7A1.5 1.5 0 0 1 8.5 8.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Code body */}
          <div style={{ background: 'var(--code-bg)', position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: 1,
              background: 'linear-gradient(90deg, var(--accent) 0%, transparent 60%)',
              opacity: 0.4,
            }} />
            {activeTab && solutions[activeTab] && (
              <SyntaxHighlighter
                language={langForHighlight(activeTab)}
                style={codeTheme}
                customStyle={{
                  margin: 0,
                  padding: '24px 28px',
                  background: 'transparent',
                  fontSize: '13px',
                  lineHeight: '1.7',
                  maxHeight: '520px',
                  overflow: 'auto',
                }}
                showLineNumbers
                lineNumberStyle={{
                  color: 'var(--text-faint)',
                  fontSize: '11px',
                  userSelect: 'none',
                  paddingRight: '20px',
                  minWidth: '36px',
                }}
              >
                {solutions[activeTab]}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      )}

      {!loading && Object.keys(solutions).length === 0 && (
        <div className="fade-up" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '48px 32px',
          textAlign: 'center',
          animationDelay: '120ms',
        }}>
          <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.3 }}>∅</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>
            No solutions available
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Solution files were not found for this problem.
          </div>
        </div>
      )}
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('dsa-theme') || 'dark' } catch { return 'dark' }
  })
  const [stats, setStats] = useState(null)
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

  const t = tokens[theme] || tokens.dark

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      try { localStorage.setItem('dsa-theme', next) } catch {}
      return next
    })
  }

  useEffect(() => {
    fetch('/data/stats.json')
      .then(r => r.json())
      .then(data => {
        setStats(data)
        setProblems(parseShas(data))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <BrowserRouter>
      <GlobalStyles t={t} />
      <Navbar theme={theme} toggleTheme={toggleTheme} stats={stats} />
      <Routes>
        <Route path="/" element={<HomePage stats={stats} problems={problems} loading={loading} />} />
        <Route path="/problem/:slug" element={<ProblemPage problems={problems} theme={theme} />} />
        <Route path="*" element={
          <div style={{ textAlign: 'center', padding: '120px 20px' }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, marginBottom: 8 }}>404</div>
            <div style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>Page not found</div>
            <Link to="/" style={{ color: 'var(--accent)', fontSize: 14 }}>Go home</Link>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  )
}
