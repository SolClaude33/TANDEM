import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent, type RefObject } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle,
  Clipboard,
  Compass,
  List,
  Plus,
  Sparkle,
  Wallet,
  X,
} from '@phosphor-icons/react'

type Route = 'home' | 'explore' | 'dashboard' | 'create'
type WalletKind = 'phantom' | 'solflare' | 'backpack'
type PublicKeyLike = { toString: () => string }
type WalletProvider = {
  isPhantom?: boolean
  publicKey?: PublicKeyLike | null
  connect: () => Promise<{ publicKey?: PublicKeyLike } | void>
  disconnect?: () => Promise<void>
  on?: (event: string, listener: (key?: PublicKeyLike | null) => void) => void
  off?: (event: string, listener: (key?: PublicKeyLike | null) => void) => void
  removeListener?: (event: string, listener: (key?: PublicKeyLike | null) => void) => void
}

declare global {
  interface Window {
    phantom?: { solana?: WalletProvider }
    solana?: WalletProvider
    solflare?: WalletProvider
    backpack?: WalletProvider
  }
}

type Draft = {
  id: string
  name: string
  ticker: string
  idea: string
  look: string
  savedAt: string
}

const STORE_KEY = 'tandem:drafts:v1'
const LEGACY_STORE_KEY = 'retikl:drafts:v1'
const SESSION = {
  idea: 'tandem:idea',
  look: 'tandem:look',
  name: 'tandem:name',
  ticker: 'tandem:ticker',
  editing: 'tandem:editing-id',
}

const LOOKS = [
  { id: 'signal', name: 'Signal', kind: 'Bold', color: '#a2f6bb', image: '/assets/look-signal-v02.webp', desc: 'Direct typography with bright, decisive energy.' },
  { id: 'lagoon', name: 'Lagoon', kind: 'Atmospheric', color: '#76e4cf', image: '/assets/look-lagoon-v02.webp', desc: 'Soft depth, fluid composition, and an easy pace.' },
  { id: 'cobalt', name: 'Cobalt', kind: 'Structured', color: '#6387ff', image: '/assets/look-cobalt-v02.webp', desc: 'A crisp system with electric confidence.' },
  { id: 'monument', name: 'Monument', kind: 'Bold', color: '#e1e2db', image: '/assets/look-monument.svg', desc: 'Big gestures made to leave a lasting impression.' },
  { id: 'index', name: 'Index', kind: 'Structured', color: '#f4a77c', image: '/assets/look-index.svg', desc: 'Ordered, editorial, and easy to navigate.' },
  { id: 'drift', name: 'Drift', kind: 'Atmospheric', color: '#d8d0ec', image: '/assets/look-drift.svg', desc: 'Airy layouts with a gently wandering rhythm.' },
  { id: 'field', name: 'Field', kind: 'Natural', color: '#d5ddb6', image: '/assets/look-field.svg', desc: 'Organic forms and a grounded point of view.' },
  { id: 'archive', name: 'Archive', kind: 'Editorial', color: '#e9e4d9', image: '/assets/look-archive.svg', desc: 'Tactile restraint for ideas with rich stories.' },
  { id: 'pulse', name: 'Pulse', kind: 'Energetic', color: '#f28d76', image: '/assets/look-pulse.svg', desc: 'Fast contrast and an unmistakable beat.' },
] as const

const STARTERS = [
  ['An indie game community', 'A community for indie game makers to share builds, feedback, and strange new worlds'],
  ['A local artist hub', 'A creative hub for local artists to show work, meet collaborators, and gather around new ideas'],
  ['A cleaner planet', 'A movement for neighbors building practical projects for a cleaner and more generous planet'],
] as const

const HOME_SECTIONS = [
  ['hero', 'Idea'],
  ['how-it-works', 'How it works'],
  ['looks', 'Looks'],
  ['ownership', 'Ownership'],
  ['fees', 'Fees'],
  ['examples', 'Examples'],
  ['faq', 'FAQ'],
  ['start', 'Start creating'],
] as const

type HomeSectionId = typeof HOME_SECTIONS[number][0]
let pendingHomeSection: HomeSectionId | null = null

const EXAMPLES = [
  { name: 'Repository Market', kind: 'MARKET', headline: 'Useful code, clearly found.', detail: 'Browse by purpose · Save the right tool', idea: 'A curated market where maintainers can present useful repositories and people can discover tools by purpose.', look: 'index' },
  { name: 'Coinflip Club', kind: 'GAME', headline: 'Pick a side. See the rules.', detail: 'Heads / Tails · Friendly play', idea: 'A coinflip game concept centered on clear rules, verifiable outcomes, and friendly competition.', look: 'pulse' },
  { name: 'Steady Buy', kind: 'FINANCE', headline: 'Build the habit, one step at a time.', detail: 'Plan · Review · Repeat', idea: 'A recurring-buy planner that helps people shape a consistent routine and understand each scheduled step.', look: 'signal' },
  { name: 'Common Vault', kind: 'DEFI', headline: 'Liquidity with room to think.', detail: 'Compare approaches · Keep a direction', idea: 'A clear workspace for exploring liquidity vault ideas, comparing approaches, and saving a preferred direction.', look: 'lagoon' },
  { name: 'Model Meter', kind: 'AI', headline: 'Make model choices legible.', detail: 'Models · Usage · Scenarios', idea: 'An AI pricing explorer that organizes model options, usage assumptions, and estimated scenarios in one calm view.', look: 'cobalt' },
  { name: 'Metered API', kind: 'TOOLS', headline: 'One endpoint. A precise way in.', detail: 'Read the docs · Shape a tier', idea: 'A paid API concept with concise documentation, understandable usage tiers, and a strong developer-facing identity.', look: 'monument' },
  { name: 'Smart Money Notes', kind: 'RESEARCH', headline: 'Follow the thought, not the noise.', detail: 'Observe · Annotate · Revisit', idea: 'A research dashboard for collecting market observations, annotating patterns, and revisiting saved theses.', look: 'archive' },
  { name: 'Cat Index', kind: 'CULTURE', headline: 'A field guide to internet cats.', detail: 'Profiles · Families · Curious finds', idea: 'An index for cat-themed coin concepts, with profiles, categories, and a playful editorial voice.', look: 'field' },
  { name: 'Pool Keeper', kind: 'OPERATIONS', headline: 'Every position, in its place.', detail: 'Positions · Fees · Rebalancing', idea: 'A liquidity management workspace for reviewing positions, fees earned, and rebalancing decisions in one organized view.', look: 'cobalt' },
  { name: 'Roomline', kind: 'COMMUNITY', headline: 'Markets, talked through together.', detail: 'Rooms · Watchlists · Notes', idea: 'A chat-built trading dashboard concept that brings conversation, watchlists, and market notes into one focused workspace.', look: 'drift' },
  { name: 'Future Feed', kind: 'MEDIA', headline: 'What launched, and why it matters.', detail: 'New tools · Clear context', idea: 'A technology launch feed that makes new tools easy to scan while giving every release a distinct editorial frame.', look: 'index' },
  { name: 'Pixel Foundry', kind: 'CREATIVE', headline: 'Make small worlds, pixel by pixel.', detail: 'Draw · Save · Share', idea: 'A pixel generator playground for building small visual systems, saving experiments, and sharing a clear direction.', look: 'pulse' },
] as const

function isDraft(item: unknown): item is Draft {
  if (!item || typeof item !== 'object') return false
  const draft = item as Partial<Draft>
  return ['id', 'name', 'ticker', 'idea', 'look', 'savedAt'].every(
    key => typeof draft[key as keyof Draft] === 'string',
  )
}

