import { useState, useEffect, useRef } from 'react'

/* ─── ANIMATION INFRASTRUCTURE ──────────────────────────────
   Scroll reveal (fade/directional/pop/draw-on) + count-up +
   typewriter. Kept centralized so every section uses the same
   system instead of one-off effects. */

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal], [data-pop], [data-draw]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function Counter({ value, suffix = '', duration = 1600 }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplay(value)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplay(Math.round(value * eased))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
          obs.unobserve(el)
        })
      },
      { threshold: 0.6 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, duration])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

function TypewriterText({ text, speed = 90 }: { text: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setShown(text)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true)
            obs.unobserve(el)
          }
        })
      },
      { threshold: 0.6 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [started, text])

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [started, text, speed])

  return (
    <span ref={ref}>
      {shown || '\u00A0'}
      {started && shown.length < text.length && <span style={{ opacity: 0.5 }}>|</span>}
    </span>
  )
}

/* ─── Design tokens ─── */
const Y = '#FFB000'
const K = '#030303'
const BG = '#F9F7F3'
const GRAY = '#71717A'
const MID = '#374151'
const BORDER = '#E2DDD6'

const SANS = "'Plus Jakarta Sans', sans-serif"
const SERIF = "'Instrument Serif', serif"

/* ─── Tiny SVG helpers ─── */

