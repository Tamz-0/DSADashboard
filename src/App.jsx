import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────

const T = {
  dark: {
    bg:           '#05050a',
    bgCard:       '#0c0c14',
    bgCardAlt:    '#10101a',
    bgGlass:      'rgba(255,255,255,0.028)',
    bgGlassHover: 'rgba(255,255,255,0.055)',
    border:       'rgba(255,255,255,0.055)',
    borderStrong: 'rgba(255,255,255,0.11)',
    text:         '#eeeef2',
    textSub:      '#8888a0',
    textFaint:    '#28283a',
    accent:       '#a78bfa',
    accentAlt:    '#38bdf8',
    accentGlow:   'rgba(167,139,250,0.14)',
    accentBorder: 'rgba(167,139,250,0.28)',
    easy:         '#34d399',
    easyBg:       'rgba(52,211,153,0.09)',
    medium:       '#fbbf24',
    mediumBg:     'rgba(251,191,36,0.09)',
    hard:         '#f87171',
    hardBg:       'rgba(248,113,113,0.09)',
    codeBg:       '#040408',
    gradHero:     'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(167,139,250,0.12) 0%, transparent 70%)',
    noise:        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
  },
  light: {
    bg:           '#f7f5f2',
    bgCard:       '#ffffff',
    bgCardAlt:    '#faf9f7',
    bgGlass:      'rgba(0,0,0,0.025)',
    bgGlassHover: 'rgba(0,0,0,0.05)',
    border:       'rgba(0,0,0,0.07)',
    borderStrong: 'rgba(0,0,0,0.13)',
    text:         '#141418',
    textSub:      '#707084',
    textFaint:    '#c8c8d4',
    accent:       '#7c3aed',
    accentAlt:    '#0284c7',
    accentGlow:   'rgba(124,58,237,0.09)',
    accentBorder: 'rgba(124,58,237,0.22)',
    easy:         '#059669',
    easyBg:       'rgba(5,150,105,0.08)',
    medium:       '#d97706',
    mediumBg:     'rgba(217,119,6,0.08)',
    hard:         '#dc2626',
    hardBg:       'rgba(220,38,38,0.08)',
    codeBg:       '#f1ede8',
    gradHero:     'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(124,58,237,0.07) 0%, transparent 70%)',
    noise:        '',
  }
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const TOPIC_MAP = {
  'Arrays':             ['two-sum','contains-duplicate','product-of-array','maximum-subarray','maximum-product-subarray','maximum-absolute-sum','find-all-numbers-disappeared','move-zeroes','remove-element','subarray-sum-equals-k','subarray-sums-divisible','sum-multiples','replace-elements','how-many-numbers-are-smaller','divide-an-array-into-subarrays','sign-of-the-product','xor-operation','trionic'],
  'Two Pointers':       ['two-sum-ii','three-sum','container-with-most-water','valid-palindrome','trapping-rain-water'],
  'Sliding Window':     ['maximum-subarray','first-unique-character','minimum-window'],
  'Binary Search':      ['binary-search','find-peak-element','find-smallest-letter'],
  'Hashing':            ['group-anagrams','valid-anagram','first-unique-character','subarray-sum-equals-k','two-sum'],
  'Linked List':        ['remove-duplicates-from-sorted-list','palindrome-linked-list'],
  'Trees':              ['validate-binary-search-tree','lowest-common-ancestor'],
  'Dynamic Programming':['climbing-stairs','unique-paths','maximum-subarray','maximum-product-subarray'],
  'Math':               ['reverse-integer','palindrome-number','add-digits','missing-number','number-of-1-bits','find-pivot-index','minimum-time-visiting-all-points'],
  'Stack':              ['valid-parentheses','basic-calculator'],
  'Matrix':             ['spiral-matrix'],
  'Strings':            ['longest-common-prefix','valid-anagram','first-unique-character','to-lower-case','first-letter-to-appear-twice','valid-palindrome','counter'],
  'Greedy':             ['number-of-students-unable-to-eat-lunch','time-needed-to-buy-tickets','maximum-count-of-positive-integer','find-if-digit-game'],
  'Prefix Sum':         ['find-pivot-index','subarray-sum-equals-k','subarray-sums-divisible','product-of-array'],
  'Bit Manipulation':   ['number-of-1-bits','xor-operation','missing-number'],
}

const TOPIC_ICONS = {
  'Arrays':'⬡','Two Pointers':'⇄','Sliding Window':'◫','Binary Search':'◎','Hashing':'⋕',
  'Linked List':'⬡','Trees':'⟁','Dynamic Programming':'◈','Math':'∑','Stack':'⊟',
  'Matrix':'⊞','Strings':'⟨⟩','Greedy':'⚡','Prefix Sum':'∫','Bit Manipulation':'⊕','Miscellaneous':'◉'
}

const APPROACH_TAGS = ['Two Pass','Single Pass','Divide & Conquer','Backtracking','BFS','DFS','Memoization','Tabulation','In-place','Monotonic Stack','Sentinel Node','Floyd\'s Cycle','KMP','Binary Lift','Union Find','Trie','Segment Tree','Coordinate Compress']
const TRICK_TAGS    = ['XOR trick','Complement','Pigeonhole','Prefix XOR','Gap method','Dutch Flag','Kadane\'s','Boyer-Moore','Fast & Slow','Merge Intervals','Bit masking','Math induction','Counting sort']

const LANG_META = {
  cpp:  { label:'C++',        color:'#60a5fa', glow:'rgba(96,165,250,0.15)',  icon:'⬡' },
  java: { label:'Java',       color:'#fb923c', glow:'rgba(251,146,60,0.15)',  icon:'☕' },
  py:   { label:'Python',     color:'#4ade80', glow:'rgba(74,222,128,0.15)',  icon:'🐍' },
  js:   { label:'JS',         color:'#facc15', glow:'rgba(250,204,21,0.12)',  icon:'⬡' },
  ts:   { label:'TS',         color:'#818cf8', glow:'rgba(129,140,248,0.15)', icon:'⬡' },
  c:    { label:'C',          color:'#94a3b8', glow:'rgba(148,163,184,0.12)', icon:'⬡' },
}

function getTopicForSlug(s) {
  for (const [t,slugs] of Object.entries(TOPIC_MAP)) if (slugs.some(x=>s.includes(x))) return t
  return 'Miscellaneous'
}
function langLabel(e)  { return LANG_META[e]?.label || e.toUpperCase() }
function langHL(e)     { return {cpp:'cpp',java:'java',js:'javascript',py:'python',ts:'typescript',c:'c'}[e]||'text' }
function langColor(e)  { return LANG_META[e]?.color || '#94a3b8' }
function langGlow(e)   { return LANG_META[e]?.glow  || 'rgba(148,163,184,0.12)' }
function langBg(e)     { return `${langColor(e)}14` }
function diffColor(d)  { const l=(d||'').toLowerCase(); return l==='easy'?'var(--easy)':l==='medium'?'var(--medium)':l==='hard'?'var(--hard)':'var(--text-sub)' }
function diffBg(d)     { const l=(d||'').toLowerCase(); return l==='easy'?'var(--easy-bg)':l==='medium'?'var(--medium-bg)':l==='hard'?'var(--hard-bg)':'transparent' }

function parseShas(stats) {
  const shas = stats?.leetcode?.shas || {}
  return Object.entries(shas)
    .filter(([,d]) => typeof d==='object' && d.difficulty)
    .map(([slug,d]) => {
      const m = slug.match(/^(\d+)/)
      if (!m) return null
      const id = parseInt(m[1],10)
      const title = slug.replace(/^\d+-/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())
      const langs = Object.keys(d).filter(k=>!['README.md','difficulty',''].includes(k)).map(k=>k.split('.').pop())
      return { id, slug, title, difficulty:d.difficulty, langs, topic:getTopicForSlug(slug) }
    })
    .filter(Boolean)
    .sort((a,b)=>a.id-b.id)
}

// ─── localStorage helpers ────────────────────────────────────────────────────
function ls(key,fb) { try{const v=localStorage.getItem(key); return v?JSON.parse(v):fb}catch{return fb} }
function lsSet(key,val) { try{localStorage.setItem(key,JSON.stringify(val))}catch{} }

// ─── CODE THEMES ─────────────────────────────────────────────────────────────
const darkCode = {
  'code[class*="language-"]': { color:'#cdd9e5', background:'none', fontFamily:'"Fira Code",monospace', fontSize:'13px', lineHeight:'1.8' },
  'comment':    { color:'#464f5a', fontStyle:'italic' },
  'keyword':    { color:'#c792ea' },
  'string':     { color:'#7ec8a4' },
  'number':     { color:'#f78c6c' },
  'function':   { color:'#82aaff' },
  'class-name': { color:'#ffcb6b' },
  'operator':   { color:'#89ddff' },
  'punctuation':{ color:'#445566' },
  'boolean':    { color:'#f07178' },
  'builtin':    { color:'#ffcb6b' },
  'variable':   { color:'#eeffff' },
}
const lightCode = {
  'code[class*="language-"]': { color:'#24292e', background:'none', fontFamily:'"Fira Code",monospace', fontSize:'13px', lineHeight:'1.8' },
  'comment':    { color:'#aaa', fontStyle:'italic' },
  'keyword':    { color:'#6f42c1' },
  'string':     { color:'#032f62' },
  'number':     { color:'#005cc5' },
  'function':   { color:'#6f42c1' },
  'class-name': { color:'#e36209' },
  'operator':   { color:'#d73a49' },
  'punctuation':{ color:'#9a9a9a' },
  'boolean':    { color:'#d73a49' },
  'builtin':    { color:'#e36209' },
  'variable':   { color:'#24292e' },
}

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
function GlobalStyles({ t }) {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Fira+Code:wght@400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

      *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

      :root {
        --bg:${t.bg}; --bg-card:${t.bgCard}; --bg-card-alt:${t.bgCardAlt};
        --bg-glass:${t.bgGlass}; --bg-glass-hover:${t.bgGlassHover};
        --border:${t.border}; --border-strong:${t.borderStrong};
        --text:${t.text}; --text-sub:${t.textSub}; --text-faint:${t.textFaint};
        --accent:${t.accent}; --accent-alt:${t.accentAlt}; --accent-glow:${t.accentGlow}; --accent-border:${t.accentBorder};
        --easy:${t.easy}; --easy-bg:${t.easyBg};
        --medium:${t.medium}; --medium-bg:${t.mediumBg};
        --hard:${t.hard}; --hard-bg:${t.hardBg};
        --code-bg:${t.codeBg};
        --font-display: 'Syne', sans-serif;
        --font-body:    'DM Sans', sans-serif;
        --font-mono:    'Fira Code', monospace;
      }

      html, body {
        background:var(--bg); color:var(--text);
        font-family:var(--font-body);
        min-height:100vh; -webkit-font-smoothing:antialiased;
        font-size:15px; line-height:1.6;
      }
      #root { min-height:100vh; position:relative; }
      #root::before {
        content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
        background:${t.gradHero};
      }

      ::selection { background:var(--accent-glow); color:var(--accent); }
      ::-webkit-scrollbar { width:4px; height:4px; }
      ::-webkit-scrollbar-track { background:transparent; }
      ::-webkit-scrollbar-thumb { background:var(--border-strong); border-radius:99px; }
      a { color:inherit; text-decoration:none; }

      /* ── ANIMATIONS ── */
      @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
      @keyframes scaleIn  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
      @keyframes slideRight { from{width:0} to{width:var(--w)} }
      @keyframes shimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      @keyframes pulse    { 0%,100%{opacity:1} 50%{opacity:0.35} }
      @keyframes spin     { to{transform:rotate(360deg)} }
      @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      @keyframes glow     { 0%,100%{box-shadow:0 0 12px var(--accent-glow)} 50%{box-shadow:0 0 28px var(--accent-glow)} }
      @keyframes borderPulse { 0%,100%{border-color:var(--border)} 50%{border-color:var(--accent-border)} }
      @keyframes countUp  { from{opacity:0;transform:translateY(8px) scale(0.9)} to{opacity:1;transform:translateY(0) scale(1)} }
      @keyframes barSlide { from{transform:scaleX(0);transform-origin:left} to{transform:scaleX(1);transform-origin:left} }

      .fade-up  { animation:fadeUp  0.4s cubic-bezier(0.16,1,0.3,1) both; }
      .fade-in  { animation:fadeIn  0.28s ease both; }
      .scale-in { animation:scaleIn 0.3s  cubic-bezier(0.16,1,0.3,1) both; }

      /* ── CARDS ── */
      .p-card {
        background:var(--bg-card); border:1px solid var(--border);
        border-radius:16px; padding:18px 22px; cursor:pointer;
        transition:transform 0.22s cubic-bezier(0.16,1,0.3,1),
                   box-shadow 0.22s cubic-bezier(0.16,1,0.3,1),
                   border-color 0.2s ease;
        position:relative; overflow:hidden;
      }
      .p-card::before {
        content:''; position:absolute; inset:0; border-radius:inherit;
        background:radial-gradient(ellipse 60% 60% at 15% 40%, var(--accent-glow), transparent);
        opacity:0; transition:opacity 0.35s ease; pointer-events:none;
      }
      .p-card:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(0,0,0,0.35),0 2px 8px rgba(0,0,0,0.2); border-color:var(--border-strong); }
      .p-card:hover::before { opacity:1; }
      .p-card.bookmarked::after { content:''; position:absolute; top:0;left:0;width:3px;height:100%;background:var(--accent);border-radius:16px 0 0 16px; }

      /* ── BUTTONS ── */
      .btn-ghost {
        display:inline-flex; align-items:center; gap:6px; padding:7px 14px;
        border-radius:10px; border:1px solid var(--border); background:var(--bg-glass);
        color:var(--text-sub); font-family:var(--font-body); font-size:13px; font-weight:500;
        cursor:pointer; transition:all 0.15s ease; white-space:nowrap;
      }
      .btn-ghost:hover { border-color:var(--border-strong); color:var(--text); background:var(--bg-glass-hover); }

      .btn-icon {
        width:34px; height:34px; border-radius:10px; border:1px solid var(--border);
        background:var(--bg-glass); cursor:pointer; display:flex; align-items:center;
        justify-content:center; color:var(--text-sub); transition:all 0.15s ease; flex-shrink:0;
      }
      .btn-icon:hover { border-color:var(--border-strong); color:var(--text); background:var(--bg-glass-hover); }
      .btn-icon.on { background:var(--accent-glow); border-color:var(--accent-border); color:var(--accent); }

      .filter-pill {
        padding:6px 13px; border-radius:99px; font-size:12px; font-weight:500;
        cursor:pointer; border:1px solid var(--border); background:var(--bg-glass);
        color:var(--text-sub); transition:all 0.15s ease; white-space:nowrap; font-family:var(--font-body);
      }
      .filter-pill:hover:not([data-on="true"]) { border-color:var(--border-strong); color:var(--text); }
      .filter-pill[data-diff="easy"][data-on="true"]   { background:var(--easy-bg);   color:var(--easy);   border-color:var(--easy); }
      .filter-pill[data-diff="medium"][data-on="true"] { background:var(--medium-bg); color:var(--medium); border-color:var(--medium); }
      .filter-pill[data-diff="hard"][data-on="true"]   { background:var(--hard-bg);   color:var(--hard);   border-color:var(--hard); }
      .filter-pill[data-diff="all"][data-on="true"]    { background:var(--accent-glow);color:var(--accent);border-color:var(--accent-border); }

      /* ── SEARCH ── */
      .search-wrap { position:relative; }
      .search-wrap svg { position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--text-sub); }
      .search-input {
        width:100%; padding:10px 14px 10px 38px; background:var(--bg-card);
        border:1px solid var(--border); border-radius:11px; color:var(--text);
        font-family:var(--font-body); font-size:14px; outline:none;
        transition:border-color 0.15s,box-shadow 0.15s;
      }
      .search-input::placeholder { color:var(--text-sub); }
      .search-input:focus { border-color:var(--accent-border); box-shadow:0 0 0 3px var(--accent-glow); }

      /* ── SELECTS ── */
      .sel {
        padding:8px 12px; background:var(--bg-card); border:1px solid var(--border);
        border-radius:10px; color:var(--text); font-size:12.5px; cursor:pointer;
        outline:none; font-family:var(--font-body); transition:border-color 0.15s;
        appearance:none; padding-right:28px;
      }
      .sel:focus { border-color:var(--accent-border); }

      /* ── SKELETON ── */
      .skeleton {
        background:linear-gradient(90deg, var(--border) 25%, var(--border-strong) 50%, var(--border) 75%);
        background-size:200% 100%; animation:shimmer 1.5s infinite; border-radius:6px;
      }

      /* ── TABS ── */
      .tab-pill {
        padding:6px 15px; border-radius:8px; font-size:12px; font-weight:500;
        font-family:var(--font-mono); cursor:pointer; border:1px solid transparent;
        transition:all 0.15s ease; letter-spacing:0.02em;
      }
      .tab-pill.on  { background:var(--accent); color:#fff; border-color:var(--accent); }
      .tab-pill:not(.on) { background:var(--bg-glass); color:var(--text-sub); border-color:var(--border); }
      .tab-pill:not(.on):hover { border-color:var(--border-strong); color:var(--text); background:var(--bg-glass-hover); }

      /* ── NAV TABS ── */
      .nav-tab {
        padding:10px 18px; font-size:13.5px; font-weight:500; font-family:var(--font-display);
        cursor:pointer; background:none; border:none; border-bottom:2px solid transparent;
        color:var(--text-sub); transition:all 0.15s ease; margin-bottom:-1px; letter-spacing:0.01em;
      }
      .nav-tab.on { color:var(--accent); border-bottom-color:var(--accent); }
      .nav-tab:hover:not(.on) { color:var(--text); }

      /* ── TOPIC CHIP ── */
      .topic-chip {
        display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:6px;
        font-size:10px;font-weight:600;background:var(--accent-glow);color:var(--accent);
        border:1px solid var(--accent-border);font-family:var(--font-mono);
        letter-spacing:0.03em;white-space:nowrap;
      }

      /* ── CMD PALETTE ── */
      .cmd-overlay {
        position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(12px);
        -webkit-backdrop-filter:blur(12px);z-index:999;display:flex;align-items:flex-start;
        justify-content:center;padding-top:14vh;animation:fadeIn 0.15s ease;
      }
      .cmd-box {
        width:580px;max-width:calc(100vw - 24px);background:var(--bg-card);
        border:1px solid var(--border-strong);border-radius:18px;overflow:hidden;
        box-shadow:0 32px 80px rgba(0,0,0,0.7),0 0 0 1px var(--accent-border);
        animation:scaleIn 0.2s cubic-bezier(0.16,1,0.3,1);
      }
      .cmd-row { padding:11px 18px;display:flex;align-items:center;gap:11px;cursor:pointer;transition:background 0.1s; }
      .cmd-row:hover,.cmd-row.sel { background:var(--bg-glass-hover); }

      /* ── INSIGHTS ── */
      .ins-grid { display:grid; grid-template-columns:280px 1fr; gap:20px; }
      @media(max-width:900px) { .ins-grid { grid-template-columns:1fr; } }

      .ins-card {
        background:var(--bg-card); border:1px solid var(--border); border-radius:18px;
        padding:22px 24px; position:relative; overflow:hidden;
      }
      .ins-card-title {
        font-family:var(--font-mono); font-size:10px; font-weight:600; color:var(--text-sub);
        text-transform:uppercase; letter-spacing:0.1em; margin-bottom:18px;
        padding-bottom:12px; border-bottom:1px solid var(--border);
        display:flex; align-items:center; gap:8px;
      }

      .hero-stat {
        font-family:var(--font-display); font-weight:800; line-height:1;
        animation:countUp 0.6s cubic-bezier(0.16,1,0.3,1) both;
      }

      .anim-bar {
        height:100%; border-radius:99px;
        animation:barSlide 0.8s cubic-bezier(0.16,1,0.3,1) both;
        animation-delay:var(--d,0ms); width:var(--w);
      }

      .trophy-card {
        background:var(--hard-bg); border:1px solid var(--hard);
        border-radius:10px; padding:10px 14px; cursor:pointer;
        transition:transform 0.2s,box-shadow 0.2s; position:relative; overflow:hidden;
      }
      .trophy-card::before {
        content:''; position:absolute; inset:0;
        background:radial-gradient(ellipse at 50% 0%, rgba(248,113,113,0.15), transparent 70%);
        pointer-events:none;
      }
      .trophy-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(248,113,113,0.2); }

      .radial-ring { transform-origin:center; transform:rotate(-90deg); }

      /* ── README ── */
      .readme h1,.readme h2,.readme h3 { font-family:var(--font-display);color:var(--text);line-height:1.3; }
      .readme h1{font-size:20px;font-weight:700;margin:1.5em 0 .5em}
      .readme h2{font-size:16px;font-weight:600;margin:1.4em 0 .45em}
      .readme h3{font-size:14px;font-weight:600;margin:1.3em 0 .4em}
      .readme p{color:var(--text);line-height:1.82;margin-bottom:1em;font-size:14px}
      .readme a{color:var(--accent)}.readme a:hover{text-decoration:underline}
      .readme code{font-family:var(--font-mono);font-size:12px;background:var(--code-bg);border:1px solid var(--border);padding:1px 5px;border-radius:4px;color:var(--accent)}
      .readme pre{background:var(--code-bg);border:1px solid var(--border);border-radius:12px;padding:16px;overflow-x:auto;margin-bottom:1em}
      .readme pre code{background:none;border:none;padding:0;color:var(--text);font-size:12px}
      .readme ul,.readme ol{padding-left:1.5em;margin-bottom:1em;font-size:14px;line-height:1.82;color:var(--text)}
      .readme strong{color:var(--text);font-weight:600}
      .readme em{color:var(--text-sub)}
      .readme hr{border:none;border-top:1px solid var(--border);margin:1.5em 0}
      .readme table{width:100%;border-collapse:collapse;margin-bottom:1em;font-size:13px}
      .readme th{background:var(--bg-glass);padding:8px 12px;text-align:left;border:1px solid var(--border);font-weight:600}
      .readme td{padding:8px 12px;border:1px solid var(--border)}
      .readme blockquote{border-left:3px solid var(--accent-border);padding-left:14px;color:var(--text-sub);font-style:italic;margin-bottom:1em}

      /* ── LIST VIEW ── */
      .list-card { padding:11px 18px!important; border-radius:11px!important; }

      /* ── CONFIDENCE STARS ── */
      .star { cursor:pointer; transition:transform 0.15s,opacity 0.15s; display:inline-block; }
      .star:hover { transform:scale(1.3); }

      /* ── REVISION BADGE ── */
      .rev-badge {
        display:inline-flex;align-items:center;gap:4px;padding:2px 8px;
        border-radius:5px;font-size:10px;font-weight:700;font-family:var(--font-mono);
        animation:borderPulse 2s infinite;
      }

      /* ── TAG CHIP ── */
      .tag-chip {
        display:inline-flex;align-items:center;padding:3px 8px;border-radius:5px;
        font-size:10px;font-weight:600;font-family:var(--font-mono);cursor:pointer;
        border:1px solid transparent;transition:all 0.15s;white-space:nowrap;
      }
    `}</style>
  )
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ theme, toggleTheme, stats, onCmdOpen }) {
  const total = stats?.leetcode?.solved || 0
  return (
    <nav style={{ position:'sticky',top:0,zIndex:100, background:theme==='dark'?'rgba(5,5,10,0.86)':'rgba(247,245,242,0.86)', backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)', borderBottom:'1px solid var(--border)' }}>
      <div style={{ maxWidth:1280,margin:'0 auto',padding:'0 28px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <Link to="/" style={{ display:'flex',alignItems:'center',gap:12 }}>
          <div style={{ width:30,height:30,borderRadius:9,background:'linear-gradient(135deg, var(--accent), var(--accent-alt))',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 16px var(--accent-glow)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:16,letterSpacing:'-0.02em',lineHeight:1 }}>Taha's DSA Dashboard</div>
            <div style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-sub)',letterSpacing:'0.06em' }}>PERSONAL ARCHIVE</div>
          </div>
        </Link>
        <div style={{ display:'flex',alignItems:'center',gap:10 }}>
          {stats && (
            <div style={{ display:'flex',alignItems:'center',gap:5 }}>
              {[['E',stats.leetcode?.easy,'var(--easy)'],['M',stats.leetcode?.medium,'var(--medium)'],['H',stats.leetcode?.hard,'var(--hard)']].map(([l,v,c])=>(
                <div key={l} style={{ padding:'4px 8px',borderRadius:6,background:'var(--bg-glass)',border:'1px solid var(--border)',fontFamily:'var(--font-mono)',fontSize:11,display:'flex',gap:4,alignItems:'center' }}>
                  <span style={{ color:c,fontWeight:700 }}>{l}</span><span style={{ color:'var(--text-sub)' }}>{v||0}</span>
                </div>
              ))}
              <div style={{ width:1,height:18,background:'var(--border)',margin:'0 4px' }}/>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:13,color:'var(--accent)' }}>{total}</div>
            </div>
          )}
          <button className="btn-icon" onClick={onCmdOpen} title="⌘K">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="1.5" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="1.5" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><rect x="1.5" y="8" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/><rect x="8" y="8" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/></svg>
          </button>
    <a href="https://tahaportfolio.pages.dev" target="_blank" rel="noopener noreferrer"
  title="My Portfolio"
  className="btn-icon">
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 11L11 3M11 3H6.5M11 3V7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</a>
          <button className="btn-icon" onClick={toggleTheme}>
            {theme==='dark'
              ? <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M2.93 2.93l1.41 1.41M10.66 10.66l1.41 1.41M2.93 12.07l1.41-1.41M10.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              : <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M13 8.3A5.5 5.5 0 1 1 6.7 2a4.2 4.2 0 0 0 6.3 6.3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
            }
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── CMD PALETTE ─────────────────────────────────────────────────────────────
function CmdPalette({ problems, onClose }) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const navigate = useNavigate()
  const ref = useRef(null)
  useEffect(()=>{ ref.current?.focus() },[])
  const results = useMemo(()=>
    q.trim() ? problems.filter(p=>p.title.toLowerCase().includes(q.toLowerCase())||String(p.id).includes(q)||p.topic.toLowerCase().includes(q.toLowerCase())).slice(0,9)
             : problems.slice(0,9)
  ,[q,problems])
  useEffect(()=>setSel(0),[q])
  function go(p){ navigate(`/problem/${p.slug}`); onClose() }
  function onKey(e){
    if(e.key==='Escape') onClose()
    if(e.key==='ArrowDown') setSel(s=>Math.min(s+1,results.length-1))
    if(e.key==='ArrowUp')   setSel(s=>Math.max(s-1,0))
    if(e.key==='Enter'&&results[sel]) go(results[sel])
  }
  return (
    <div className="cmd-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="cmd-box">
        <div style={{ padding:'14px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:10 }}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ color:'var(--text-sub)',flexShrink:0 }}><circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)} onKeyDown={onKey} placeholder="Jump to any problem, topic…" style={{ flex:1,background:'none',border:'none',outline:'none',color:'var(--text)',fontSize:15,fontFamily:'var(--font-body)' }}/>
          <kbd style={{ padding:'2px 7px',borderRadius:5,border:'1px solid var(--border)',fontSize:10,color:'var(--text-sub)',fontFamily:'var(--font-mono)' }}>ESC</kbd>
        </div>
        <div style={{ maxHeight:380,overflowY:'auto' }}>
          {results.map((p,i)=>(
            <div key={p.slug} className={`cmd-row${i===sel?' sel':''}`} onClick={()=>go(p)}>
              <span style={{ fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-faint)',width:38,flexShrink:0 }}>#{String(p.id).padStart(4,'0')}</span>
              <span style={{ flex:1,fontSize:14,fontFamily:'var(--font-display)',fontWeight:500 }}>{p.title}</span>
              <span className="topic-chip" style={{ fontSize:9 }}>{p.topic}</span>
              <span style={{ fontSize:10,fontWeight:700,color:diffColor(p.difficulty),background:diffBg(p.difficulty),padding:'2px 8px',borderRadius:5,textTransform:'capitalize',fontFamily:'var(--font-mono)' }}>{p.difficulty}</span>
            </div>
          ))}
          {!results.length && <div style={{ padding:'40px 18px',textAlign:'center',color:'var(--text-sub)',fontSize:13 }}>Nothing found</div>}
        </div>
        <div style={{ padding:'9px 18px',borderTop:'1px solid var(--border)',display:'flex',gap:14,fontSize:10,color:'var(--text-sub)',fontFamily:'var(--font-mono)' }}>
          <span>↑↓ navigate</span><span>↵ open</span><span>esc dismiss</span>
        </div>
      </div>
    </div>
  )
}

// ─── INSIGHTS ────────────────────────────────────────────────────────────────
function RadialProgress({ value, max, color, size=80, strokeW=8, label }) {
  const r = (size-strokeW*2)/2
  const circ = 2*Math.PI*r
  const pct = max>0 ? value/max : 0
  return (
    <div style={{ position:'relative',width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center' }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)',position:'absolute' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={strokeW}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={`${pct*circ} ${circ}`} strokeLinecap="round"
          style={{ transition:'stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)' }}/>
      </svg>
      <div style={{ textAlign:'center',lineHeight:1 }}>
        <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:size>60?20:14,color }}>{value}</div>
        {label&&<div style={{ fontFamily:'var(--font-mono)',fontSize:8,color:'var(--text-sub)',marginTop:2 }}>{label}</div>}
      </div>
    </div>
  )
}

function AnimBar({ pct, color, delay=0, h=6 }) {
  return (
    <div style={{ flex:1,height:h,borderRadius:99,background:'var(--bg-glass)',overflow:'hidden' }}>
      <div className="anim-bar" style={{ '--w':`${Math.max(pct,0)}%`,'--d':`${delay}ms`,background:color,height:'100%' }}/>
    </div>
  )
}

function InsightsPanel({ stats, problems, bookmarks }) {
  const total = problems.length
  const easy   = problems.filter(p=>p.difficulty==='easy').length
  const medium = problems.filter(p=>p.difficulty==='medium').length
  const hard   = problems.filter(p=>p.difficulty==='hard').length

  const langCounts = {}
  problems.forEach(p=>p.langs.forEach(l=>{langCounts[l]=(langCounts[l]||0)+1}))
  const sortedLangs = Object.entries(langCounts).sort((a,b)=>b[1]-a[1])
  const maxLang = sortedLangs[0]?.[1]||1

  const topicCounts = {}
  const topicDiff = {}
  problems.forEach(p=>{
    topicCounts[p.topic]=(topicCounts[p.topic]||0)+1
    if(!topicDiff[p.topic]) topicDiff[p.topic]={easy:0,medium:0,hard:0}
    topicDiff[p.topic][p.difficulty]=(topicDiff[p.topic][p.difficulty]||0)+1
  })
  const sortedTopics = Object.entries(topicCounts).sort((a,b)=>b[1]-a[1])

  // lang preference per topic
  const topicLangPref = {}
  problems.forEach(p=>{
    if(!topicLangPref[p.topic]) topicLangPref[p.topic]={}
    p.langs.forEach(l=>{topicLangPref[p.topic][l]=(topicLangPref[p.topic][l]||0)+1})
  })
  const topTopicLang = Object.fromEntries(
    Object.entries(topicLangPref).map(([t,lc])=>[t,Object.entries(lc).sort((a,b)=>b[1]-a[1])[0]?.[0]])
  )

  const multiLang  = problems.filter(p=>p.langs.length>=2)
  const triLang    = problems.filter(p=>p.langs.length>=3)
  const hardProbs  = problems.filter(p=>p.difficulty==='hard')
  const avgLangs   = total>0 ? (problems.reduce((s,p)=>s+p.langs.length,0)/total).toFixed(1) : 0
  const uniqueLangs = sortedLangs.length

  // ID gap analysis — find ranges of missing hundreds
  const ids = new Set(problems.map(p=>p.id))
  const maxId = Math.max(...ids)
  const gaps = []
  for(let h=0; h<=Math.floor(maxId/100); h++){
    const start=h*100+1, end=(h+1)*100
    const count = problems.filter(p=>p.id>=start&&p.id<=end).length
    if(count>0) gaps.push({ range:`${start}–${end}`, count, total:100 })
  }

  const [hoveredTopic, setHoveredTopic] = useState(null)

  return (
    <div style={{ display:'flex',flexDirection:'column',gap:20 }}>

      {/* ── HERO ROW ── */}
      <div style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:20,padding:'28px 28px',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 60% 80% at 80% 50%, var(--accent-glow), transparent)',pointerEvents:'none' }}/>
        <div style={{ position:'absolute',top:16,right:24,fontFamily:'var(--font-display)',fontSize:'clamp(60px,10vw,110px)',fontWeight:800,color:'var(--text-faint)',lineHeight:1,userSelect:'none' }}>{total}</div>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-sub)',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:10 }}>Archive Overview</div>
        <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:'clamp(24px,4vw,38px)',lineHeight:1.1,letterSpacing:'-0.02em',marginBottom:6 }}>
          {total} problems solved
        </div>
        <div style={{ fontSize:14,color:'var(--text-sub)',fontFamily:'var(--font-body)',fontWeight:300,marginBottom:24 }}>
          across {uniqueLangs} languages · {sortedTopics.length} topics · avg {avgLangs} langs/problem
        </div>
        <div style={{ display:'flex',gap:20,flexWrap:'wrap',alignItems:'center' }}>
          <RadialProgress value={easy}   max={total} color="var(--easy)"   size={76} strokeW={7} label="EASY"/>
          <RadialProgress value={medium} max={total} color="var(--medium)" size={76} strokeW={7} label="MED"/>
          <RadialProgress value={hard}   max={total} color="var(--hard)"   size={76} strokeW={7} label="HARD"/>
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {[['Easy',easy,'var(--easy)'],['Medium',medium,'var(--medium)'],['Hard',hard,'var(--hard)']].map(([l,v,c],i)=>(
              <div key={l} style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span style={{ fontSize:12,color:c,fontWeight:600,fontFamily:'var(--font-display)',width:48 }}>{l}</span>
                <AnimBar pct={total>0?(v/total)*100:0} color={c} delay={i*100} h={5}/>
                <span style={{ fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-sub)',width:28,textAlign:'right' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ins-grid">
        {/* ── LEFT COLUMN ── */}
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>

          {/* Quick Stats */}
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:10 }}>
            {[
              { v:total,     l:'Total',       c:'var(--accent)',     s:'problems archived' },
              { v:hard,      l:'Hard',         c:'var(--hard)',       s:`${total>0?Math.round(hard/total*100):0}% of archive` },
              { v:multiLang.length, l:'Multi-Lang', c:'var(--medium)',     s:'solved in 2+ langs' },
              { v:bookmarks.size,   l:'Bookmarked', c:'var(--easy)',       s:'saved for revision' },
            ].map((s,i)=>(
              <div key={s.l} style={{ padding:'14px 16px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,animation:`countUp 0.5s cubic-bezier(0.16,1,0.3,1) ${i*80}ms both` }}>
                <div className="hero-stat" style={{ fontSize:28,color:s.c }}>{s.v}</div>
                <div style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:11,color:'var(--text)',marginTop:4,textTransform:'uppercase',letterSpacing:'0.05em' }}>{s.l}</div>
                <div style={{ fontSize:10,color:'var(--text-sub)',marginTop:2,fontFamily:'var(--font-body)' }}>{s.s}</div>
              </div>
            ))}
          </div>

          {/* Language Mastery */}
          <div className="ins-card">
            <div className="ins-card-title">
              <span style={{ fontSize:14 }}>⟨/⟩</span> Language Mastery
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:11 }}>
              {sortedLangs.map(([lang,count],i)=>(
                <div key={lang} style={{ display:'flex',alignItems:'center',gap:10 }}>
                  <div style={{ width:7,height:7,borderRadius:'50%',background:langColor(lang),flexShrink:0,boxShadow:`0 0 6px ${langGlow(lang)}` }}/>
                  <span style={{ fontSize:12,fontWeight:600,fontFamily:'var(--font-display)',width:72,flexShrink:0 }}>{langLabel(lang)}</span>
                  <AnimBar pct={(count/maxLang)*100} color={langColor(lang)} delay={i*70} h={5}/>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:11,color:'var(--text-sub)',width:26,textAlign:'right',flexShrink:0 }}>{count}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop:16,paddingTop:12,borderTop:'1px solid var(--border)',display:'flex',flexDirection:'column',gap:5 }}>
              {[
                ['Avg langs/problem', avgLangs, 'var(--accent)'],
                ['3+ language solutions', triLang.length, 'var(--medium)'],
                ['Unique languages', uniqueLangs, 'var(--easy)'],
              ].map(([label,val,color])=>(
                <div key={label} style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                  <span style={{ fontSize:12,color:'var(--text-sub)' }}>{label}</span>
                  <span style={{ fontFamily:'var(--font-mono)',fontWeight:700,fontSize:13,color }}>{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ID Coverage */}
          <div className="ins-card">
            <div className="ins-card-title">
              <span style={{ fontSize:13 }}>◈</span> Problem ID Coverage
            </div>
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {gaps.slice(0,8).map(({range,count})=>(
                <div key={range} style={{ display:'flex',alignItems:'center',gap:8 }}>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-sub)',width:66,flexShrink:0 }}>{range}</span>
                  <AnimBar pct={(count/gaps.reduce((m,g)=>Math.max(m,g.count),0))*100} color="var(--accent)" h={5}/>
                  <span style={{ fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-sub)',width:18,textAlign:'right' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display:'flex',flexDirection:'column',gap:16 }}>

          {/* Topic Depth */}
          <div className="ins-card">
            <div className="ins-card-title"><span style={{ fontSize:13 }}>⟁</span> Topic Depth — difficulty mix</div>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {sortedTopics.map(([topic,count],i)=>{
                const d = topicDiff[topic]||{}
                const prefLang = topTopicLang[topic]
                const isHovered = hoveredTopic===topic
                return (
                  <div key={topic} onMouseEnter={()=>setHoveredTopic(topic)} onMouseLeave={()=>setHoveredTopic(null)}
                    style={{ padding:'8px 10px',borderRadius:10,border:'1px solid',borderColor:isHovered?'var(--border-strong)':'transparent',background:isHovered?'var(--bg-glass)':'transparent',transition:'all 0.15s',cursor:'default' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <span style={{ fontSize:14,width:20,textAlign:'center',flexShrink:0 }}>{TOPIC_ICONS[topic]||'◉'}</span>
                      <span style={{ fontSize:13,fontFamily:'var(--font-display)',fontWeight:500,width:150,flexShrink:0 }}>{topic}</span>
                      <div style={{ flex:1,display:'flex',height:8,borderRadius:99,overflow:'hidden',gap:1 }}>
                        {d.easy>0&&<div style={{ width:`${(d.easy/count)*100}%`,background:'var(--easy)',height:'100%',borderRadius:'99px 0 0 99px',transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}/>}
                        {d.medium>0&&<div style={{ width:`${(d.medium/count)*100}%`,background:'var(--medium)',height:'100%',transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}/>}
                        {d.hard>0&&<div style={{ width:`${(d.hard/count)*100}%`,background:'var(--hard)',height:'100%',borderRadius:'0 99px 99px 0',transition:'width 0.8s cubic-bezier(0.16,1,0.3,1)' }}/>}
                      </div>
                      <div style={{ display:'flex',gap:3,flexShrink:0 }}>
                        {d.easy>0&&<span style={{ fontSize:9,padding:'1px 5px',borderRadius:3,background:'var(--easy-bg)',color:'var(--easy)',fontFamily:'var(--font-mono)',fontWeight:700 }}>{d.easy}E</span>}
                        {d.medium>0&&<span style={{ fontSize:9,padding:'1px 5px',borderRadius:3,background:'var(--medium-bg)',color:'var(--medium)',fontFamily:'var(--font-mono)',fontWeight:700 }}>{d.medium}M</span>}
                        {d.hard>0&&<span style={{ fontSize:9,padding:'1px 5px',borderRadius:3,background:'var(--hard-bg)',color:'var(--hard)',fontFamily:'var(--font-mono)',fontWeight:700 }}>{d.hard}H</span>}
                      </div>
                    </div>
                    {isHovered && prefLang && (
                      <div style={{ marginTop:6,paddingLeft:34,display:'flex',alignItems:'center',gap:6 }}>
                        <span style={{ fontSize:10,color:'var(--text-sub)',fontFamily:'var(--font-body)' }}>Preferred lang:</span>
                        <span style={{ fontSize:10,fontWeight:700,color:langColor(prefLang),fontFamily:'var(--font-mono)',background:langBg(prefLang),padding:'1px 6px',borderRadius:4 }}>{langLabel(prefLang)}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cross-Language Fluency */}
          {multiLang.length>0 && (
            <div className="ins-card">
              <div className="ins-card-title"><span style={{ fontSize:13 }}>⇆</span> Cross-Language Fluency <span style={{ marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--accent)' }}>{multiLang.length} problems</span></div>
              <p style={{ fontSize:12,color:'var(--text-sub)',marginBottom:14,lineHeight:1.65,fontFamily:'var(--font-body)' }}>Problems solved in 2+ languages — proof of genuine multi-language fluency</p>
              <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
                {multiLang.slice(0,8).map(p=>(
                  <Link key={p.slug} to={`/problem/${p.slug}`} style={{ display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:9,border:'1px solid var(--border)',background:'var(--bg-glass)',transition:'all 0.15s' }}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-strong)';e.currentTarget.style.background='var(--bg-glass-hover)'}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.background='var(--bg-glass)'}}>
                    <span style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-faint)',width:34,flexShrink:0 }}>#{String(p.id).padStart(4,'0')}</span>
                    <span style={{ flex:1,fontSize:13,fontFamily:'var(--font-display)',fontWeight:500 }}>{p.title}</span>
                    <span style={{ fontSize:10,fontWeight:700,color:diffColor(p.difficulty),background:diffBg(p.difficulty),padding:'2px 7px',borderRadius:4,textTransform:'capitalize',fontFamily:'var(--font-mono)',flexShrink:0 }}>{p.difficulty}</span>
                    <div style={{ display:'flex',gap:3,flexShrink:0 }}>
                      {p.langs.map(l=>(
                        <span key={l} style={{ fontSize:9,padding:'2px 6px',borderRadius:4,background:langBg(l),color:langColor(l),fontFamily:'var(--font-mono)',fontWeight:700,boxShadow:`0 0 6px ${langGlow(l)}` }}>{langLabel(l)}</span>
                      ))}
                    </div>
                  </Link>
                ))}
                {multiLang.length>8&&<div style={{ fontSize:11,color:'var(--text-sub)',paddingLeft:12,fontFamily:'var(--font-mono)' }}>+{multiLang.length-8} more</div>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TROPHY SHELF ── */}
      {hardProbs.length>0&&(
        <div className="ins-card">
          <div className="ins-card-title">
            <span style={{ fontSize:15 }}>🏆</span> Hard Problems Trophy Shelf
            <span style={{ marginLeft:'auto',fontFamily:'var(--font-mono)',fontSize:10,color:'var(--hard)' }}>{hardProbs.length} conquered</span>
          </div>
          <p style={{ fontSize:12,color:'var(--text-sub)',marginBottom:16,lineHeight:1.65,fontFamily:'var(--font-body)' }}>Every hard problem you've tackled — wear them like badges</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10 }}>
            {hardProbs.map((p,i)=>(
              <Link key={p.slug} to={`/problem/${p.slug}`}
                className="trophy-card"
                style={{ animationDelay:`${i*30}ms` }}>
                <div style={{ display:'flex',alignItems:'flex-start',gap:8 }}>
                  <div style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--hard)',opacity:0.6,marginTop:1,flexShrink:0 }}>#{String(p.id).padStart(4,'0')}</div>
                  <div>
                    <div style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,color:'var(--hard)',lineHeight:1.3,marginBottom:5 }}>{p.title}</div>
                    <div style={{ display:'flex',gap:3,flexWrap:'wrap' }}>
                      {p.langs.map(l=>(
                        <span key={l} style={{ fontSize:9,padding:'1px 5px',borderRadius:3,background:langBg(l),color:langColor(l),fontFamily:'var(--font-mono)',fontWeight:600 }}>{langLabel(l)}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── PROBLEM CARD ─────────────────────────────────────────────────────────────
function ProblemCard({ problem, index, viewMode, bookmarks, onToggleBookmark, confidence, onSetConfidence, revQueue, onToggleRev }) {
  const navigate = useNavigate()
  const isBookmarked = bookmarks.has(problem.slug)
  const conf = confidence[problem.slug] || 0
  const inRev = revQueue.has(problem.slug)
  function sp(fn){ return e=>{e.stopPropagation();fn()} }

  if(viewMode==='list'){
    return (
      <div className={`p-card list-card fade-in${isBookmarked?' bookmarked':''}`}
        style={{ animationDelay:`${Math.min(index*18,200)}ms`,display:'flex',alignItems:'center',gap:14 }}
        onClick={()=>navigate(`/problem/${problem.slug}`)}>
        <span style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-faint)',width:38,flexShrink:0 }}>#{String(problem.id).padStart(4,'0')}</span>
        <span style={{ fontSize:10,fontWeight:700,color:diffColor(problem.difficulty),background:diffBg(problem.difficulty),padding:'2px 8px',borderRadius:4,textTransform:'capitalize',width:58,textAlign:'center',flexShrink:0,fontFamily:'var(--font-mono)' }}>{problem.difficulty}</span>
        <span style={{ flex:1,fontFamily:'var(--font-display)',fontWeight:500,fontSize:14 }}>{problem.title}</span>
        <span className="topic-chip" style={{ fontSize:9 }}>{problem.topic}</span>
        <div style={{ display:'flex',gap:3 }}>
          {problem.langs.map(l=>(
            <span key={l} style={{ fontSize:9,fontWeight:700,color:langColor(l),background:langBg(l),padding:'1px 5px',borderRadius:3,fontFamily:'var(--font-mono)' }}>{langLabel(l)}</span>
          ))}
        </div>
        {conf>0&&<div style={{ display:'flex',gap:1 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:10,opacity:s<=conf?1:0.2 }}>★</span>)}</div>}
        {inRev&&<span className="rev-badge" style={{ background:'var(--medium-bg)',color:'var(--medium)',border:'1px solid var(--medium)' }}>📌 DUE</span>}
        <button onClick={sp(()=>onToggleBookmark(problem.slug))} className={`btn-icon${isBookmarked?' on':''}`} style={{ width:28,height:28,borderRadius:7,flexShrink:0 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill={isBookmarked?'currentColor':'none'}><path d="M2 1.5h7v9L5.5 8.5 2 10.5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
        </button>
      </div>
    )
  }

  return (
    <div className={`p-card fade-up${isBookmarked?' bookmarked':''}`}
      style={{ animationDelay:`${Math.min(index*28,320)}ms` }}
      onClick={()=>navigate(`/problem/${problem.slug}`)}>
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10 }}>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:6,marginBottom:8,flexWrap:'wrap' }}>
            <span style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-faint)',fontWeight:500 }}>#{String(problem.id).padStart(4,'0')}</span>
            <span style={{ fontSize:10,fontWeight:700,color:diffColor(problem.difficulty),background:diffBg(problem.difficulty),padding:'2px 8px',borderRadius:4,textTransform:'capitalize',fontFamily:'var(--font-mono)' }}>{problem.difficulty}</span>
            <span className="topic-chip" style={{ fontSize:9 }}>{TOPIC_ICONS[problem.topic]||'◉'} {problem.topic}</span>
            {inRev&&<span className="rev-badge" style={{ background:'var(--medium-bg)',color:'var(--medium)',border:'1px solid var(--medium)',fontSize:9 }}>📌</span>}
          </div>
          <div style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:14,lineHeight:1.3,marginBottom:10 }}>{problem.title}</div>
          <div style={{ display:'flex',gap:4,flexWrap:'wrap',alignItems:'center' }}>
            {problem.langs.map(l=>(
              <span key={l} style={{ fontSize:9,fontWeight:700,color:langColor(l),background:langBg(l),border:`1px solid ${langColor(l)}22`,padding:'2px 6px',borderRadius:4,fontFamily:'var(--font-mono)',boxShadow:`0 0 6px ${langGlow(l)}` }}>{langLabel(l)}</span>
            ))}
            {conf>0&&(
              <div style={{ display:'flex',gap:1,marginLeft:4 }}>
                {[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:10,color:'var(--medium)',opacity:s<=conf?1:0.2 }}>★</span>)}
              </div>
            )}
          </div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:5,flexShrink:0 }}>
          <button onClick={sp(()=>onToggleBookmark(problem.slug))} className={`btn-icon${isBookmarked?' on':''}`}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill={isBookmarked?'currentColor':'none'}><path d="M2 1.5h7v9L5.5 8.5 2 10.5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={sp(()=>onToggleRev(problem.slug))} className={`btn-icon${inRev?' on':''}`} title="Add to revision queue">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v4.5L8 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
const ALL_TOPICS = Object.keys(TOPIC_MAP).concat(['Miscellaneous'])

function HomePage({ stats, problems, loading, bookmarks, onToggleBookmark, confidence, onSetConfidence, revQueue, onToggleRev }) {
  const [search,  setSearch]  = useState('')
  const [diff,    setDiff]    = useState('all')
  const [topic,   setTopic]   = useState('all')
  const [lang,    setLang]    = useState('all')
  const [sort,    setSort]    = useState('id')
  const [view,    setView]    = useState('grid')
  const [tab,     setTab]     = useState('problems')
  const navigate = useNavigate()

  const allLangs = useMemo(()=>[...new Set(problems.flatMap(p=>p.langs))],[problems])
  const dueTodayCount = revQueue.size

  const filtered = useMemo(()=>
    problems
      .filter(p=>{
        const mS = p.title.toLowerCase().includes(search.toLowerCase())||String(p.id).includes(search)
        const mD = diff==='all'||p.difficulty.toLowerCase()===diff
        const mT = topic==='all'||p.topic===topic
        const mL = lang==='all'||p.langs.includes(lang)
        const mB = diff!=='bookmarked'||bookmarks.has(p.slug)
        const mR = diff!=='revision'||revQueue.has(p.slug)
        return mS&&mD&&mT&&mL&&mB&&mR
      })
      .sort((a,b)=>{
        if(sort==='id') return a.id-b.id
        if(sort==='title') return a.title.localeCompare(b.title)
        if(sort==='difficulty') return ({easy:0,medium:1,hard:2}[a.difficulty]||0)-({easy:0,medium:1,hard:2}[b.difficulty]||0)
        if(sort==='langs') return b.langs.length-a.langs.length
        if(sort==='topic') return a.topic.localeCompare(b.topic)
        if(sort==='confidence') return (confidence[b.slug]||0)-(confidence[a.slug]||0)
        return 0
      })
  ,[problems,search,diff,topic,lang,sort,bookmarks,revQueue,confidence])

  const grouped = useMemo(()=>{
    if(sort!=='topic') return null
    const g={}; filtered.forEach(p=>{if(!g[p.topic])g[p.topic]=[]; g[p.topic].push(p)}); return g
  },[filtered,sort])

  return (
    <div style={{ maxWidth:1280,margin:'0 auto',padding:'44px 28px 100px',position:'relative',zIndex:1 }}>

      {/* ── HERO ── */}
      <div className="fade-up" style={{ marginBottom:40 }}>
        <div style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',gap:20,flexWrap:'wrap' }}>
          <div>
            <div style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'5px 12px',background:'var(--accent-glow)',border:'1px solid var(--accent-border)',borderRadius:6,marginBottom:16 }}>
              <div style={{ width:6,height:6,borderRadius:'50%',background:'var(--accent)',animation:'pulse 2s infinite' }}/>
              <span style={{ fontSize:10,fontWeight:600,color:'var(--accent)',fontFamily:'var(--font-mono)',letterSpacing:'0.1em',textTransform:'uppercase' }}>LeetCode · Personal Archive</span>
            </div>
            <h1 style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:'clamp(32px,5vw,52px)',lineHeight:1.08,letterSpacing:'-0.035em',marginBottom:12 }}>
              Problem<br/>Archive
            </h1>
            <p style={{ fontSize:15,color:'var(--text-sub)',maxWidth:400,lineHeight:1.7,fontWeight:300,fontFamily:'var(--font-body)' }}>
              Every problem solved, cross-referenced by topic, language, and difficulty.
            </p>
            {dueTodayCount>0&&(
              <div style={{ marginTop:14,display:'inline-flex',alignItems:'center',gap:8,padding:'8px 14px',background:'var(--medium-bg)',border:'1px solid var(--medium)',borderRadius:10,animation:'borderPulse 2s infinite' }}>
                <span style={{ fontSize:14 }}>📌</span>
                <span style={{ fontSize:13,fontFamily:'var(--font-display)',fontWeight:600,color:'var(--medium)' }}>{dueTodayCount} problem{dueTodayCount>1?'s':''} in revision queue</span>
                <button onClick={()=>{ setDiff('revision'); setTab('problems') }} style={{ fontSize:11,color:'var(--medium)',fontFamily:'var(--font-mono)',background:'none',border:'none',cursor:'pointer',textDecoration:'underline' }}>View</button>
              </div>
            )}
          </div>
          {!loading&&stats&&(
            <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
              {[
                {l:'Total', v:stats.leetcode?.solved||problems.length, c:'var(--accent)'},
                {l:'Easy',  v:stats.leetcode?.easy,   c:'var(--easy)'},
                {l:'Med',   v:stats.leetcode?.medium,  c:'var(--medium)'},
                {l:'Hard',  v:stats.leetcode?.hard,    c:'var(--hard)'},
              ].map(s=>(
                <div key={s.l} style={{ padding:'12px 18px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:12,minWidth:74,textAlign:'center' }}>
                  <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:24,color:s.c }}>{s.v||0}</div>
                  <div style={{ fontSize:10,color:'var(--text-sub)',fontWeight:500,textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:'var(--font-mono)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="fade-up" style={{ animationDelay:'50ms' }}>
        <div style={{ display:'flex',borderBottom:'1px solid var(--border)',marginBottom:0 }}>
          {[['problems','Problems'],['insights','Insights'],['bookmarks','Bookmarks'],['revision','Revision']].map(([k,l])=>(
            <button key={k} className={`nav-tab${tab===k?' on':''}`} onClick={()=>setTab(k)}>
              {l}{k==='revision'&&dueTodayCount>0&&<span style={{ marginLeft:6,padding:'1px 6px',borderRadius:99,background:'var(--medium)',color:'#fff',fontSize:10,fontFamily:'var(--font-mono)',fontWeight:700 }}>{dueTodayCount}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ── INSIGHTS ── */}
      {tab==='insights'&&(
        <div className="fade-up" style={{ paddingTop:28 }}>
          <InsightsPanel stats={stats} problems={problems} bookmarks={bookmarks}/>
        </div>
      )}

      {/* ── BOOKMARKS ── */}
      {tab==='bookmarks'&&(
        <div className="fade-up" style={{ paddingTop:28 }}>
          {bookmarks.size===0 ? (
            <div style={{ textAlign:'center',padding:'80px 20px',color:'var(--text-sub)' }}>
              <div style={{ fontSize:40,marginBottom:12,opacity:.15 }}>⌗</div>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,marginBottom:6 }}>Nothing bookmarked yet</div>
              <div style={{ fontSize:14,fontFamily:'var(--font-body)' }}>Tap the bookmark icon on any problem card</div>
            </div>
          ):(
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:10 }}>
              {problems.filter(p=>bookmarks.has(p.slug)).map((p,i)=>(
                <ProblemCard key={p.slug} problem={p} index={i} viewMode="grid" bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} confidence={confidence} onSetConfidence={onSetConfidence} revQueue={revQueue} onToggleRev={onToggleRev}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── REVISION ── */}
      {tab==='revision'&&(
        <div className="fade-up" style={{ paddingTop:28 }}>
          {revQueue.size===0 ? (
            <div style={{ textAlign:'center',padding:'80px 20px',color:'var(--text-sub)' }}>
              <div style={{ fontSize:40,marginBottom:12,opacity:.15 }}>📌</div>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,marginBottom:6 }}>Revision queue is empty</div>
              <div style={{ fontSize:14,fontFamily:'var(--font-body)' }}>Click the clock icon on any problem to add it for revision</div>
            </div>
          ):(
            <div style={{ display:'flex',flexDirection:'column',gap:6 }}>
              {problems.filter(p=>revQueue.has(p.slug)).map((p,i)=>(
                <ProblemCard key={p.slug} problem={p} index={i} viewMode="list" bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} confidence={confidence} onSetConfidence={onSetConfidence} revQueue={revQueue} onToggleRev={onToggleRev}/>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PROBLEMS ── */}
      {tab==='problems'&&(
        <>
          <div className="fade-up" style={{ animationDelay:'80ms',display:'flex',gap:8,marginTop:22,marginBottom:10,flexWrap:'wrap',alignItems:'center' }}>
            <div className="search-wrap" style={{ flex:'1 1 220px',minWidth:160 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <input className="search-input" placeholder="Search problems…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
              {['all','easy','medium','hard'].map(f=>(
                <button key={f} className="filter-pill" data-diff={f} data-on={diff===f}
                  onClick={()=>setDiff(f)} style={diff===f&&f==='all'?{background:'var(--accent-glow)',color:'var(--accent)',borderColor:'var(--accent-border)'}:{}}>
                  {f.charAt(0).toUpperCase()+f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="fade-up" style={{ animationDelay:'100ms',display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center' }}>
            {[
              [topic,setTopic,'All Topics',ALL_TOPICS,t=>t,t=>t],
              [lang, setLang, 'All Languages',allLangs,l=>l,l=>langLabel(l)],
            ].map(([val,setVal,placeholder,opts,keyFn,labelFn],idx)=>(
              <div key={idx} style={{ position:'relative' }}>
                <select className="sel" value={val} onChange={e=>setVal(e.target.value)}>
                  <option value="all">{placeholder}</option>
                  {opts.map(o=><option key={keyFn(o)} value={keyFn(o)}>{labelFn(o)}</option>)}
                </select>
                <svg style={{ position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--text-sub)' }} width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              </div>
            ))}
            <div style={{ position:'relative' }}>
              <select className="sel" value={sort} onChange={e=>setSort(e.target.value)}>
                <option value="id">Sort: Number</option>
                <option value="title">Sort: A–Z</option>
                <option value="difficulty">Sort: Difficulty</option>
                <option value="topic">Sort: Topic (Grouped)</option>
                <option value="langs">Sort: Most Languages</option>
                <option value="confidence">Sort: Confidence</option>
              </select>
              <svg style={{ position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--text-sub)' }} width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </div>
            <div style={{ marginLeft:'auto',display:'flex',gap:5 }}>
              {[['grid','⊞'],['list','≡']].map(([m,ico])=>(
                <button key={m} className={`btn-icon${view===m?' on':''}`} onClick={()=>setView(m)} title={m}>
                  {m==='grid'
                    ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="1" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 3.5h11M1 6.5h11M1 9.5h11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                  }
                </button>
              ))}
              <button className="btn-icon" onClick={()=>{ if(problems.length) navigate(`/problem/${problems[Math.floor(Math.random()*problems.length)].slug}`) }} title="Random problem">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1 4h2l1.5 5H10M10 4l-2-2m2 2l-2 2M1 9h2l1.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {!loading&&(
            <div style={{ marginBottom:14,fontSize:11,color:'var(--text-sub)',fontFamily:'var(--font-mono)' }}>
              {filtered.length} {filtered.length===1?'problem':'problems'}{(search||diff!=='all'||topic!=='all'||lang!=='all')?' matched':''}
            </div>
          )}

          {loading ? (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:10 }}>
              {Array.from({length:12},(_,i)=>(
                <div key={i} className="fade-in" style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'18px 22px',animationDelay:`${i*40}ms` }}>
                  <div style={{ display:'flex',gap:8,marginBottom:10 }}><div className="skeleton" style={{ width:48,height:14 }}/><div className="skeleton" style={{ width:40,height:14 }}/></div>
                  <div className="skeleton" style={{ width:'60%',height:18,marginBottom:12 }}/>
                  <div style={{ display:'flex',gap:4 }}><div className="skeleton" style={{ width:26,height:17 }}/><div className="skeleton" style={{ width:26,height:17 }}/></div>
                </div>
              ))}
            </div>
          ) : grouped ? (
            <div style={{ display:'flex',flexDirection:'column',gap:32 }}>
              {Object.entries(grouped).sort((a,b)=>a[0].localeCompare(b[0])).map(([t,tPs])=>(
                <div key={t}>
                  <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:14 }}>
                    <span style={{ fontSize:18 }}>{TOPIC_ICONS[t]||'◉'}</span>
                    <span style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:16 }}>{t}</span>
                    <span style={{ fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-sub)',background:'var(--bg-glass)',border:'1px solid var(--border)',padding:'2px 8px',borderRadius:5 }}>{tPs.length}</span>
                    <div style={{ flex:1,height:1,background:'var(--border)' }}/>
                  </div>
                  <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:10 }}>
                    {tPs.map((p,i)=><ProblemCard key={p.slug} problem={p} index={i} viewMode={view} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} confidence={confidence} onSetConfidence={onSetConfidence} revQueue={revQueue} onToggleRev={onToggleRev}/>)}
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length>0 ? (
            <div style={view==='grid'?{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:10}:{display:'flex',flexDirection:'column',gap:6}}>
              {filtered.map((p,i)=><ProblemCard key={p.slug} problem={p} index={i} viewMode={view} bookmarks={bookmarks} onToggleBookmark={onToggleBookmark} confidence={confidence} onSetConfidence={onSetConfidence} revQueue={revQueue} onToggleRev={onToggleRev}/>)}
            </div>
          ) : (
            <div style={{ textAlign:'center',padding:'80px 20px',color:'var(--text-sub)' }}>
              <div style={{ fontSize:36,marginBottom:12,opacity:.15 }}>∅</div>
              <div style={{ fontFamily:'var(--font-display)',fontWeight:700,fontSize:18,marginBottom:6 }}>No problems found</div>
              <div style={{ fontSize:14,fontFamily:'var(--font-body)' }}>Try clearing some filters</div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── PROBLEM PAGE ─────────────────────────────────────────────────────────────
function ProblemPage({ problems, theme, bookmarks, onToggleBookmark, confidence, onSetConfidence, revQueue, onToggleRev, notes, onSaveNote }) {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [readme,   setReadme]   = useState(null)
  const [sols,     setSols]     = useState({})
  const [activeL,  setActiveL]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [copied,   setCopied]   = useState(false)
  const [notesOpen,setNotesOpen]= useState(false)
  const [noteText, setNoteText] = useState('')
  const [approachTags, setApproachTags] = useState(()=>ls(`dsa-approach-${slug}`,[]))
  const [trickTags,    setTrickTags]    = useState(()=>ls(`dsa-tricks-${slug}`,[]))
  const [showTagEditor,setShowTagEditor]= useState(false)

  const problem = problems.find(p=>p.slug===slug)
  const idx     = problems.findIndex(p=>p.slug===slug)
  const prev    = idx>0 ? problems[idx-1] : null
  const next    = idx<problems.length-1 ? problems[idx+1] : null
  const conf    = confidence[slug]||0
  const inRev   = revQueue.has(slug)

  useEffect(()=>{
    if(!slug) return
    setLoading(true); setReadme(null); setSols({}); setActiveL(null)
    setNoteText(notes[slug]||'')
    setApproachTags(ls(`dsa-approach-${slug}`,[]))
    setTrickTags(ls(`dsa-tricks-${slug}`,[]))
    const go=async()=>{
      try{ const r=await fetch(`/data/${slug}/README.md`); if(r.ok) setReadme(await r.text()) }catch{}
      if(problem?.langs){
        const loaded={}
        await Promise.all(problem.langs.map(async ext=>{
          try{ const r=await fetch(`/data/${slug}/${slug}.${ext}`); if(r.ok) loaded[ext]=await r.text() }catch{}
        }))
        setSols(loaded); const f=Object.keys(loaded)[0]; if(f) setActiveL(f)
      }
      setLoading(false)
    }
    go()
  },[slug])

  function toggleApproach(tag){
    const updated=approachTags.includes(tag)?approachTags.filter(t=>t!==tag):[...approachTags,tag]
    setApproachTags(updated); lsSet(`dsa-approach-${slug}`,updated)
  }
  function toggleTrick(tag){
    const updated=trickTags.includes(tag)?trickTags.filter(t=>t!==tag):[...trickTags,tag]
    setTrickTags(updated); lsSet(`dsa-tricks-${slug}`,updated)
  }

  const handleCopy = useCallback(()=>{
    if(!activeL||!sols[activeL]) return
    navigator.clipboard.writeText(sols[activeL]).then(()=>{ setCopied(true); setTimeout(()=>setCopied(false),2000) })
  },[activeL,sols])

  const codeTheme = theme==='dark' ? darkCode : lightCode
  const isBookmarked = bookmarks.has(slug)
  const leetUrl = problem ? `https://leetcode.com/problems/${slug.replace(/^\d+-/,'')}/` : null

  return (
    <div style={{ maxWidth:960,margin:'0 auto',padding:'32px 28px 100px',position:'relative',zIndex:1 }}>
      {/* ── TOP BAR ── */}
      <div className="fade-in" style={{ marginBottom:24,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
        <button className="btn-ghost" onClick={()=>navigate('/')}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5L3.5 5.5L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Back
        </button>
        <div style={{ display:'flex',gap:6,flexWrap:'wrap',alignItems:'center' }}>
          {prev&&<button className="btn-ghost" onClick={()=>navigate(`/problem/${prev.slug}`)} style={{ padding:'6px 10px' }}><svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M7.5 1.5L3.5 5.5L7.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Prev</button>}
          {next&&<button className="btn-ghost" onClick={()=>navigate(`/problem/${next.slug}`)} style={{ padding:'6px 10px' }}>Next<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M3.5 1.5L7.5 5.5L3.5 9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>}
          <div style={{ display:'flex',gap:3,alignItems:'center' }}>
            {[1,2,3,4,5].map(s=>(
              <span key={s} className="star" onClick={()=>onSetConfidence(slug,s===conf?0:s)}
                style={{ fontSize:16,color:'var(--medium)',opacity:s<=conf?1:0.2 }}>★</span>
            ))}
          </div>
          <button className={`btn-icon${inRev?' on':''}`} onClick={()=>onToggleRev(slug)} title="Toggle revision queue">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1.5v5L8.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/></svg>
          </button>
          <button className={`btn-icon${isBookmarked?' on':''}`} onClick={()=>onToggleBookmark(slug)} title="Bookmark">
            <svg width="12" height="12" viewBox="0 0 12 12" fill={isBookmarked?'currentColor':'none'}><path d="M2 1.5h8v10L6 9 2 11.5V1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </button>
          {leetUrl&&(
            <a href={leetUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ gap:5,fontSize:12 }}>
              LeetCode
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5.5 1.5H8.5V4.5M8.5 1.5L4 7M1.5 8.5H1A.5.5 0 0 1 .5 8V2A.5.5 0 0 1 1 1.5H4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          )}
        </div>
      </div>

      {/* ── PROBLEM HEADER ── */}
      <div className="fade-up" style={{ marginBottom:28 }}>
        <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10,flexWrap:'wrap' }}>
          <span style={{ fontFamily:'var(--font-mono)',fontSize:10,color:'var(--text-faint)' }}>#{String(problem?.id||'').padStart(4,'0')}</span>
          {problem?.difficulty&&<span style={{ fontSize:10,fontWeight:700,color:diffColor(problem.difficulty),background:diffBg(problem.difficulty),padding:'3px 9px',borderRadius:4,textTransform:'capitalize',fontFamily:'var(--font-mono)' }}>{problem.difficulty}</span>}
          {problem?.topic&&<span className="topic-chip">{TOPIC_ICONS[problem.topic]||'◉'} {problem.topic}</span>}
          {problem?.langs.map(l=>(
            <span key={l} style={{ fontSize:9,fontWeight:700,color:langColor(l),background:langBg(l),border:`1px solid ${langColor(l)}28`,padding:'2px 7px',borderRadius:4,fontFamily:'var(--font-mono)',boxShadow:`0 0 8px ${langGlow(l)}` }}>{langLabel(l)}</span>
          ))}
          {conf>0&&<div style={{ display:'flex',gap:2 }}>{[1,2,3,4,5].map(s=><span key={s} style={{ fontSize:12,color:'var(--medium)',opacity:s<=conf?1:0.2 }}>★</span>)}</div>}
        </div>
        <h1 style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:'clamp(22px,4vw,34px)',lineHeight:1.15,letterSpacing:'-0.025em' }}>
          {problem?.title || slug}
        </h1>
      </div>

      {/* ── APPROACH & TRICK TAGS ── */}
      <div className="fade-up" style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:16,padding:'16px 20px',marginBottom:18,animationDelay:'30ms' }}>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:10,flexWrap:'wrap' }}>
          <span style={{ fontFamily:'var(--font-mono)',fontSize:10,fontWeight:600,color:'var(--text-sub)',textTransform:'uppercase',letterSpacing:'0.08em' }}>Approach</span>
          <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
            {approachTags.map(tag=>(
              <span key={tag} className="tag-chip" style={{ background:'var(--accent-glow)',color:'var(--accent)',borderColor:'var(--accent-border)' }}
                onClick={()=>toggleApproach(tag)}>{tag} ×</span>
            ))}
            {approachTags.length===0&&<span style={{ fontSize:12,color:'var(--text-faint)',fontFamily:'var(--font-body)' }}>None tagged yet</span>}
          </div>
          <div style={{ marginLeft:'auto',display:'flex',gap:6,alignItems:'center' }}>
            <span style={{ fontFamily:'var(--font-mono)',fontSize:10,fontWeight:600,color:'var(--text-sub)',textTransform:'uppercase',letterSpacing:'0.08em' }}>Tricks</span>
            {trickTags.map(tag=>(
              <span key={tag} className="tag-chip" style={{ background:'var(--medium-bg)',color:'var(--medium)',borderColor:'var(--medium)' }}
                onClick={()=>toggleTrick(tag)}>{tag} ×</span>
            ))}
          </div>
          <button onClick={()=>setShowTagEditor(e=>!e)} className="btn-ghost" style={{ fontSize:11,padding:'4px 10px',borderRadius:7 }}>
            {showTagEditor?'Done':'+ Add Tags'}
          </button>
        </div>

        {showTagEditor&&(
          <div style={{ borderTop:'1px solid var(--border)',paddingTop:14 }}>
            <div style={{ marginBottom:10 }}>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-sub)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>Approach Patterns</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                {APPROACH_TAGS.map(tag=>(
                  <span key={tag} className="tag-chip"
                    style={{ background:approachTags.includes(tag)?'var(--accent-glow)':'var(--bg-glass)', color:approachTags.includes(tag)?'var(--accent)':'var(--text-sub)', borderColor:approachTags.includes(tag)?'var(--accent-border)':'var(--border)', cursor:'pointer' }}
                    onClick={()=>toggleApproach(tag)}>{tag}</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:9,color:'var(--text-sub)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8 }}>Tricks & Techniques</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:5 }}>
                {TRICK_TAGS.map(tag=>(
                  <span key={tag} className="tag-chip"
                    style={{ background:trickTags.includes(tag)?'var(--medium-bg)':'var(--bg-glass)', color:trickTags.includes(tag)?'var(--medium)':'var(--text-sub)', borderColor:trickTags.includes(tag)?'var(--medium)':'var(--border)', cursor:'pointer' }}
                    onClick={()=>toggleTrick(tag)}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── README ── */}
      <div className="fade-up" style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:18,padding:'26px 30px',marginBottom:18,animationDelay:'60ms' }}>
        <div style={{ fontFamily:'var(--font-mono)',fontSize:10,fontWeight:600,color:'var(--text-sub)',textTransform:'uppercase',letterSpacing:'0.09em',marginBottom:20,paddingBottom:14,borderBottom:'1px solid var(--border)' }}>Problem Statement</div>
        {loading ? (
          <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
            {[100,82,92,68,55,78].map((w,i)=><div key={i} className="skeleton" style={{ width:`${w}%`,height:14,animationDelay:`${i*80}ms` }}/>)}
          </div>
        ) : readme ? (
          <div className="readme"><ReactMarkdown rehypePlugins={[rehypeRaw]}>{readme}</ReactMarkdown></div>
        ) : (
          <p style={{ color:'var(--text-sub)',fontSize:14,fontFamily:'var(--font-body)' }}>No problem statement available.</p>
        )}
      </div>

      {/* ── SOLUTIONS ── */}
      {!loading&&Object.keys(sols).length>0&&(
        <div className="fade-up" style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:18,overflow:'hidden',marginBottom:18,animationDelay:'100ms' }}>
          <div style={{ padding:'14px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,flexWrap:'wrap' }}>
            <div style={{ display:'flex',gap:5,flexWrap:'wrap' }}>
              {Object.keys(sols).map(ext=>(
                <button key={ext} className={`tab-pill${activeL===ext?' on':''}`} onClick={()=>setActiveL(ext)}
                  style={activeL!==ext?{borderColor:`${langColor(ext)}38`,color:langColor(ext)}:{}}>
                  {langLabel(ext)}
                </button>
              ))}
            </div>
            <button onClick={handleCopy} style={{ padding:'5px 12px',borderRadius:8,border:`1px solid ${copied?'var(--easy)':'var(--border)'}`,background:copied?'var(--easy-bg)':'var(--bg-glass)',color:copied?'var(--easy)':'var(--text-sub)',fontSize:10,fontWeight:600,fontFamily:'var(--font-mono)',cursor:'pointer',transition:'all 0.15s',display:'flex',alignItems:'center',gap:5 }}>
              {copied?'Copied ✓':'Copy Code'}
            </button>
          </div>
          <div style={{ background:'var(--code-bg)',position:'relative' }}>
            {activeL&&<div style={{ position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg, ${langColor(activeL)} 0%, ${langColor(activeL)}00 60%)`,opacity:.7 }}/>}
            {activeL&&sols[activeL]&&(
              <SyntaxHighlighter language={langHL(activeL)} style={codeTheme}
                customStyle={{ margin:0,padding:'24px 26px',background:'transparent',fontSize:'13px',lineHeight:'1.8',maxHeight:'560px',overflow:'auto' }}
                showLineNumbers lineNumberStyle={{ color:'var(--text-faint)',fontSize:'11px',userSelect:'none',paddingRight:'20px',minWidth:'34px',fontFamily:'var(--font-mono)' }}>
                {sols[activeL]}
              </SyntaxHighlighter>
            )}
          </div>
        </div>
      )}

      {/* ── NOTES ── */}
      <div className="fade-up" style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:18,overflow:'hidden',animationDelay:'130ms' }}>
        <button onClick={()=>setNotesOpen(o=>!o)} style={{ width:'100%',padding:'14px 20px',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <div style={{ display:'flex',alignItems:'center',gap:10 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v8H9L7 12l-1-2H2V2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>
            <span style={{ fontSize:12,fontWeight:600,fontFamily:'var(--font-mono)',color:'var(--text-sub)',textTransform:'uppercase',letterSpacing:'0.08em' }}>Notes & Approach</span>
            {notes[slug]&&<span style={{ width:7,height:7,borderRadius:'50%',background:'var(--accent)',animation:'glow 2s infinite' }}/>}
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform:notesOpen?'rotate(180deg)':'none',transition:'transform 0.2s',color:'var(--text-sub)' }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {notesOpen&&(
          <div style={{ padding:'0 20px 20px',borderTop:'1px solid var(--border)' }}>
            <textarea value={noteText} onChange={e=>setNoteText(e.target.value)}
              placeholder="Write your approach, edge cases, complexity analysis, what you learned…"
              style={{ width:'100%',minHeight:130,padding:'14px 16px',background:'var(--code-bg)',border:'1px solid var(--border)',borderRadius:12,color:'var(--text)',fontSize:13,fontFamily:'var(--font-mono)',resize:'vertical',outline:'none',lineHeight:1.75,marginTop:14,transition:'border-color 0.15s' }}
              onFocus={e=>e.target.style.borderColor='var(--accent-border)'}
              onBlur={e=>e.target.style.borderColor='var(--border)'}
            />
            <button onClick={()=>onSaveNote(slug,noteText)} style={{ marginTop:10,padding:'8px 18px',borderRadius:9,border:'none',background:'var(--accent)',color:'#fff',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-body)',transition:'opacity 0.15s' }}
              onMouseEnter={e=>e.target.style.opacity='.85'} onMouseLeave={e=>e.target.style.opacity='1'}>
              Save Note
            </button>
          </div>
        )}
      </div>

      {!loading&&!Object.keys(sols).length&&(
        <div className="fade-up" style={{ background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:18,padding:'52px 28px',textAlign:'center',marginTop:18 }}>
          <div style={{ opacity:.15,fontSize:32,marginBottom:10 }}>∅</div>
          <div style={{ fontFamily:'var(--font-display)',fontWeight:600,fontSize:16 }}>No solutions available</div>
          <div style={{ fontSize:13,color:'var(--text-sub)',marginTop:4,fontFamily:'var(--font-body)' }}>Solution files were not found for this problem.</div>
        </div>
      )}
    </div>
  )
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme,     setTheme]     = useState(()=>ls('dsa-theme','dark'))
  const [stats,     setStats]     = useState(null)
  const [problems,  setProblems]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [cmdOpen,   setCmdOpen]   = useState(false)
  const [bookmarks, setBookmarks] = useState(()=>new Set(ls('dsa-bookmarks',[])))
  const [revQueue,  setRevQueue]  = useState(()=>new Set(ls('dsa-revqueue',[])))
  const [confidence,setConfidence]= useState(()=>ls('dsa-confidence',{}))
  const [notes,     setNotes]     = useState(()=>ls('dsa-notes',{}))

  const t = T[theme]||T.dark

  const toggleTheme = ()=>{
    setTheme(p=>{ const n=p==='dark'?'light':'dark'; lsSet('dsa-theme',n); return n })
  }
  const toggleBookmark = useCallback(slug=>{
    setBookmarks(p=>{ const n=new Set(p); n.has(slug)?n.delete(slug):n.add(slug); lsSet('dsa-bookmarks',[...n]); return n })
  },[])
  const toggleRev = useCallback(slug=>{
    setRevQueue(p=>{ const n=new Set(p); n.has(slug)?n.delete(slug):n.add(slug); lsSet('dsa-revqueue',[...n]); return n })
  },[])
  const setConfSlug = useCallback((slug,val)=>{
    setConfidence(p=>{ const n={...p,[slug]:val}; if(val===0) delete n[slug]; lsSet('dsa-confidence',n); return n })
  },[])
  const saveNote = useCallback((slug,text)=>{
    setNotes(p=>{ const n={...p,[slug]:text}; lsSet('dsa-notes',n); return n })
  },[])

  useEffect(()=>{
    fetch('/data/stats.json').then(r=>r.json()).then(d=>{ setStats(d); setProblems(parseShas(d)); setLoading(false) }).catch(()=>setLoading(false))
  },[])

  useEffect(()=>{
    const fn=e=>{ if((e.metaKey||e.ctrlKey)&&e.key==='k'){ e.preventDefault(); setCmdOpen(o=>!o) } }
    window.addEventListener('keydown',fn)
    return ()=>window.removeEventListener('keydown',fn)
  },[])

  useEffect(() => {
  const fn = e => {
    const inInput = ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
    if (e.key === 't' && !inInput) {
      e.preventDefault()
      toggleTheme()
    }
  }
  window.addEventListener('keydown', fn)
  return () => window.removeEventListener('keydown', fn)
}, [toggleTheme])

  const sharedProps = { bookmarks, onToggleBookmark:toggleBookmark, confidence, onSetConfidence:setConfSlug, revQueue, onToggleRev:toggleRev }

  return (
    <BrowserRouter>
      <GlobalStyles t={t}/>
      <Navbar theme={theme} toggleTheme={toggleTheme} stats={stats} onCmdOpen={()=>setCmdOpen(true)}/>
      {cmdOpen&&<CmdPalette problems={problems} onClose={()=>setCmdOpen(false)}/>}
      <Routes>
        <Route path="/" element={<HomePage stats={stats} problems={problems} loading={loading} notes={notes} {...sharedProps}/>}/>
        <Route path="/problem/:slug" element={<ProblemPage problems={problems} theme={theme} notes={notes} onSaveNote={saveNote} {...sharedProps}/>}/>
        <Route path="*" element={
          <div style={{ textAlign:'center',padding:'130px 20px',position:'relative',zIndex:1 }}>
            <div style={{ fontFamily:'var(--font-display)',fontWeight:800,fontSize:28,marginBottom:8,letterSpacing:'-0.02em' }}>404</div>
            <div style={{ color:'var(--text-sub)',marginBottom:18,fontSize:14,fontFamily:'var(--font-body)' }}>This page doesn't exist</div>
            <Link to="/" style={{ color:'var(--accent)',fontSize:14,fontFamily:'var(--font-display)',fontWeight:600 }}>← Go home</Link>
          </div>
        }/>
      </Routes>
    </BrowserRouter>
  )
}