function readDrafts(): Draft[] {
  try {
    let raw = localStorage.getItem(STORE_KEY)
    if (!raw) {
      const legacy = localStorage.getItem(LEGACY_STORE_KEY)
      if (legacy) {
        const parsed = JSON.parse(legacy)
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isDraft)
          localStorage.setItem(STORE_KEY, JSON.stringify(valid))
          raw = JSON.stringify(valid)
        }
      }
    }
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) ? parsed.filter(isDraft) : []
  } catch {
    return []
  }
}

function navigate(route: Route, idea?: string, look?: string, editingId?: string) {
  try {
    if (idea) sessionStorage.setItem(SESSION.idea, idea)
    if (look) sessionStorage.setItem(SESSION.look, look)
    if (route === 'create') {
      if (editingId) {
        sessionStorage.setItem(SESSION.editing, editingId)
      } else {
        sessionStorage.removeItem(SESSION.editing)
        sessionStorage.removeItem(SESSION.name)
        sessionStorage.removeItem(SESSION.ticker)
        if (!idea) sessionStorage.removeItem(SESSION.idea)
        if (!look) sessionStorage.removeItem(SESSION.look)
        window.dispatchEvent(new Event('tandem:new-project'))
      }
    }
  } catch {
    // Navigation still works when browser storage is unavailable.
  }
  const current = window.location.hash.slice(1) || 'home'
  if (current === route) {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  } else {
    window.location.hash = route === 'home' ? '' : route
  }
}

function goToHomeSection(id: HomeSectionId) {
  const scroll = () => document.getElementById(id)?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
  if (!document.getElementById(id)) {
    pendingHomeSection = id
    navigate('home')
  } else {
    scroll()
  }
}

function openDraft(draft: Draft) {
  try {
    sessionStorage.setItem(SESSION.idea, draft.idea)
    sessionStorage.setItem(SESSION.look, draft.look)
    sessionStorage.setItem(SESSION.name, draft.name)
    sessionStorage.setItem(SESSION.ticker, draft.ticker)
  } catch {
    // Continue without storage.
  }
  navigate('create', undefined, undefined, draft.id)
}

function Words({ text }: { text: string }) {
  return (
    <span className="word-reveal" aria-label={text}>
      {text.split(' ').map((word, index) => (
        <span aria-hidden="true" key={`${word}-${index}`} style={{ '--word-index': index } as CSSProperties}>{word}</span>
      ))}
    </span>
  )
}

function Brand() {
  return (
    <a
      className="brand"
      href="#"
      aria-label="Tandem home"
      onClick={event => {
        event.preventDefault()
        navigate('home')
      }}
    >
      <img src="/assets/tandem-mark.svg" alt="" />
      <b>tandem</b>
    </a>
  )
}