function WavyLine({ w = 100, draw = false }: { w?: number; draw?: boolean }) {
  const h = 7
  return (
    <svg
      {...(draw ? { 'data-draw': true } : {})}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      style={{ display: 'block' }}
    >
      <path
        d={`M0 ${h / 2} Q${w * 0.125} 0 ${w * 0.25} ${h / 2} Q${w * 0.375} ${h} ${w * 0.5} ${h / 2} Q${w * 0.625} 0 ${w * 0.75} ${h / 2} Q${w * 0.875} ${h} ${w} ${h / 2}`}
        stroke={Y}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon({ dark }: { dark?: boolean }) {
  return (
    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
      <path d="M1 3L3 5L7 1" stroke={dark ? K : '#fff'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill={filled ? Y : BORDER}>
      <path d="M5.5 1L6.82 4.17L10.27 4.46L7.78 6.64L8.54 10.04L5.5 8.25L2.46 10.04L3.22 6.64L0.73 4.46L4.18 4.17L5.5 1Z" />
    </svg>
  )
}

/* ─── Phone Mockup (decorative boutique UI) ─── */

function PhoneMockup() {
  return (
    <div
      style={{
        width: 170,
        height: 320,
        margin: '0 auto',
        borderRadius: 28,
        border: '7px solid #1A1A1A',
        background: BG,
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 0 0 1.5px rgba(255,255,255,0.1)',
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 52,
          height: 15,
          background: '#1A1A1A',
          borderRadius: '0 0 12px 12px',
          zIndex: 2,
        }}
      />
      {/* Nav */}
      <div
        style={{
          background: BG,
          padding: '18px 10px 7px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ fontSize: 10, fontWeight: 800, color: K, fontFamily: SANS, letterSpacing: -0.3 }}>
          Chariow
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: Y }} />
          <span style={{ fontSize: 7, fontWeight: 700, color: GRAY, fontFamily: SANS }}>Boutique</span>
        </div>
      </div>
      {/* Hero banner */}
      <div
        style={{
          height: 82,
          background: K,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <div style={{ fontSize: 7, letterSpacing: 1.8, color: 'rgba(255,255,255,0.45)', fontWeight: 600, fontFamily: SANS }}>
          PAGE LT1
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: -0.5, fontFamily: SANS }}>
          Phone2Page™
        </div>
        <div
          style={{
            marginTop: 2,
            background: Y,
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: 7.5,
            fontWeight: 700,
            color: K,
            fontFamily: SANS,
          }}
        >
          Voir les offres →
        </div>
      </div>
      {/* Product cards */}
      <div style={{ padding: '8px 8px 0' }}>
        {[
          { name: 'Blueprint Pack', tag: 'Best', dark: false },
          { name: 'Masterclass', tag: 'Pro', dark: true },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              borderRadius: 9,
              background: p.dark ? K : '#FFF8EC',
              padding: '6px 8px',
              marginBottom: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: p.dark ? '#fff' : K, fontFamily: SANS, display: 'block' }}>
                {p.name}
              </span>
              <span
                style={{
                  fontSize: 6,
                  background: Y,
                  color: K,
                  borderRadius: 10,
                  padding: '1px 5px',
                  fontWeight: 800,
                  fontFamily: SANS,
                }}
              >
                {p.tag}
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: Y, fontFamily: SANS }}>→</div>
          </div>
        ))}
      </div>
      {/* CTA */}
      <div style={{ padding: '0 8px 5px' }}>
        <div
          style={{
            background: Y,
            borderRadius: 20,
            padding: '6px 0',
            textAlign: 'center',
            fontSize: 8,
            fontWeight: 800,
            color: K,
            fontFamily: SANS,
          }}
        >
          Découvrir sur la boutique →
        </div>
      </div>
      {/* Trust */}
      <div
        style={{
          padding: '3px 8px',
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {['100% mobile', 'Sécurisé', '48h'].map((t, i) => (
          <span key={i} style={{ fontSize: 5.5, color: GRAY, fontWeight: 600, fontFamily: SANS }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── 1. HEADER ─── */

function Header({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: BG,
        boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.3s ease',
        padding: '13px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: Y,
            boxShadow: `0 0 0 2px ${BG}, 0 0 0 3.5px ${Y}`,
          }}
        />
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 16, color: K, letterSpacing: -0.5 }}>
          Malo GBN
        </span>
      </div>
      <a
        href="https://malogbn.mychariow.online"
        target="_blank"
        rel="noopener noreferrer"
        className="interactive"
        style={{
          background: Y,
          color: K,
          border: 'none',
          borderRadius: 100,
          padding: '9px 20px',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 13,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          boxShadow: '0 4px 14px rgba(255,176,0,0.38)',
          letterSpacing: -0.2,
          textDecoration: 'none',
        }}
      >
        Rejoindre <span style={{ fontSize: 15 }}>→</span>
      </a>
    </header>
  )
}

/* ─── 2. HERO ─── */

function Hero() {
  return (
    <section
      style={{
        paddingTop: 92,
        paddingBottom: 60,
        position: 'relative',
        overflow: 'hidden',
        background: BG,
      }}
    >
      {/* Large yellow circle — partially off right edge */}
      <div
        style={{
          position: 'absolute',
          right: -96,
          top: 30,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: Y,
          zIndex: 0,
        }}
      />

      {/* Small outline square, bottom-left, decorative */}
      <div
        style={{
          position: 'absolute',
          left: -14,
          bottom: 140,
          width: 54,
          height: 54,
          borderRadius: 10,
          border: `2px solid ${K}`,
          opacity: 0.07,
          transform: 'rotate(14deg)',
          zIndex: 0,
        }}
      />

      <div style={{ padding: '0 22px', position: 'relative', zIndex: 1 }}>
        {/* Ribbon badge */}
        <div
          data-reveal
          style={{
            display: 'inline-block',
            background: Y,
            color: K,
            padding: '5px 13px',
            borderRadius: 5,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: 1.8,
            transform: 'rotate(-3deg)',
            marginBottom: 20,
            fontFamily: SANS,
            boxShadow: '0 3px 10px rgba(255,176,0,0.28)',
          }}
        >
          BOUTIQUE PHONE2PAGE™
        </div>

        {/* Hero title */}
        <h1
          data-reveal
          style={{
            fontSize: 50,
            lineHeight: 1.0,
            fontWeight: 800,
            color: K,
            margin: '0 0 14px',
            letterSpacing: -2,
            fontFamily: SANS,
            ['--reveal-delay' as string]: '120ms',
          }}
        >
          Ma
          <br />
          boutique{' '}
          <span style={{ color: Y }}>pro</span>
          <br />
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 52,
              letterSpacing: -1,
            }}
          >
            créée.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          data-reveal
          style={{
            color: GRAY,
            fontSize: 14.5,
            lineHeight: 1.65,
            marginBottom: 28,
            maxWidth: 270,
            fontFamily: SANS,
            fontWeight: 500,
            ['--reveal-delay' as string]: '220ms',
          }}
        >
          La vitrine en ligne qui convertit, construite 100% depuis mon smartphone.
        </p>

        {/* CTA button */}
        <a
          href="#produits"
          data-reveal
          className="pulse-cta"
          style={{
            background: Y,
            color: K,
            border: 'none',
            borderRadius: 100,
            padding: '14px 30px',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 15,
            cursor: 'pointer',
            marginBottom: 36,
            boxShadow: '0 10px 30px rgba(255,176,0,0.48)',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            letterSpacing: -0.3,
            textDecoration: 'none',
            width: 'fit-content',
            ['--reveal-delay' as string]: '320ms',
          }}
        >
          Découvrir la page
          <span style={{ fontSize: 17, fontWeight: 400 }}>→</span>
        </a>

        {/* Stats module — slightly offset from grid */}
        <div
          data-reveal
          style={{
            display: 'inline-flex',
            gap: 20,
            alignItems: 'center',
            marginLeft: -4,
            ['--reveal-delay' as string]: '420ms',
          }}
        >
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: K, fontFamily: SANS, letterSpacing: -1.2, lineHeight: 1 }}>
              <Counter value={10} suffix="+" />
            </div>
            <div style={{ fontSize: 11, color: GRAY, fontWeight: 500, marginTop: 3, fontFamily: SANS }}>
              sites créés
            </div>
          </div>
          <div style={{ width: 1, height: 40, background: BORDER }} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 800, color: K, fontFamily: SANS, letterSpacing: -1.2, lineHeight: 1 }}>
              <Counter value={100} suffix="%" />
            </div>
            <div style={{ fontSize: 11, color: GRAY, fontWeight: 500, marginTop: 3, fontFamily: SANS }}>
              smartphone
            </div>
          </div>
        </div>
      </div>

      {/* Blob + phone mockup */}
      <div style={{ padding: '36px 22px 0', position: 'relative', zIndex: 1 }}>
        {/* Curved arrow from text area toward badge */}
        <svg
          data-draw
          style={{ position: 'absolute', top: 2, right: 64, zIndex: 5, ['--draw-delay' as any]: '900ms' }}
          width="72"
          height="52"
          viewBox="0 0 72 52"
          fill="none"
        >
          <path
            d="M8 44 C18 14 54 6 62 12"
            stroke={K}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="3 4"
            opacity="0.4"
          />
          <path
            d="M59 7 L64 14 L57 16"
            stroke={K}
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          />
        </svg>

        {/* The blob — organic shape: large TR and BL radii */}
        <div
          data-reveal="scale"
          style={{
            background: K,
            borderRadius: '18px 62px 18px 58px',
            padding: '28px 20px 26px',
            position: 'relative',
            boxShadow: '0 28px 70px rgba(0,0,0,0.3)',
            minHeight: 350,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            ['--reveal-delay' as string]: '500ms',
          }}
        >
          <PhoneMockup />

          {/* Handwritten-style signature overlay */}
          <svg
            style={{ position: 'absolute', top: 20, left: 20, opacity: 0.2 }}
            width="90"
            height="30"
            viewBox="0 0 90 30"
            fill="none"
          >
            <path
              d="M4 20 C10 8 18 5 23 11 C27 16 22 24 27 22 C33 19 35 10 44 8 C53 6 55 17 61 14 C67 11 69 6 78 9"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {/* Yellow tape — bottom-left corner */}
          <div
            style={{
              position: 'absolute',
              bottom: 26,
              left: -10,
              width: 72,
              height: 12,
              background: Y,
              opacity: 0.88,
              transform: 'rotate(-13deg)',
              borderRadius: 2,
            }}
          />

          {/* Small dotted decorative path inside blob */}
          <svg
            style={{ position: 'absolute', bottom: 12, right: 18, opacity: 0.15 }}
            width="50"
            height="24"
            viewBox="0 0 50 24"
            fill="none"
          >
            <path
              d="M4 20 C15 4 35 4 46 12"
              stroke={Y}
              strokeWidth="1.5"
              strokeDasharray="3 4"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* P2P™ badge — overlaps the blob top edge */}
        <div
          data-pop
          style={{
            position: 'absolute',
            top: 18,
            right: 36,
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: Y,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 11.5,
            color: K,
            boxShadow: '0 8px 26px rgba(0,0,0,0.28)',
            zIndex: 3,
            textAlign: 'center',
            lineHeight: 1.2,
            ['--pop-delay' as string]: '1000ms',
          }}
        >
          P2P™
        </div>
      </div>
    </section>
  )
}

/* ─── 3. LE PROBLÈME ─── */

function Problem() {
  return (
    <section
      style={{
        padding: '64px 22px 60px',
        background: BG,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Outline square — top right, decorative */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          right: -18,
          width: 60,
          height: 60,
          borderRadius: 12,
          border: `2px solid ${K}`,
          opacity: 0.07,
          transform: 'rotate(20deg)',
        }}
      />

      {/* Three small circles — bottom decoration */}
      <div style={{ position: 'absolute', bottom: 22, right: 22, display: 'flex', gap: 6 }}>
        {[0.1, 0.17, 0.25].map((o, i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: K, opacity: o }} />
        ))}
      </div>

      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          color: GRAY,
          marginBottom: 20,
          fontFamily: SANS,
          textTransform: 'uppercase',
        }}
      >
        Le problème
      </div>

      {/* Quote */}
      <div style={{ marginBottom: 36 }} data-reveal="left">
        <p
          style={{
            fontSize: 23,
            lineHeight: 1.4,
            fontWeight: 700,
            color: K,
            fontFamily: SANS,
            margin: 0,
          }}
        >
          "Vous ne pouvez pas créer de boutique sérieuse sans{' '}
          <span style={{ position: 'relative', display: 'inline-block' }}>
            ordinateur
            <span
              style={{
                position: 'absolute',
                bottom: -6,
                left: 0,
                right: 0,
                display: 'block',
                ['--draw-delay' as any]: '500ms',
              }}
            >
              <WavyLine w={104} draw />
            </span>
          </span>
          ."
        </p>
      </div>

      {/* Response block with thick left border */}
      <div
        data-reveal
        style={{
          paddingLeft: 18,
          borderLeft: `4px solid ${K}`,
          position: 'relative',
          ['--reveal-delay' as string]: '700ms',
        }}
      >
        <p
          style={{
            fontSize: 12,
            color: GRAY,
            fontFamily: SANS,
            margin: '0 0 5px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1.2,
          }}
        >
          Notre réponse
        </p>
        <p
          style={{
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 30,
            color: Y,
            lineHeight: 1.1,
            margin: '0 0 10px',
            fontWeight: 400,
            minHeight: 34,
          }}
        >
          <TypewriterText text="Faux." speed={110} />
        </p>
        <p
          style={{
            fontSize: 14,
            color: MID,
            fontFamily: SANS,
            margin: 0,
            lineHeight: 1.65,
            fontWeight: 500,
            maxWidth: 300,
          }}
        >
          La preuve, c'est cette page. Construite entièrement depuis mon téléphone, avec la méthode Phone2Page™ — celle que je partage juste en dessous.
        </p>
      </div>
    </section>
  )
}