function Header({ route, onWallet, address }: { route: Route; onWallet: () => void; address: string }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [compact, setCompact] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const lastY = useRef(0)
  const frame = useRef(0)
  const travel = useRef({ direction: 0, distance: 0 })
  const hiddenRef = useRef(false)
  const compactRef = useRef(false)
  const go = (to: Route) => {
    hiddenRef.current = false
    setHidden(false)
    navigate(to)
    setOpen(false)
  }

  useEffect(() => {
    lastY.current = Math.max(0, window.scrollY)
    travel.current = { direction: 0, distance: 0 }
    const onScroll = () => {
      if (frame.current) return
      frame.current = window.requestAnimationFrame(() => {
        frame.current = 0
        const y = Math.max(0, window.scrollY)
        const focused = Boolean(headerRef.current?.querySelector(':focus-visible'))
        const nextCompact = y > 24
        if (nextCompact !== compactRef.current) {
          compactRef.current = nextCompact
          setCompact(nextCompact)
        }
        if (y < 100 || open || focused) {
          travel.current = { direction: 0, distance: 0 }
          if (hiddenRef.current) {
            hiddenRef.current = false
            setHidden(false)
          }
        } else {
          const delta = y - lastY.current
          const direction = delta > 0 ? 1 : delta < 0 ? -1 : 0
          if (direction) {
            if (travel.current.direction !== direction) travel.current = { direction, distance: 0 }
            travel.current.distance += Math.abs(delta)
            if (travel.current.distance >= 8) {
              const nextHidden = direction > 0
              if (nextHidden !== hiddenRef.current) {
                hiddenRef.current = nextHidden
                setHidden(nextHidden)
              }
              travel.current.distance = 0
            }
          }
        }
        lastY.current = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame.current) window.cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header ref={headerRef} className={`site-header${hidden ? ' header-hidden' : ''}${compact ? ' header-compact' : ''}`} onFocusCapture={() => { hiddenRef.current = false; setHidden(false) }}>
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button aria-current={route === 'explore' ? 'page' : undefined} onClick={() => go('explore')}>Explore</button>
          <button onClick={() => goToHomeSection('how-it-works')}>How it works</button>
          <button onClick={() => goToHomeSection('looks')}>Looks</button>
          <button onClick={() => goToHomeSection('fees')}>Fees</button>
          <button onClick={() => goToHomeSection('examples')}>Examples</button>
          <button aria-current={route === 'dashboard' ? 'page' : undefined} onClick={() => go('dashboard')}>Dashboard</button>
        </nav>
        <div className="header-actions">
          <button className="button button-ink wallet-button" onClick={onWallet}>
            <Wallet />
            {address ? `${address.slice(0, 4)}…${address.slice(-4)}` : 'Connect wallet'}
          </button>
          <button className="button button-orange header-create" aria-current={route === 'create' ? 'page' : undefined} onClick={() => go('create')}>
            Create project
          </button>
          <button className="menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen(value => !value)}>
            {open ? <X /> : <List />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <button onClick={() => { goToHomeSection('how-it-works'); setOpen(false) }}>How it works</button>
          <button onClick={() => { goToHomeSection('looks'); setOpen(false) }}>Looks</button>
          <button onClick={() => { goToHomeSection('ownership'); setOpen(false) }}>Ownership</button>
          <button onClick={() => { goToHomeSection('fees'); setOpen(false) }}>Fees</button>
          <button onClick={() => { goToHomeSection('examples'); setOpen(false) }}>Examples</button>
          <button onClick={() => { goToHomeSection('faq'); setOpen(false) }}>FAQ</button>
          <button onClick={() => go('explore')}>Explore all directions</button>
          <button onClick={() => go('dashboard')}>Dashboard</button>
          <button onClick={() => { onWallet(); setOpen(false) }}>Connect wallet</button>
          <button onClick={() => go('create')}>Create project</button>
        </nav>
      ) : null}
    </header>
  )
}

function IdeaComposer({
  initial = '',
  compact = false,
  dark = false,
  onContinue,
  onIdeaChange,
}: {
  initial?: string
  compact?: boolean
  dark?: boolean
  onContinue: (idea: string) => void
  onIdeaChange?: (idea: string) => void
}) {
  const [idea, setIdea] = useState(initial)
  const [error, setError] = useState('')
  const ref = useRef<HTMLTextAreaElement>(null)
  const inputId = compact ? 'create-idea' : 'hero-idea'

  const update = (value: string) => {
    setIdea(value)
    onIdeaChange?.(value)
    setError('')
  }
  const submit = () => {
    if (idea.trim().length < 20) {
      setError('Add a little more detail — at least 20 characters.')
      ref.current?.focus()
      return
    }
    onContinue(idea.trim())
  }

  return (
    <div className={`composer${compact ? ' composer-compact' : ''}${dark ? ' composer-dark' : ''}`}>
      <div className="composer-main">
        <div className="composer-head">
          <label htmlFor={inputId}>{compact ? 'Describe your idea' : 'What are you making?'}</label>
          <span>{idea.length}/280</span>
        </div>
        <textarea
          ref={ref}
          id={inputId}
          value={idea}
          maxLength={280}
          onChange={event => update(event.target.value)}
          placeholder="A place for people who…"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      <button className="button button-orange composer-submit" onClick={submit}>
        {compact ? 'Continue to name' : 'Create project'} <ArrowRight />
      </button>
      {error ? <p className="field-error" id={`${inputId}-error`} role="alert">{error}</p> : null}
      {!compact ? (
        <div className="starter-row" aria-label="Starter ideas">
          {STARTERS.map(([label, prompt]) => (
            <button key={label} onClick={() => { update(prompt); ref.current?.focus() }}>{label}</button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function WebsiteArtifact() {
  return (
    <div className="website-artifact" aria-label="Example website identity">
      <div className="artifact-browser"><i /><i /><i /><span>tandem</span></div>
      <p>GOOD COMPANY</p>
      <h2>Same idea.<br />More worlds.</h2>
      <div className="artifact-image"><span /><span /></div>
      <small>Ideas create belonging.</small>
    </div>
  )
}

function CoinArtifact() {
  return (
    <div className="coin-artifact" aria-label="Example coin identity">
      <span>SAME IDEA</span>
      <img src="/assets/tandem-mark.svg" alt="" />
      <b>$GOOD</b>
      <small>ONE SHARED IDENTITY</small>
    </div>
  )
}

function Hero() {
  return (
    <section className="world-hero" id="hero" data-home-section>
      <div className="hero-heading section-shell">
        <p className="eyebrow"><span /> A worldbuilding playground</p>
        <h1 data-reveal><Words text="Ideas become" /><br /><em><Words text="worlds." /></em></h1>
        <p className="hero-lede">A website. A coin. One shared identity.</p>
      </div>
      <div className="hero-composer section-shell">
        <IdeaComposer dark onContinue={idea => navigate('create', idea)} />
      </div>
      <div className="hero-stage" aria-label="A website and coin joined by one visual identity">
        <img
          className="hero-world-image"
          src="/assets/tandem-world-hero-v01.webp"
          alt="Intertwined orange and ivory ribbons forming one continuous world"
          onError={event => {
            event.currentTarget.onerror = null
            event.currentTarget.src = '/assets/tandem-hero.webp'
          }}
        />
        <WebsiteArtifact />
        <CoinArtifact />
      </div>
      <div className="hero-proof section-shell">
        <span><CheckCircle /> One idea in</span>
        <strong>Website <i /> Coin</strong>
        <span><CheckCircle /> Your source out</span>
      </div>
    </section>
  )
}

function Process() {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  const ref = useRef<HTMLElement>(null)
  const steps = [
    { label: 'Describe', title: 'Put the spark into words.', copy: 'Start with one honest sentence. The idea stays visible while the rest of the world takes shape.' },
    { label: 'Choose', title: 'Find its visual direction.', copy: 'Choose one of nine systems for the typography, color, composition, and pace that fit the idea.' },
    { label: 'Refine', title: 'Name both expressions.', copy: 'Shape the project name and ticker while the website and coin identity stay visibly connected.' },
    { label: 'Save', title: 'Keep the draft close.', copy: 'Save the working direction on this device and return through your dashboard when you are ready.' },
  ]

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const scenes = [...root.querySelectorAll<HTMLElement>('[data-process-step]')]
    const desktop = window.matchMedia('(min-width: 1024px)')
    let frame = 0
    const setPhase = (next: number) => {
      if (activeRef.current === next) return
      activeRef.current = next
      setActive(next)
    }
    const update = () => {
      frame = 0
      if (!desktop.matches) {
        setPhase(0)
        return
      }
      const rootBounds = root.getBoundingClientRect()
      if (rootBounds.bottom < 0 || rootBounds.top > window.innerHeight) return
      const anchor = window.innerHeight * .45
      let next = 0
      for (const [index, scene] of scenes.entries()) {
        const bounds = scene.getBoundingClientRect()
        if (bounds.top <= anchor) next = index
        if (bounds.top <= anchor && bounds.bottom > anchor) {
          next = index
          break
        }
      }
      setPhase(next)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    desktop.addEventListener('change', schedule)
    schedule()
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      desktop.removeEventListener('change', schedule)
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }
  }, [])

  return (
    <section className="process section-shell" id="how-it-works" data-home-section ref={ref}>
      <div className="process-intro">
        <p className="eyebrow"><span /> How Tandem works</p>
        <h2 data-reveal><Words text="One spark." /><br /><Words text="Two expressions." /></h2>
        <p>Start with the thought you cannot leave alone. Tandem helps it find a name, a place, and a symbol people can gather around.</p>
      </div>
      <div className="process-scroll">
        <div className="process-scenes">
          {steps.map((step, index) => (
            <article className={active === index ? 'is-active' : ''} data-process-step={index} key={step.label}>
              <span>{String(index + 1).padStart(2, '0')} · {step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
            </article>
          ))}
        </div>
        <div className="process-stage" aria-label={`Step ${active + 1}: ${steps[active].label}. ${steps[active].title} ${steps[active].copy}`}>
          <div className="process-stage-top"><span>{String(active + 1).padStart(2, '0')}</span><b>{steps[active].label}</b></div>
          <div className="process-stage-scenes">
            <div className={`stage-scene stage-idea${active === 0 ? ' is-active' : ''}`} aria-hidden={active !== 0}>
              <div className="stage-sentence">
                <span>ONE HONEST SENTENCE</span>
                <p>A home for independent creators to share work and gather around new ideas.</p>
                <i><Sparkle /> IDEA CAPTURED</i>
              </div>
            </div>
            <div className={`stage-scene stage-choose${active === 1 ? ' is-active' : ''}`} aria-hidden={active !== 1}>
              <div className="stage-look"><img src="/assets/look-signal-v02.webp" alt="" /><span>Signal</span></div>
              <div className="stage-look"><img src="/assets/look-lagoon-v02.webp" alt="" /><span>Lagoon</span></div>
              <div className="stage-look is-chosen"><img src="/assets/look-cobalt-v02.webp" alt="" /><span>Cobalt</span><b><Check /> CHOSEN</b></div>
            </div>
            <div className={`stage-scene stage-refine${active === 2 ? ' is-active' : ''}`} aria-hidden={active !== 2}>
              <div className="stage-website">
                <span><i /><i /><i /> GOOD COMPANY</span>
                <b>Good ideas<br />gather here.</b>
                <small>WEBSITE IDENTITY</small>
              </div>
              <div className="stage-token"><img src="/assets/tandem-mark.svg" alt="" /><b>$GOOD</b><small>COIN IDENTITY</small></div>
            </div>
            <div className={`stage-scene stage-save${active === 3 ? ' is-active' : ''}`} aria-hidden={active !== 3}>
              <div className="stage-saved-card">
                <CheckCircle />
                <span>SAVED DRAFT</span>
                <h4>Good Company</h4>
                <p>$GOOD · Cobalt direction</p>
                <small>ON THIS DEVICE · READY TO REVISIT</small>
              </div>
            </div>
          </div>
          <p><span>01 IDEA</span><i /><span>02 CHOOSE</span><i /><span>03 REFINE</span><i /><span>04 SAVED</span></p>
        </div>
      </div>
    </section>
  )
}

function Looks({ expanded = false }: { expanded?: boolean }) {
  const [filter, setFilter] = useState('All')
  const [preview, setPreview] = useState<typeof LOOKS[number] | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const filters = ['All', 'Bold', 'Atmospheric', 'Structured', 'Natural', 'Editorial', 'Energetic']
  const shown = LOOKS.filter(look => filter === 'All' || look.kind === filter)
  const featured = expanded ? shown : shown.slice(0, 3)
  const compact = expanded ? [] : shown.slice(3)

  useEffect(() => {
    if (preview && !dialog.current?.open) dialog.current?.showModal()
    if (!preview && dialog.current?.open) dialog.current.close()
  }, [preview])

  return (
    <section className={`looks${expanded ? ' explore-page' : ''}`} id={expanded ? undefined : 'looks'} data-home-section={expanded ? undefined : true}>
      <div className="looks-inner section-shell">
        <div className="looks-heading">
          <div>
            <p className="eyebrow"><span /> Nine starting points</p>
            {expanded ? <h1>Different by<br />design.</h1> : <h2 data-reveal><Words text="Different by design." /></h2>}
          </div>
          <p>Your idea deserves its own point of view. Start with a direction, then make it yours.</p>
          {!expanded ? (
            <button className="text-link" onClick={() => navigate('explore')}>Explore all directions <ArrowRight /></button>
          ) : null}
        </div>
        {expanded ? (
          <div className="filters" aria-label="Filter design directions">
            {filters.map(item => (
              <button key={item} aria-pressed={filter === item} className={filter === item ? 'selected' : ''} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
        ) : null}
        <div className="look-grid">
          {featured.map((look, index) => (
            <article className="look-card" data-reveal key={look.id} style={{ '--card-index': index } as CSSProperties}>
              <button className="look-preview" onClick={() => setPreview(look)} aria-label={`Preview ${look.name} direction`}>
                <img src={look.image} alt="" />
                <span>Preview <ArrowUpRight /></span>
              </button>
              <div className="look-meta">
                <div><h3>{look.name}</h3><p>{look.kind}</p></div>
                <button onClick={() => setPreview(look)}>Preview <ArrowRight /></button>
              </div>
              {expanded ? <p className="look-description">{look.desc}</p> : null}
            </article>
          ))}
        </div>
        {compact.length ? (
          <div className="look-compact-grid" aria-label="More creative directions">
            {compact.map((look, index) => (
              <article className="look-compact-card" data-reveal key={look.id} style={{ '--card-index': index + 3 } as CSSProperties}>
                <button onClick={() => setPreview(look)} aria-label={`Preview ${look.name} direction`}>
                  <img src={look.image} alt="" />
                  <span><small>{look.kind}</small><b>{look.name}</b></span>
                  <ArrowUpRight />
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </div>
      <div className="orbit-line" aria-hidden="true" />
      <dialog className="preview-dialog" ref={dialog} aria-labelledby="preview-title" onClose={() => setPreview(null)}>
        <button className="dialog-close" aria-label="Close preview" onClick={() => setPreview(null)}><X /></button>
        {preview ? (
          <>
            <div className="modal-art"><img src={preview.image} alt="" /></div>
            <div className="dialog-copy">
              <span className="dialog-label">{preview.kind} direction</span>
              <h2 id="preview-title">{preview.name}</h2>
              <p>{preview.desc} A visual language ready to meet your idea.</p>
              <button className="button button-orange" onClick={() => { const id = preview.id; setPreview(null); navigate('create', undefined, id) }}>
                Use this direction <ArrowRight />
              </button>
            </div>
          </>
        ) : null}
      </dialog>
    </section>
  )
}

function Ownership() {
  return (
    <section className="ownership section-shell" id="ownership" data-home-section>
      <div className="ownership-heading">
        <p className="eyebrow eyebrow-light"><span /> Made to stay yours</p>
        <h2 data-reveal><Words text="Everything ships" /><br /><Words text="in your name." /></h2>
        <div><p>Your idea stays connected across the source, the place you choose to host it, and the identity that carries into its coin.</p><span><Check /> Full control, when you are ready</span></div>
      </div>
      <div className="ownership-system">
        <div className="ownership-hub" aria-label="Your Tandem project">
          <img src="/assets/tandem-mark.svg" alt="" />
          <span>YOUR PROJECT</span>
          <b>Yours</b>
        </div>
        <svg className="ownership-connectors" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength="1" d="M500 12 V62 M500 62 C500 100 168 70 168 150 M500 62 V150 M500 62 C500 100 832 70 832 150" />
        </svg>
        <div className="ownership-flow" aria-label="Three parts of the ownership model">
          <article data-reveal>
            <div className="ownership-art source-art" aria-hidden="true"><span>project/source</span><b>App.tsx</b><i /><i /><i /><small>repo owner: you</small></div>
            <span>01 · Source / GitHub</span><h3>Editable source, full control.</h3><p>Take the project files and move them into a GitHub repository you control when you are ready.</p>
          </article>
          <article data-reveal>
            <div className="ownership-art hosting-art" aria-hidden="true"><span>YOUR HOSTING</span><b>Your domain</b><small>Your Vercel account</small></div>
            <span>02 · Hosting / Your Vercel</span><h3>Choose where it lives.</h3><p>Connect the source to your own hosting account and domain through the path you choose.</p>
          </article>
          <article data-reveal>
            <div className="ownership-art coin-art" aria-hidden="true"><div><img src="/assets/tandem-mark.svg" alt="" /></div><b>Your ticker</b><span><i>75% you</i><i>25% Tandem</i></span></div>
            <span>03 · Coin identity</span><h3>One name, one visual world.</h3><p>Carry the shared identity forward with the confirmed creator fee split: 75% to you and 25% to Tandem.</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function Fees() {
  const [volumePower, setVolumePower] = useState(5)
  const [rateInput, setRateInput] = useState('0.30')
  const volume = Math.round(10 ** volumePower)
  const parsedRate = Number(rateInput)
  const rateValid = rateInput.trim() !== '' && Number.isFinite(parsedRate) && parsedRate >= 0 && parsedRate <= 10
  const pool = rateValid ? volume * (parsedRate / 100) : null
  const creator = pool === null ? null : pool * .75
  const platform = pool === null ? null : pool * .25
  const money = (value: number) => new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(value)
  const result = (value: number | null) => value === null ? '—' : money(value)
  const normalizeRate = () => {
    const value = rateInput.trim() === '' || !Number.isFinite(parsedRate) ? 0 : parsedRate
    setRateInput(Math.min(10, Math.max(0, value)).toFixed(2))
  }

  return (
    <section className="fees section-shell" id="fees" data-home-section>
      <div className="fees-heading">
        <p className="eyebrow"><span /> A clear split</p>
        <h2 data-reveal><Words text="Creators lead" /><br /><Words text="the value." /></h2>
        <p>Seventy-five percent of the selected fee pool goes to the creator. Tandem receives twenty-five percent.</p>
      </div>
      <div className="split-visual" data-reveal aria-label="75 percent creator, 25 percent Tandem">
        <div><strong>75%</strong><span>Creator</span></div>
        <div><strong>25%</strong><span>Tandem</span></div>
      </div>
      <div className="fee-calculator" data-reveal>
        <div className="calculator-intro">
          <span>Illustration</span>
          <h3>Try the split.</h3>
          <p>An illustration using the volume and fee rate you choose. Actual fees depend on the launch venue.</p>
        </div>
        <div className="calculator-controls">
          <label htmlFor="volume-range"><span>Example volume</span><output htmlFor="volume-range">{money(volume)}</output></label>
          <input id="volume-range" type="range" min="4" max="7" step="0.01" value={volumePower} aria-valuetext={money(volume)} onChange={event => setVolumePower(Number(event.target.value))} />
          <div className="volume-scale"><span>$10K</span><span>$100K</span><span>$1M</span><span>$10M</span></div>
          <label className="rate-field" htmlFor="fee-rate"><span>Fee rate</span><span><input id="fee-rate" type="number" min="0" max="10" step="0.01" inputMode="decimal" value={rateInput} onChange={event => setRateInput(event.target.value)} onBlur={normalizeRate} aria-invalid={!rateValid} aria-describedby="rate-note" />%</span></label>
          <small id="rate-note" className={!rateValid ? 'rate-error' : undefined}>{rateValid ? 'Adjust the example rate between 0% and 10%.' : 'Enter a rate from 0% to 10%. It will be bounded when you leave the field.'}</small>
        </div>
        <div className="calculator-results" aria-live="polite">
          <div><span>Selected fee pool</span><strong>{result(pool)}</strong></div>
          <div><span>Creator · 75%</span><strong>{result(creator)}</strong></div>
          <div><span>Tandem · 25%</span><strong>{result(platform)}</strong></div>
        </div>
      </div>
    </section>
  )
}

type Example = typeof EXAMPLES[number]

function MiniWebsite({ example, compact = false }: { example: Example; compact?: boolean }) {
  const look = LOOKS.find(item => item.id === example.look) || LOOKS[0]
  return (
    <div className={`mini-site${compact ? ' mini-site-compact' : ''}`} data-look={look.id} role="img" aria-label={`${example.name} website concept in the ${look.name} direction`}>
      <div aria-hidden="true" className="mini-site-canvas">
        <div className="mini-site-nav"><b>{example.name}</b><span>About</span><span>Explore</span><i /></div>
        <div className="mini-site-content">
          <div className="mini-site-copy">
            <small>{example.kind} · {look.name}</small>
            <strong>{example.headline}</strong>
            <p>{example.detail}</p>
            <span className="mini-site-action">Enter the world <ArrowUpRight /></span>
          </div>
          <div className="mini-site-visual">
            <img src={look.image} alt="" />
            <span className="mini-site-orbit" />
            <span className="mini-site-panel"><i /><i /><i /></span>
          </div>
        </div>
        <div className="mini-site-foot"><span>{look.kind} direction</span><b>{String(EXAMPLES.indexOf(example) + 1).padStart(2, '0')}</b></div>
      </div>
    </div>
  )
}

function Examples({ refresh }: { refresh: number }) {
  void refresh
  const drafts = readDrafts()
  const rail = useRef<HTMLDivElement>(null)
  const frame = useRef(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [edges, setEdges] = useState({ start: true, end: false })
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const featured = EXAMPLES[featuredIndex]
  const featuredLook = LOOKS.find(look => look.id === featured.look) || LOOKS[0]

  useEffect(() => {
    const element = rail.current
    if (!element) return
    const update = () => {
      frame.current = 0
      const cards = element.querySelectorAll<HTMLElement>('.example-card')
      const bounds = element.getBoundingClientRect()
      const first = cards[0]?.getBoundingClientRect()
      const last = cards[cards.length - 1]?.getBoundingClientRect()
      const next = {
        start: !first || first.left >= bounds.left - 2,
        end: !last || last.right <= bounds.right + 2,
      }
      setEdges(current => current.start === next.start && current.end === next.end ? current : next)
    }
    const onScroll = () => {
      if (!frame.current) frame.current = window.requestAnimationFrame(update)
    }
    element.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      element.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current) window.cancelAnimationFrame(frame.current)
      frame.current = 0
    }
  }, [])

  const move = (direction: -1 | 1) => {
    const element = rail.current
    if (!element) return
    element.scrollBy({
      left: element.clientWidth * .82 * direction,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const chooseLook = (lookId: string) => {
    const representative = EXAMPLES.findIndex(example => example.look === lookId)
    if (representative >= 0) setFeaturedIndex(representative)
  }

  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % LOOKS.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + LOOKS.length) % LOOKS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = LOOKS.length - 1
    else return
    event.preventDefault()
    chooseLook(LOOKS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="examples" id="examples" data-home-section>
      <div className="examples-heading section-shell">
        <div><p className="eyebrow"><span /> Twelve ways in</p><h2 data-reveal><Words text="Start with a useful world." /></h2></div>
        <p>These are concept starters, ready to rewrite around your own audience, purpose, and point of view.</p>
      </div>
      <div className="style-tabs-wrap section-shell">
        <div className="style-tabs" role="tablist" aria-label="Creative directions">
          {LOOKS.map((look, index) => (
            <button
              key={look.id}
              ref={element => { tabRefs.current[index] = element }}
              role="tab"
              id={`style-tab-${look.id}`}
              aria-selected={featuredLook.id === look.id}
              aria-controls="featured-example"
              tabIndex={featuredLook.id === look.id ? 0 : -1}
              onClick={() => chooseLook(look.id)}
              onKeyDown={event => onTabKeyDown(event, index)}
            >
              <i style={{ background: look.color }} />{look.name}
            </button>
          ))}
        </div>
      </div>
      <div className="example-showcase section-shell" id="featured-example" role="tabpanel" aria-labelledby={`style-tab-${featuredLook.id}`}>
        <div className="featured-browser" key={`${featured.name}-${featured.look}`}>
          <div className="browser-chrome" aria-hidden="true"><i /><i /><i /><span>Website preview · {featuredLook.name}</span></div>
          <MiniWebsite example={featured} />
        </div>
        <aside className="featured-details">
          <span>{featured.kind} · {featuredLook.name}</span>
          <h3>{featured.name}</h3>
          <p>{featured.idea}</p>
          <dl><div><dt>Direction</dt><dd>{featuredLook.name}</dd></div><div><dt>Character</dt><dd>{featuredLook.kind}</dd></div></dl>
          <button className="button button-orange" onClick={() => navigate('create', featured.idea, featured.look)}>Use this idea <ArrowRight /></button>
        </aside>
      </div>
      <div className="example-rail-heading section-shell">
        <div><span>All concept starters</span><b>12 projects · 9 directions</b></div>
        <div className="rail-controls">
          <button onClick={() => move(-1)} disabled={edges.start} aria-label="Previous example">←</button>
          <button onClick={() => move(1)} disabled={edges.end} aria-label="Next example">→</button>
        </div>
      </div>
      <div className="example-rail" ref={rail} aria-label="Example project ideas">
        {EXAMPLES.map((example, index) => (
          <article className="example-card" data-active={featuredIndex === index} data-reveal key={example.name}>
            <button className="example-preview-button" onClick={() => setFeaturedIndex(index)} aria-label={`Preview ${example.name}`} aria-pressed={featuredIndex === index}>
              <MiniWebsite example={example} compact />
            </button>
            <div className="example-copy"><span>{example.kind} · {LOOKS.find(look => look.id === example.look)?.name}</span><h3>{example.name}</h3><p>{example.idea}</p></div>
            <button onClick={() => navigate('create', example.idea, example.look)}>Use this idea <ArrowRight /></button>
          </article>
        ))}
      </div>
      <div className="project-index section-shell">
        <div className="project-index-heading"><p className="eyebrow"><span /> Saved on this device</p><h3>Your projects</h3><span>{drafts.length.toString().padStart(2, '0')}</span></div>
        {drafts.length ? (
          <div className="project-table" role="table" aria-label="Your saved projects">
            <div className="project-row project-row-head" role="row"><span role="columnheader">Project</span><span role="columnheader">Direction</span><span role="columnheader">Updated</span><span role="columnheader">Action</span></div>
            {drafts.map(draft => (
              <div className="project-row" role="row" key={draft.id}>
                <span role="cell"><b>{draft.name}</b><small>${draft.ticker}</small></span>
                <span role="cell">{LOOKS.find(look => look.id === draft.look)?.name || 'Signal'}</span>
                <time role="cell">{new Date(draft.savedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                <span role="cell" className="project-action"><button aria-label={`Open ${draft.name} draft`} onClick={() => openDraft(draft)}>Open <ArrowRight /></button></span>
              </div>
            ))}
          </div>
        ) : (
          <div className="project-index-empty"><p>Your saved drafts will appear here. They stay in this browser on this device.</p><button className="button button-orange" onClick={() => navigate('create')}>Create your first project <ArrowRight /></button></div>
        )}
      </div>
    </section>
  )
}

const FAQ_ITEMS = [
  ['What do I need to begin?', 'One clear sentence about your idea is enough. You can shape the name and visual direction as you go.'],
  ['What are the nine creative directions?', 'They are starting systems for typography, color, layout, and pace. Choose one, then shape it around your idea.'],
  ['How do the website and coin work together?', 'They share one name, visual language, and story so the project feels connected wherever people find it.'],
  ['How does the 75/25 split work?', 'The confirmed model assigns 75% of the selected fee pool to the creator and 25% to Tandem.'],
  ['What does the calculator rate mean?', 'It is an adjustable input for exploring the split. The calculator is an illustration, and actual fees depend on the launch venue.'],
  ['Can I edit a saved draft?', 'Yes. Open it from Your projects or the dashboard, revise the idea, name, ticker, or direction, and save it again.'],
  ['Where are drafts stored?', 'Drafts are stored in this browser on this device. Clearing browser storage can remove them.'],
  ['Why connect a wallet?', 'Wallet connection is available as an explicit user-triggered step. Tandem only requests it after you choose a detected provider.'],
  ['Do I own what I create?', 'The product is designed around portable, editable source and an identity you can continue developing.'],
  ['Does Tandem host my website today?', 'This frontend does not publish or host a site. You choose a hosting path when the project is ready.'],
  ['Does saving a draft launch a coin?', 'No. Saving records the draft locally; it does not mint, deploy, sign, or submit a transaction.'],
  ['Can I start without a wallet?', 'Yes. You can describe, name, style, and save a draft without connecting a wallet.'],
]

function FAQ() {
  return (
    <section className="faq-section section-shell" id="faq" data-home-section>
      <div className="faq-heading">
        <p className="eyebrow"><span /> Good questions</p>
        <h2 data-reveal><Words text="Before you begin." /></h2>
      </div>
      <div className="faq-list">
        {FAQ_ITEMS.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}<Plus /></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Closing() {
  return (
    <section className="closing section-shell" id="start" data-home-section>
      <div className="closing-mark"><img src="/assets/tandem-mark.svg" alt="" /></div>
      <p>Bring the idea.<br />Keep the world.</p>
      <h2 data-reveal><Words text="Start in" /><br /><em><Words text="tandem." /></em></h2>
      <button className="button button-ink" onClick={() => navigate('create')}>Create project <ArrowRight /></button>
    </section>
  )
}

function SectionNav({ active }: { active: HomeSectionId }) {
  const activeIndex = HOME_SECTIONS.findIndex(([id]) => id === active)
  const activeLabel = HOME_SECTIONS[activeIndex]?.[1] || 'Idea'
  return (
    <nav className="section-nav" aria-label="Home sections" style={{ '--section-progress': (activeIndex + 1) / HOME_SECTIONS.length } as CSSProperties}>
      <div className="section-progress" aria-hidden="true"><i /></div>
      <span className="section-nav-current" aria-hidden="true">{activeLabel}</span>
      {HOME_SECTIONS.map(([id, label], index) => (
        <button key={id} onClick={() => goToHomeSection(id)} aria-label={`Go to ${label}`} title={`Go to ${label}`} aria-current={active === id ? 'location' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span><b>{label}</b>
        </button>
      ))}
    </nav>
  )
}

function useHomeExperience(rootRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState<HomeSectionId>('hero')
  const activeRef = useRef<HomeSectionId>('hero')

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = motion.matches
    let revealObserver: IntersectionObserver | null = null
    let heroObserver: IntersectionObserver | null = null
    let heroVisible = true
    let frame = 0
    const hero = root.querySelector<HTMLElement>('.world-hero')
    const pending = pendingHomeSection
    const pendingFrame = pending ? window.requestAnimationFrame(() => {
      document.getElementById(pending)?.scrollIntoView({
        behavior: motion.matches ? 'auto' : 'smooth',
        block: 'start',
      })
      if (pendingHomeSection === pending) pendingHomeSection = null
    }) : 0

    const applyMotionMode = () => {
      reduced = motion.matches
      root.classList.toggle('motion-ready', !reduced)
      if (reduced) {
        root.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => element.classList.add('is-visible'))
        hero?.style.removeProperty('--hero-shift')
      }
    }
    applyMotionMode()
    motion.addEventListener('change', applyMotionMode)

    if (!reduced) {
      revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            revealObserver?.unobserve(entry.target)
          }
        })
      }, { rootMargin: '0px 0px -9%', threshold: .12 })
      root.querySelectorAll('[data-reveal]').forEach(element => revealObserver?.observe(element))
    }

    const sections = [...root.querySelectorAll<HTMLElement>('[data-home-section]')]
    const updateFrame = () => {
      frame = 0
      const anchor = window.innerHeight * .3
      let current = sections[0]
      for (const section of sections) {
        const bounds = section.getBoundingClientRect()
        if (bounds.top <= anchor) current = section
        if (bounds.top <= anchor && bounds.bottom > anchor) {
          current = section
          break
        }
      }
      if (current?.id) {
        const id = current.id as HomeSectionId
        if (activeRef.current !== id) {
          activeRef.current = id
          setActive(id)
        }
      }
      if (!reduced && heroVisible && window.innerWidth > 780) {
        const offset = Math.max(-18, Math.min(18, window.scrollY * .025))
        hero?.style.setProperty('--hero-shift', `${offset}px`)
      } else {
        hero?.style.removeProperty('--hero-shift')
      }
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(updateFrame)
    }

    if (hero) {
      heroObserver = new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting
        schedule()
      }, { rootMargin: '120px' })
      heroObserver.observe(hero)
    }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()

    return () => {
      motion.removeEventListener('change', applyMotionMode)
      revealObserver?.disconnect()
      heroObserver?.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      if (pendingFrame) window.cancelAnimationFrame(pendingFrame)
      root.classList.remove('motion-ready')
      hero?.style.removeProperty('--hero-shift')
    }
  }, [rootRef])

  return active
}

function Home({ refresh }: { refresh: number }) {
  const rootRef = useRef<HTMLElement>(null)
  const active = useHomeExperience(rootRef)
  return (
    <main id="main" className="home-page" ref={rootRef}>
      <Hero /><Process /><Looks /><Ownership /><Fees /><Examples refresh={refresh} /><FAQ /><Closing />
      <SectionNav active={active} />
    </main>
  )
}

function CreatePage({ onSaved }: { onSaved: () => void }) {
  const get = (key: string, fallback = '') => {
    try { return sessionStorage.getItem(key) || fallback } catch { return fallback }
  }
  const [idea, setIdea] = useState(() => get(SESSION.idea))
  const [name, setName] = useState(() => get(SESSION.name))
  const [ticker, setTicker] = useState(() => get(SESSION.ticker))
  const [look, setLook] = useState(() => get(SESSION.look, 'signal'))
  const [editingId, setEditingId] = useState(() => get(SESSION.editing))
  const [saved, setSaved] = useState(() => Boolean(get(SESSION.editing)))
  const [saveError, setSaveError] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const selected = LOOKS.find(item => item.id === look) || LOOKS[0]
  const valid = idea.trim().length >= 20 && name.trim() && ticker.trim()

  const save = () => {
    if (!valid) return
    const id = editingId || crypto.randomUUID()
    const draft: Draft = {
      id,
      name: name.trim(),
      ticker: ticker.trim().toUpperCase().slice(0, 8),
      idea: idea.trim(),
      look,
      savedAt: new Date().toISOString(),
    }
    try {
      const remaining = readDrafts().filter(item => item.id !== id)
      localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...remaining].slice(0, 20)))
      sessionStorage.setItem(SESSION.editing, id)
      sessionStorage.setItem(SESSION.idea, draft.idea)
      sessionStorage.setItem(SESSION.look, draft.look)
      sessionStorage.setItem(SESSION.name, draft.name)
      sessionStorage.setItem(SESSION.ticker, draft.ticker)
      setEditingId(id)
      setSaved(true)
      setSaveError('')
      onSaved()
    } catch {
      setSaved(false)
      setSaveError('This browser could not save the draft. Your work is still visible here.')
    }
  }

  return (
    <main id="main" className="workspace section-shell">
      <div className="page-heading">
        <p className="eyebrow"><span /> Project workspace</p>
        <h1>Give the idea<br /><em>a world.</em></h1>
        <p>Choose the words and visual direction that feel true. Save the draft whenever it clicks.</p>
      </div>
      <div className="workspace-grid">
        <div className="workspace-form">
          <IdeaComposer
            initial={idea}
            compact
            onContinue={value => { setIdea(value); nameRef.current?.focus() }}
            onIdeaChange={value => { setIdea(value); setSaved(false) }}
          />
          <div className="field-pair">
            <label>Project name<input ref={nameRef} value={name} onChange={event => { setName(event.target.value); setSaved(false) }} placeholder="Good Company" /></label>
            <label>Ticker<input value={ticker} maxLength={8} onChange={event => { setTicker(event.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase()); setSaved(false) }} placeholder="GOOD" /></label>
          </div>
          <fieldset>
            <legend>Creative direction</legend>
            <div className="look-picks">
              {LOOKS.map(item => (
                <button type="button" key={item.id} aria-pressed={look === item.id} className={look === item.id ? 'picked' : ''} onClick={() => { setLook(item.id); setSaved(false) }}>
                  <img src={item.image} alt="" />
                  <span><b>{item.name}</b><small>{item.kind}</small></span>
                  {look === item.id ? <Check /> : null}
                </button>
              ))}
            </div>
          </fieldset>
          <button className="button button-orange save-button" disabled={!valid || saved} onClick={save}>
            {saved ? <><Check /> Draft saved</> : <>Save draft <ArrowRight /></>}
          </button>
          {saveError ? <p className="save-error" role="alert">{saveError}</p> : null}
        </div>
        <aside className="output-card" style={{ '--look-accent': selected.color } as CSSProperties}>
          <div className="output-art"><img src={selected.image} alt="" /></div>
          <div className="output-brand"><img src="/assets/tandem-mark.svg" alt="" /><span>Your shared identity</span></div>
          <div className="output-content">
            <code>{ticker ? `$${ticker}` : '$TICKER'}</code>
            <h2>{name || 'Your idea, named.'}</h2>
            <p>{idea || 'Your project statement will take shape here.'}</p>
          </div>
          <div className="output-foot"><i />{selected.name} direction</div>
        </aside>
      </div>
    </main>
  )
}

function Dashboard({ refresh }: { refresh: number }) {
  void refresh
  const drafts = readDrafts()
  return (
    <main id="main" className="dashboard section-shell">
      <div className="page-heading dashboard-heading">
        <p className="eyebrow"><span /> Saved on this device</p>
        <h1>Your worlds,<br /><em>waiting.</em></h1>
        <p>Return to a draft, change its direction, or keep shaping the words.</p>
      </div>
      {drafts.length ? (
        <div className="draft-grid">
          {drafts.map((draft, index) => (
            <article key={draft.id} style={{ '--draft-index': index } as CSSProperties}>
              <span>${draft.ticker}</span>
              <h2>{draft.name}</h2>
              <p>{draft.idea}</p>
              <div>
                <time>{new Date(draft.savedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                <button onClick={() => openDraft(draft)}>Open draft <ArrowRight /></button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div><Compass /></div>
          <span>Nothing saved yet</span>
          <h2>There is room<br />for a new world.</h2>
          <p>Start with one honest sentence. Your drafts will wait here on this device.</p>
          <button className="button button-orange" onClick={() => navigate('create')}>Create your first project <ArrowRight /></button>
        </div>
      )}
    </main>
  )
}

function Footer() {
  return (
    <footer>
      <div className="footer-top section-shell">
        <Brand />
        <p>A website. A coin.<br />One shared identity.</p>
        <nav aria-label="Footer navigation">
          <button onClick={() => goToHomeSection('how-it-works')}>How it works</button>
          <button onClick={() => goToHomeSection('looks')}>Looks</button>
          <button onClick={() => goToHomeSection('ownership')}>Ownership</button>
          <button onClick={() => goToHomeSection('fees')}>Fees</button>
          <button onClick={() => goToHomeSection('examples')}>Examples</button>
          <button onClick={() => goToHomeSection('faq')}>FAQ</button>
          <button onClick={() => navigate('explore')}>Explore all</button>
          <button onClick={() => navigate('dashboard')}>Dashboard</button>
          <button onClick={() => navigate('create')}>Create</button>
        </nav>
        <span>© {new Date().getFullYear()} TANDEM</span>
      </div>
      <div className="footer-wordmark" aria-hidden="true">tandem</div>
    </footer>
  )
}

const walletInfo = {
  phantom: { name: 'Phantom', url: 'https://phantom.com/download', letter: 'P' },
  solflare: { name: 'Solflare', url: 'https://solflare.com/download', letter: 'S' },
  backpack: { name: 'Backpack', url: 'https://backpack.app/download', letter: 'B' },
}

function getProvider(kind: WalletKind): WalletProvider | undefined {
  if (kind === 'phantom') return window.phantom?.solana || (window.solana?.isPhantom ? window.solana : undefined)
  return window[kind]
}

function WalletDialog({
  open,
  onClose,
  address,
  setAddress,
}: {
  open: boolean
  onClose: () => void
  address: string
  setAddress: (value: string) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const requestRef = useRef(0)
  const [status, setStatus] = useState<'idle' | 'pending' | 'missing' | 'error' | 'connected'>('idle')
  const [selected, setSelected] = useState<WalletKind>('phantom')
  const [activeKind, setActiveKind] = useState<WalletKind | null>(null)
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const close = () => {
    setStatus(address ? 'connected' : 'idle')
    setMessage('')
    setCopied(false)
    onClose()
  }

  useEffect(() => {
    if (open) ref.current?.showModal()
    else {
      requestRef.current += 1
      ref.current?.close()
    }
  }, [open])

  useEffect(() => {
    if (!address || !activeKind) return
    const provider = getProvider(activeKind)
    if (!provider) return
    const changed = (key?: PublicKeyLike | null) => setAddress(key?.toString() || '')
    const disconnected = () => setAddress('')
    provider.on?.('accountChanged', changed)
    provider.on?.('disconnect', disconnected)
    return () => {
      if (provider.off) {
        provider.off('accountChanged', changed)
        provider.off('disconnect', disconnected)
      } else {
        provider.removeListener?.('accountChanged', changed)
        provider.removeListener?.('disconnect', disconnected)
      }
    }
  }, [address, activeKind, setAddress])

  const connect = async (kind: WalletKind) => {
    setSelected(kind)
    setMessage('')
    const provider = getProvider(kind)
    if (!provider) {
      setStatus('missing')
      return
    }
    const request = ++requestRef.current
    setStatus('pending')
    try {
      const result = await provider.connect()
      if (request !== requestRef.current) return
      const key = result?.publicKey || provider.publicKey
      if (!key) throw new Error('The wallet did not return an account.')
      setActiveKind(kind)
      setAddress(key.toString())
      setStatus('connected')
    } catch (error) {
      if (request === requestRef.current) {
        setMessage(error instanceof Error ? error.message : 'Connection was not completed.')
        setStatus('error')
      }
    }
  }

  const disconnect = async () => {
    requestRef.current += 1
    const provider = activeKind ? getProvider(activeKind) : undefined
    try {
      await provider?.disconnect?.()
      setAddress('')
      setActiveKind(null)
      setStatus('idle')
      setMessage('')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The wallet could not disconnect.')
      setStatus('error')
    }
  }

  const copy = async () => {
    setCopied(false)
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setMessage('')
    } catch {
      setMessage('Copy was blocked. Select the address to copy it manually.')
    }
  }

  return (
    <dialog className="wallet-dialog" ref={ref} aria-labelledby="wallet-title" onCancel={event => { event.preventDefault(); close() }} onClose={onClose}>
      <button className="dialog-close" aria-label="Close wallet dialog" onClick={close}><X /></button>
      <div className="wallet-visual"><div className="wallet-orbit" /><img src="/assets/tandem-mark.svg" alt="" /></div>
      <div className="wallet-content">
        {address ? (
          <>
            <span className="dialog-label">Connected account</span>
            <h2 id="wallet-title">You are connected.</h2>
            <button className="address-box" onClick={copy}><code>{address}</code>{copied ? <Check /> : <Clipboard />}</button>
            {message ? <div className="wallet-message error" role="alert"><p>{message}</p></div> : null}
            <div className="wallet-actions">
              <button className="button button-outline" onClick={disconnect}>Disconnect</button>
              <button className="button button-orange" onClick={close}>Continue <ArrowRight /></button>
            </div>
          </>
        ) : (
          <>
            <span className="dialog-label">Solana wallet</span>
            <h2 id="wallet-title">Choose your wallet.</h2>
            <p>Your wallet opens only after you select it.</p>
            <div className="wallet-list">
              {(Object.keys(walletInfo) as WalletKind[]).map(kind => (
                <button key={kind} onClick={() => connect(kind)} disabled={status === 'pending'}>
                  <span>{walletInfo[kind].letter}</span>
                  <b>{walletInfo[kind].name}</b>
                  <small>{status === 'pending' && selected === kind ? 'Opening…' : getProvider(kind) ? 'Detected' : 'Not detected'}</small>
                  <ArrowRight />
                </button>
              ))}
            </div>
            {status === 'pending' ? <p role="status">Opening {walletInfo[selected].name}…</p> : null}
            {status === 'missing' ? (
              <div className="wallet-message" role="status">
                <p>{walletInfo[selected].name} is not installed in this browser.</p>
                <a href={walletInfo[selected].url} target="_blank" rel="noreferrer">Get {walletInfo[selected].name}<ArrowUpRight /></a>
              </div>
            ) : null}
            {status === 'error' ? (
              <div className="wallet-message error" role="alert"><p>{message || 'Connection was not completed.'}</p><button onClick={() => connect(selected)}>Try again</button></div>
            ) : null}
          </>
        )}
      </div>
    </dialog>
  )
}

export default function App() {
  const parseRoute = (): Route => {
    const value = window.location.hash.slice(1)
    return value === 'explore' || value === 'dashboard' || value === 'create' ? value : 'home'
  }
  const [route, setRoute] = useState<Route>(parseRoute)
  const [walletOpen, setWalletOpen] = useState(false)
  const [address, setAddress] = useState('')
  const [refresh, setRefresh] = useState(0)
  const [createKey, setCreateKey] = useState(0)
  const [routeTransition, setRouteTransition] = useState<{ phase: 'idle' | 'covering' | 'revealing'; label: string }>({ phase: 'idle', label: '' })
  const routeRef = useRef(route)

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let coverTimer = 0
    let revealTimer = 0
    let focusFrame = 0
    let token = 0
    let requested = routeRef.current
    let transitioning = false
    const labels: Record<Route, string> = { home: 'Ideas become worlds', explore: 'Explore directions', create: 'Create a project', dashboard: 'Your projects' }
    const clearSchedule = () => {
      if (coverTimer) window.clearTimeout(coverTimer)
      if (revealTimer) window.clearTimeout(revealTimer)
      if (focusFrame) window.cancelAnimationFrame(focusFrame)
      coverTimer = 0
      revealTimer = 0
      focusFrame = 0
    }
    const releaseMain = () => document.getElementById('main')?.removeAttribute('inert')
    const focusMain = () => {
      focusFrame = 0
      const main = document.getElementById('main')
      main?.removeAttribute('inert')
      if (!document.querySelector('dialog[open]')) {
        main?.setAttribute('tabindex', '-1')
        main?.focus({ preventScroll: true })
      }
    }
    const commit = (next: Route, currentToken: number, animate: boolean) => {
      if (currentToken !== token) return
      routeRef.current = next
      setRoute(next)
      window.scrollTo({ top: 0, behavior: 'instant' })
      focusFrame = window.requestAnimationFrame(focusMain)
      if (!animate) {
        transitioning = false
        setRouteTransition({ phase: 'idle', label: '' })
        return
      }
      setRouteTransition({ phase: 'revealing', label: labels[next] })
      revealTimer = window.setTimeout(() => {
        if (currentToken === token) {
          transitioning = false
          setRouteTransition({ phase: 'idle', label: '' })
        }
      }, 290)
    }
    const begin = (next: Route) => {
      requested = next
      if (next !== 'home') pendingHomeSection = null
      token += 1
      const currentToken = token
      clearSchedule()
      if (next === routeRef.current) {
        transitioning = false
        releaseMain()
        setRouteTransition({ phase: 'idle', label: '' })
        return
      }
      if (motion.matches) {
        commit(next, currentToken, false)
        return
      }
      transitioning = true
      document.getElementById('main')?.setAttribute('inert', '')
      setRouteTransition({ phase: 'covering', label: labels[next] })
      coverTimer = window.setTimeout(() => commit(next, currentToken, true), 190)
    }
    const onHash = () => begin(parseRoute())
    const onNew = () => setCreateKey(value => value + 1)
    const onMotion = () => {
      if (!motion.matches || !transitioning) return
      token += 1
      const currentToken = token
      clearSchedule()
      commit(requested, currentToken, false)
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('tandem:new-project', onNew)
    motion.addEventListener('change', onMotion)
    return () => {
      token += 1
      clearSchedule()
      releaseMain()
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('tandem:new-project', onNew)
      motion.removeEventListener('change', onMotion)
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#main" onClick={event => {
        event.preventDefault()
        const main = document.getElementById('main')
        main?.setAttribute('tabindex', '-1')
        main?.focus()
      }}>Skip to content</a>
      <Header route={route} onWallet={() => setWalletOpen(true)} address={address} />
      {route === 'home' ? <Home refresh={refresh} /> : route === 'explore' ? <main id="main"><Looks expanded /></main> : route === 'create' ? <CreatePage key={createKey} onSaved={() => setRefresh(value => value + 1)} /> : <Dashboard refresh={refresh} />}
      <Footer />
      <div className="route-curtain" data-phase={routeTransition.phase} aria-hidden="true">
        <div className="route-curtain-mark"><img src="/assets/tandem-mark.svg" alt="" /><b>tandem</b></div>
        <span>{routeTransition.label}</span>
        <i /><i />
      </div>
      <WalletDialog open={walletOpen} onClose={() => setWalletOpen(false)} address={address} setAddress={setAddress} />
    </>
  )
}