/* ─── 4. PREUVE / BUILD IN PUBLIC ─── */

const SITE_CARDS = [
  { name: 'Reo Interiors', sector: "Design d'intérieur", isBeforeAfter: true, link: 'https://reo-interiors-project01.netlify.app/' },
  { name: 'Le Studio', sector: 'Barbershop & lifestyle', isBeforeAfter: false, link: 'https://lestudio-conceptstore.netlify.app/' },
  { name: 'Novotel Cotonou Orisha', sector: 'Hôtellerie', isBeforeAfter: false, link: 'https://projet-novotel.netlify.app/' },
  { name: 'SMP Motors', sector: 'Concessionnaire auto', isBeforeAfter: false, link: 'https://smp-motors-project.netlify.app/' },
  { name: 'Shoes Galore', sector: 'Chaussures de luxe', isBeforeAfter: false, link: 'https://shoes-galore-project.netlify.app/' },
  { name: 'TKO Space', sector: 'Projet client', isBeforeAfter: false, link: 'https://tko-space-project.netlify.app/' },
]

function LiveBadge() {
  return (
    <div
      style={{
        position: 'absolute',
        top: -8,
        right: -6,
        background: Y,
        color: K,
        fontSize: 7.5,
        fontWeight: 800,
        fontFamily: SANS,
        letterSpacing: 0.8,
        padding: '2.5px 7px',
        borderRadius: 20,
        boxShadow: '0 3px 10px rgba(255,176,0,0.4)',
        zIndex: 4,
      }}
    >
      LIVE
    </div>
  )
}

function BeforeAfterSlider() {
  const [pct, setPct] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = (clientX: number) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPct(Math.max(6, Math.min(94, ((clientX - rect.left) / rect.width) * 100)))
  }

  return (
    <div
      ref={ref}
      style={{ position: 'relative', width: '100%', aspectRatio: '16/9', cursor: 'ew-resize', userSelect: 'none' }}
      onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId) }}
      onPointerMove={(e) => { if (dragging.current) update(e.clientX) }}
      onPointerUp={() => { dragging.current = false }}
      onPointerCancel={() => { dragging.current = false }}
    >
      {/* APRÈS — right side (dark, Phone2Page style) */}
      <div style={{ position: 'absolute', inset: 0, background: '#1A1A1A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8 }}>
        <div style={{ width: 32, height: 3, borderRadius: 2, background: Y, marginBottom: 3 }} />
        <div style={{ width: 52, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ width: 42, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ marginTop: 5, width: 44, height: 14, borderRadius: 7, background: Y, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 2, borderRadius: 1, background: K }} />
        </div>
        <div style={{ position: 'absolute', top: 5, right: 6, fontSize: 6.5, fontWeight: 700, color: 'rgba(255,255,255,0.5)', fontFamily: SANS, letterSpacing: 0.5 }}>
          APRÈS
        </div>
      </div>

      {/* AVANT — left side (plain, basic style), clipped */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#EDE8E1',
          clipPath: `inset(0 ${100 - pct}% 0 0)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          padding: 8,
        }}
      >
        <div style={{ width: 52, height: 3, borderRadius: 2, background: '#C0BAB1', marginBottom: 3 }} />
        <div style={{ width: 44, height: 2, borderRadius: 2, background: '#C8C2BA' }} />
        <div style={{ width: 36, height: 2, borderRadius: 2, background: '#C8C2BA' }} />
        <div style={{ marginTop: 5, width: 44, height: 14, borderRadius: 2, background: '#BFBAB1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 28, height: 2, borderRadius: 1, background: '#A09890' }} />
        </div>
        <div style={{ position: 'absolute', top: 5, left: 6, fontSize: 6.5, fontWeight: 700, color: 'rgba(0,0,0,0.4)', fontFamily: SANS, letterSpacing: 0.5 }}>
          AVANT
        </div>
      </div>

      {/* Divider line */}
      <div
        style={{
          position: 'absolute', top: 0, bottom: 0,
          left: `${pct}%`, width: 2, background: Y,
          transform: 'translateX(-50%)', pointerEvents: 'none',
        }}
      />

      {/* Drag handle */}
      <div
        style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 28, height: 28, borderRadius: '50%',
          background: Y,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
          pointerEvents: 'none',
        }}
      >
        <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
          <path d="M1 4.5H13M1 4.5L4 2M1 4.5L4 7M13 4.5L10 2M13 4.5L10 7" stroke={K} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

function LivePreview({ url }: { url: string }) {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', background: '#F2EEE8' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '400%',
          height: '400%',
          transform: 'scale(0.25)',
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        <iframe
          src={url}
          title="Aperçu du site"
          loading="lazy"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  )
}

function SiteCard({ card }: { card: typeof SITE_CARDS[number] }) {
  return (
    <a
      href={card.link}
      target="_blank"
      rel="noopener noreferrer"
      className="interactive"
      style={{
        display: 'block',
        background: '#fff',
        borderRadius: 14,
        border: `1px solid ${BORDER}`,
        overflow: 'visible',
        boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
        position: 'relative',
        textDecoration: 'none',
      }}
    >
      {/* Preview frame */}
      <div style={{ position: 'relative', margin: '0 0 0', borderRadius: '13px 13px 0 0', overflow: 'hidden', border: `1px solid ${BORDER}` }}>
        <LiveBadge />
        {card.isBeforeAfter ? <BeforeAfterSlider /> : <LivePreview url={card.link} />}
      </div>

      {/* Card footer */}
      <div style={{ padding: '9px 11px 11px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: K, fontFamily: SANS, letterSpacing: -0.2, lineHeight: 1.2 }}>
          {card.name}
        </div>
        <div style={{ fontSize: 10, color: GRAY, fontFamily: SANS, fontWeight: 500, marginTop: 2 }}>{card.sector}</div>
      </div>
    </a>
  )
}

function Proof() {
  const avatarData = [
    { initial: 'M', color: '#C7B8A8', offset: 0 },
    { initial: 'A', color: '#B5C8B0', offset: -3 },
    { initial: 'L', color: '#C8B5B8', offset: 2 },
  ]

  return (
    <section style={{ padding: '60px 22px 52px', background: BG, overflow: 'hidden', position: 'relative' }}>
      {/* Arc behind serif word */}
      <svg
        data-draw
        style={{ position: 'absolute', top: 54, left: 16, zIndex: 0, ['--draw-delay' as any]: '300ms' }}
        width="90"
        height="44"
        viewBox="0 0 90 44"
        fill="none"
      >
        <path d="M6 38 C6 16 84 16 84 38" stroke={Y} strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round" />
      </svg>

      <div data-reveal style={{ marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: GRAY, marginBottom: 12, fontFamily: SANS, textTransform: 'uppercase' }}>
          Build in public
        </div>

        <h2 style={{ fontSize: 32, fontWeight: 800, color: K, margin: '0 0 18px', letterSpacing: -0.9, fontFamily: SANS }}>
          Sites créés.{' '}
          <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 34 }}>Réels.</span>
        </h2>

        {/* Avatars + factual count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {avatarData.map((a, i) => (
              <div
                key={i}
                data-pop
                style={{
                  width: 34, height: 34, borderRadius: '50%',
                  background: a.color, border: `2.5px solid ${BG}`,
                  marginLeft: i === 0 ? 0 : -10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, color: K, fontFamily: SANS,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  ['--pop-delay' as string]: `${i * 140}ms`,
                }}
              >
                {a.initial}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 13, fontFamily: SANS, fontWeight: 500, color: GRAY }}>
            <strong style={{ color: K }}><Counter value={10} suffix="+ sites" /></strong> déjà créés
          </div>
        </div>
      </div>

      {/* 2-col × 3-row grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {SITE_CARDS.map((card, i) => (
          <div key={i} data-reveal style={{ ['--reveal-delay' as string]: `${(i % 2) * 90 + Math.floor(i / 2) * 90}ms` }}>
            <SiteCard card={card} />
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── 5. LES PRODUITS ─── */

function Products() {
  const CHARIOW = 'https://malogbn.mychariow.online'
  return (
    <section
      id="produits"
      style={{
        padding: '58px 22px 64px',
        background: BG,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Outline circle — partially behind dark card */}
      <div
        style={{
          position: 'absolute',
          right: -50,
          bottom: 72,
          width: 160,
          height: 160,
          borderRadius: '50%',
          border: `2px solid ${Y}`,
          opacity: 0.22,
          zIndex: 0,
        }}
      />

      {/* Hatch marks — decorative, bottom-left */}
      <div style={{ position: 'absolute', bottom: 36, left: 18, opacity: 0.14, zIndex: 0 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 22,
              height: 2.5,
              background: K,
              borderRadius: 2,
              transform: `rotate(-42deg) translate(${i * 2}px, ${i * 7}px)`,
              marginBottom: 5,
            }}
          />
        ))}
      </div>

      <div
        data-reveal
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 2,
          color: GRAY,
          marginBottom: 12,
          fontFamily: SANS,
          textTransform: 'uppercase',
        }}
      >
        Les produits
      </div>
      <h2
        data-reveal
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: K,
          margin: '0 0 34px',
          letterSpacing: -0.9,
          fontFamily: SANS,
          ['--reveal-delay' as string]: '80ms',
        }}
      >
        Deux offres,{' '}
        <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: 34 }}>
          une mission.
        </span>
      </h2>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Card 1 — Light/White — Masterclass */}
        <div data-reveal="left" style={{ position: 'relative', marginBottom: -26, zIndex: 2 }}>
          {/* Badge overflowing top edge */}
          <div
            data-pop
            style={{
              position: 'absolute',
              top: -14,
              left: 22,
              zIndex: 3,
              background: Y,
              color: K,
              borderRadius: 100,
              padding: '4px 14px',
              fontSize: 10,
              fontWeight: 800,
              fontFamily: SANS,
              boxShadow: '0 4px 14px rgba(255,176,0,0.38)',
              letterSpacing: 0.2,
              ['--pop-delay' as string]: '300ms',
            }}
          >
            Le système
          </div>

          <div
            style={{
              background: '#FFFCF5',
              borderRadius: '26px 26px 16px 16px',
              padding: '34px 22px 24px',
              border: `1px solid ${BORDER}`,
              boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontSize: 11.5, color: GRAY, fontFamily: SANS, fontWeight: 600, marginBottom: 6 }}>
              Phone2Page™ Masterclass
            </div>
            <div
              style={{
                display: 'inline-block',
                fontSize: 30,
                fontWeight: 800,
                color: K,
                fontFamily: SANS,
                letterSpacing: -1.2,
                marginBottom: 10,
                lineHeight: 1,
              }}
            >
              15 000 FCFA
            </div>
            <p
              style={{
                fontSize: 13.5,
                color: GRAY,
                fontFamily: SANS,
                margin: '0 0 20px',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              La méthode complète pour concevoir, coder et publier des landing pages premium — uniquement depuis ton smartphone.
            </p>
            {['13 chapitres étape par étape', "De l'idée au site publié", 'Workflow complet Figma Make → IA → GitHub → Netlify', 'Accès à vie + futures mises à jour'].map((f, i) => (
              <div
                key={f}
                data-pop
                style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9, ['--pop-delay' as string]: `${i * 90}ms` } as any}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: Y,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon dark />
                </div>
                <span style={{ fontSize: 13.5, color: MID, fontFamily: SANS, fontWeight: 500 }}>{f}</span>
              </div>
            ))}
            <a
              href={CHARIOW}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive"
              style={{
                display: 'block',
                width: '100%',
                background: K,
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '14px 0',
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 14.5,
                cursor: 'pointer',
                marginTop: 10,
                letterSpacing: -0.2,
                textAlign: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              Accéder à la méthode →
            </a>
          </div>
        </div>

        {/* Card 2 — Black — Blueprint Pack */}
        <div data-reveal="right" style={{ position: 'relative', zIndex: 1 }}>
          {/* Badge overflowing top edge */}
          <div
            data-pop
            style={{
              position: 'absolute',
              top: -14,
              right: 22,
              zIndex: 3,
              background: '#fff',
              color: K,
              borderRadius: 100,
              padding: '4px 14px',
              fontSize: 10,
              fontWeight: 800,
              fontFamily: SANS,
              boxShadow: '0 4px 14px rgba(0,0,0,0.16)',
              letterSpacing: 0.2,
              ['--pop-delay' as string]: '350ms',
            }}
          >
            L'accélérateur
          </div>

          <div
            style={{
              background: K,
              borderRadius: '16px 16px 26px 26px',
              padding: '34px 22px 26px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.42)', fontFamily: SANS, fontWeight: 600, marginBottom: 6 }}>
              Blueprint Pack™
            </div>
            <div
              style={{
                display: 'inline-block',
                fontSize: 30,
                fontWeight: 800,
                color: Y,
                fontFamily: SANS,
                letterSpacing: -1.2,
                marginBottom: 10,
                lineHeight: 1,
              }}
            >
              10 000 FCFA
            </div>
            <p
              style={{
                fontSize: 13.5,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: SANS,
                margin: '0 0 20px',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Les prompts exacts que j'utilise pour créer plus vite, écrire de meilleurs textes, générer des designs et guider mes assistants IA.
            </p>
            {['30+ prompts testés en production', 'Copywriting, structure, design & développement', 'Compatibles ChatGPT • Claude • Figma Make', 'Nouveaux prompts ajoutés gratuitement'].map((f, i) => (
              <div
                key={f}
                data-pop
                style={{ display: 'flex', alignItems: 'flex-start', gap: 9, marginBottom: 9, ['--pop-delay' as string]: `${i * 90}ms` } as any}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: Y,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  <CheckIcon dark />
                </div>
                <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.72)', fontFamily: SANS, fontWeight: 500 }}>
                  {f}
                </span>
              </div>
            ))}
            <a
              href={CHARIOW}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive"
              style={{
                display: 'block',
                width: '100%',
                background: Y,
                color: K,
                border: 'none',
                borderRadius: 14,
                padding: '14px 0',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 14.5,
                cursor: 'pointer',
                marginTop: 10,
                boxShadow: '0 8px 22px rgba(255,176,0,0.35)',
                letterSpacing: -0.2,
                textAlign: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              Obtenir le Blueprint →
            </a>
          </div>
        </div>

        {/* Card 3 — Full width, yellow — Creator Bundle */}
        <div data-reveal="scale" style={{ position: 'relative', marginTop: 40, zIndex: 1, ['--reveal-delay' as string]: '150ms' }}>
          <div
            data-pop
            style={{
              position: 'absolute',
              top: -14,
              left: 22,
              zIndex: 3,
              background: K,
              color: Y,
              borderRadius: 100,
              padding: '4px 14px',
              fontSize: 10,
              fontWeight: 800,
              fontFamily: SANS,
              boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
              letterSpacing: 0.2,
              ['--pop-delay' as string]: '380ms',
            }}
          >
            Le plus complet
          </div>

          <div
            style={{
              background: Y,
              borderRadius: 26,
              padding: '36px 22px 26px',
              boxShadow: '0 20px 50px rgba(255,176,0,0.3)',
            }}
          >
            <div style={{ fontSize: 11.5, color: 'rgba(3,3,3,0.55)', fontFamily: SANS, fontWeight: 700, marginBottom: 6 }}>
              Creator Bundle™
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: K, fontFamily: SANS, letterSpacing: -1.2, lineHeight: 1 }}>
                18 000 FCFA
              </span>
              <span style={{ fontSize: 16, fontWeight: 600, color: 'rgba(3,3,3,0.4)', fontFamily: SANS, textDecoration: 'line-through' }}>
                25 000 FCFA
              </span>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: K, fontFamily: SANS, marginBottom: 16 }}>
              Tu économises 7 000 FCFA · Paiement unique
            </div>

            <p
              style={{
                fontSize: 13.5,
                color: 'rgba(3,3,3,0.75)',
                fontFamily: SANS,
                margin: '0 0 18px',
                lineHeight: 1.6,
                fontWeight: 500,
              }}
            >
              Le système complet que j'utilise au quotidien pour créer des landing pages premium depuis mon téléphone — avec les prompts, et un accès direct à moi si tu bloques quelque part.
            </p>

            {[
              'Phone2Page™ Masterclass',
              'Blueprint Pack™',
              'Accès direct à moi sur Telegram',
              'Toutes les futures mises à jour offertes',
              'Réservé aux 45 premiers membres',
            ].map((f, i) => (
              <div
                key={f}
                data-pop
                style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9, ['--pop-delay' as string]: `${i * 80}ms` } as any}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: K,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckIcon />
                </div>
                <span style={{ fontSize: 13.5, color: K, fontFamily: SANS, fontWeight: 600 }}>{f}</span>
              </div>
            ))}

            <a
              href={CHARIOW}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive pulse-cta"
              style={{
                display: 'block',
                width: '100%',
                background: K,
                color: Y,
                border: 'none',
                borderRadius: 14,
                padding: '15px 0',
                fontFamily: SANS,
                fontWeight: 800,
                fontSize: 14.5,
                cursor: 'pointer',
                marginTop: 12,
                letterSpacing: -0.2,
                textAlign: 'center',
                textDecoration: 'none',
                boxSizing: 'border-box',
              }}
            >
              Rejoindre le Creator Bundle →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── 6. CTA FINAL ─── */

function CTAFinal() {
  return (
    <section
      style={{
        background: K,
        padding: '72px 22px 68px',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
    >
      {/* Large yellow OUTLINE circle — halo effect, centered behind title */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 420,
          height: 420,
          borderRadius: '50%',
          border: `2px solid ${Y}`,
          opacity: 0.13,
          zIndex: 0,
          filter: 'blur(2px)',
        }}
      />
      {/* Inner outline ring */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 290,
          height: 290,
          borderRadius: '50%',
          border: `1.5px solid ${Y}`,
          opacity: 0.08,
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }} data-reveal="scale">
        {/* Label */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            color: 'rgba(255,255,255,0.35)',
            marginBottom: 18,
            fontFamily: SANS,
            textTransform: 'uppercase',
          }}
        >
          Prêt à lancer ?
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: 38,
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 10px',
            letterSpacing: -1.2,
            fontFamily: SANS,
            lineHeight: 1.08,
          }}
        >
          La boutique
          <br />
          est{' '}
          <span
            style={{
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontWeight: 400,
              color: Y,
              fontSize: 42,
            }}
          >
            ouverte.
          </span>
        </h2>

        <p
          style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            fontFamily: SANS,
            margin: '0 0 28px',
            lineHeight: 1.65,
            fontWeight: 500,
            maxWidth: 290,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          J'ai déjà créé 10+ sites depuis mon téléphone. Prends la méthode, crée le tien.
        </p>

        {/* Dotted curve path from text toward button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <svg data-draw style={{ ['--draw-delay' as any]: '400ms' }} width="180" height="64" viewBox="0 0 180 64" fill="none">
            <path
              d="M20 8 C56 -8 136 48 162 56"
              stroke={Y}
              strokeWidth="1.5"
              strokeDasharray="4 5"
              strokeLinecap="round"
              opacity="0.38"
            />
            <path
              d="M157 50 L164 58 L156 62"
              stroke={Y}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.38"
              fill="none"
            />
          </svg>
        </div>

        {/* CTA button */}
        <a
          href="https://malogbn.mychariow.online"
          target="_blank"
          rel="noopener noreferrer"
          className="pulse-cta"
          style={{
            background: Y,
            color: K,
            border: 'none',
            borderRadius: 100,
            padding: '16px 36px',
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 18px 44px rgba(255,176,0,0.48)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: -0.3,
            textDecoration: 'none',
          }}
        >
          Découvrir la boutique
          <span style={{ fontSize: 19, fontWeight: 400 }}>→</span>
        </a>

        <p
          style={{
            fontSize: 11.5,
            color: 'rgba(255,255,255,0.28)',
            fontFamily: SANS,
            margin: '18px 0 0',
            fontWeight: 500,
          }}
        >
          Accès immédiat · Sans engagement
        </p>
      </div>
    </section>
  )
}

/* ─── 7. FOOTER ─── */

function Footer() {
  return (
    <footer style={{ background: BG, padding: '42px 22px 34px', borderTop: `1px solid ${BORDER}` }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 22,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: Y,
              boxShadow: `0 0 0 2px ${BG}, 0 0 0 3.5px ${Y}`,
            }}
          />
          <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 15, color: K, letterSpacing: -0.4 }}>
            Malo GBN
          </span>
        </div>
        <span style={{ fontSize: 11.5, color: GRAY, fontFamily: SANS, fontWeight: 700, letterSpacing: -0.2 }}>
          Phone2Page™
        </span>
      </div>

      <div style={{ display: 'flex', gap: 22, marginBottom: 26, flexWrap: 'wrap' as any }}>
        {[
          { label: 'Boutique', href: 'https://malogbn.mychariow.online' },
          { label: 'Masterclass', href: '#produits' },
          { label: 'Blueprint', href: '#produits' },
          { label: 'Contact', href: '#' }, // TODO: lien contact
        ].map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            style={{
              fontSize: 13.5,
              color: GRAY,
              fontFamily: SANS,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 18,
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ fontSize: 11, color: GRAY, opacity: 0.55, fontFamily: SANS }}>
          © 2026 Phone2Page™ — Malo GBN. Tous droits réservés.
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          {['IG', 'TK', 'YT'].map((s) => (
            <div
              key={s}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                border: `1.5px solid ${BORDER}`,
                background: BG,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 8.5,
                fontWeight: 800,
                color: GRAY,
                cursor: 'pointer',
                fontFamily: SANS,
                letterSpacing: 0.5,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

/* ─── ROOT ─── */

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  useScrollReveal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        fontFamily: SANS,
        background: BG,
        overflowX: 'hidden',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      } as any}
    >
      <Header scrolled={scrolled} />
      <Hero />
      <Problem />
      <Proof />
      <Products />
      <CTAFinal />
      <Footer />
    </div>
  )
}
