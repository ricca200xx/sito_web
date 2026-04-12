import { useRef, useEffect } from 'react'

/* ═══════════════════════════════════════════════════════════
   Scroll-Driven Canvas Background  v3
   ──────────────────────────────────────────────────────────
   Layer stack (bottom → top):
     1. fill #080808
     2. star field  (200 distant stars, twinkle)
     3. nebula orbs (3 radial blobs, screen blend)
     4. perspective grid (vanishing point reacts)
     5. energy rings (burst on scroll velocity)
     6. particle constellation (250 pts + connections)
     7. scan pulse line
═══════════════════════════════════════════════════════════ */

const NP   = 250          // particles
const NS   = 200          // stars
const CR   = 135          // max connection radius
const B    = [41, 151, 255]
const BD   = [8,  40,  120]

const lerp  = (a, b, t) => a + (b - a) * t
const clamp = (v, a, b) => Math.min(Math.max(v, a), b)
const ease  = t => t < 0.5 ? 2*t*t : -1 + (4-2*t)*t

export default function VideoBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx    = canvas.getContext('2d', { alpha: false })

    let W, H, raf
    let t        = 0
    let scroll   = 0
    let prevRaw  = 0
    let scrollVel = 0

    /* ── mouse tracking (lerped) ── */
    let mouseX = 0.5, mouseY = 0.5
    let targetMX = 0.5, targetMY = 0.5

    const onMouse = (e) => {
      targetMX = e.clientX / window.innerWidth
      targetMY = e.clientY / window.innerHeight
    }
    const onTouch = (e) => {
      if (!e.touches.length) return
      targetMX = e.touches[0].clientX / window.innerWidth
      targetMY = e.touches[0].clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })

    /* ── star field (normalized coords, survive resize) ── */
    const stars = Array.from({ length: NS }, () => ({
      nx:    Math.random(),
      ny:    Math.random(),
      size:  Math.random() * 0.75 + 0.2,
      alpha: Math.random() * 0.35 + 0.08,
      twkl:  Math.random() * Math.PI * 2,
    }))

    /* ── particles ── */
    let pts = []
    const spawnPts = () => {
      pts = Array.from({ length: NP }, () => ({
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * 0.24,
        vy:    (Math.random() - 0.5) * 0.24,
        size:  Math.random() * 1.3 + 0.35,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random(),
      }))
    }

    /* ── energy rings ── */
    const rings = []
    const MAX_RINGS = 18

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
      spawnPts()
    }
    window.addEventListener('resize', resize)
    resize()

    /* ── main loop ── */
    const frame = () => {
      t += 0.007

      /* scroll */
      const raw = window.scrollY / Math.max(
        document.documentElement.scrollHeight - window.innerHeight, 1)
      const target = clamp(raw, 0, 1)
      scrollVel = target - prevRaw
      prevRaw   = target
      scroll    = lerp(scroll, target, 0.055)
      const se  = ease(scroll)

      /* mouse lerp */
      mouseX += (targetMX - mouseX) * 0.055
      mouseY += (targetMY - mouseY) * 0.055
      const mx = mouseX * W
      const my = mouseY * H
      const mOffX = (mouseX - 0.5) * W * 0.12
      const mOffY = (mouseY - 0.5) * H * 0.08

      /* spawn energy rings on fast scroll */
      if (Math.abs(scrollVel) > 0.004 && rings.length < MAX_RINGS) {
        rings.push({
          x:     W * 0.5 + (Math.random() - 0.5) * W * 0.5,
          y:     H * 0.5 + (Math.random() - 0.5) * H * 0.4,
          r:     0,
          maxR:  Math.min(W, H) * (0.12 + Math.random() * 0.22),
          alpha: 0.38 + Math.random() * 0.18,
          spd:   2.2 + Math.random() * 3.0,
        })
      }

      /* ─ 1. fill ───────────────────────────── */
      ctx.fillStyle = '#080808'
      ctx.fillRect(0, 0, W, H)

      /* ─ 2. star field ──────────────────────── */
      for (const s of stars) {
        const a = s.alpha * (0.65 + Math.sin(t * 1.4 + s.twkl) * 0.35)
        ctx.beginPath()
        ctx.arc(s.nx * W, s.ny * H, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(190,215,255,${a})`
        ctx.fill()
      }

      /* ─ 3. nebula orbs (screen blend) ─────── */
      ctx.save()
      ctx.globalCompositeOperation = 'screen'

      // orb A — sinistra→destra
      {
        const cx = lerp(W * 0.10, W * 0.88, se) + mOffX * 0.55
        const cy = lerp(H * 0.18, H * 0.76, se * 0.48) + mOffY * 0.55
        const r  = Math.min(W, H) * lerp(0.62, 0.80, se)
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(${B},${lerp(0.11,0.21,se)})`)
        g.addColorStop(0.5, `rgba(${BD},${lerp(0.07,0.12,se)})`)
        g.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.ellipse(cx, cy, r, r * 0.64, Math.sin(t * 0.065) * 0.28, 0, Math.PI * 2)
        ctx.fill()
      }

      // orb B — destra→sinistra
      {
        const cx = lerp(W * 0.82, W * 0.12, se) - mOffX * 0.70
        const cy = lerp(H * 0.72, H * 0.24, se * 0.52) - mOffY * 0.70
        const r  = Math.min(W, H) * lerp(0.50, 0.60, 1 - se)
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0, `rgba(${BD},${lerp(0.16,0.09,se)})`)
        g.addColorStop(1,  'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.ellipse(cx, cy, r, r * 0.78, Math.cos(t * 0.052) * 0.20, 0, Math.PI * 2)
        ctx.fill()
      }

      // orb C — bloom centrale a metà scroll
      {
        const bloom = Math.max(0, Math.sin(scroll * Math.PI))
        const cx = W * 0.5 + Math.sin(t * 0.10) * W * 0.04
        const cy = H * 0.47 + Math.cos(t * 0.08) * H * 0.04
        const r  = Math.min(W, H) * 0.46
        const g  = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        g.addColorStop(0,   `rgba(88,165,255,${0.11 * bloom})`)
        g.addColorStop(0.5, `rgba(${B},${0.06 * bloom})`)
        g.addColorStop(1,    'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.restore()

      /* ─ 3b. cursor glow ────────────────────── */
      {
        ctx.save()
        ctx.globalCompositeOperation = 'screen'
        const cg = ctx.createRadialGradient(mx, my, 0, mx, my, 200)
        cg.addColorStop(0,   'rgba(41,151,255,0.13)')
        cg.addColorStop(0.4, 'rgba(41,151,255,0.05)')
        cg.addColorStop(1,   'rgba(0,0,0,0)')
        ctx.fillStyle = cg
        ctx.beginPath()
        ctx.arc(mx, my, 200, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      /* ─ 4. griglia prospettica ─────────────── */
      {
        const al  = lerp(0.022, 0.088, scroll)
        const vpX = W / 2
        const vpY = lerp(H * 0.56, H * 0.33, se)
        ctx.save()
        ctx.strokeStyle = `rgba(${B},${al})`
        ctx.lineWidth   = 0.45
        ctx.beginPath()
        for (let i = 0; i <= 14; i++) {
          const bx = lerp(-W * 0.3, W * 1.3, i / 14)
          ctx.moveTo(bx, H)
          ctx.lineTo(vpX, vpY)
        }
        for (let j = 1; j <= 10; j++) {
          const ty = lerp(vpY, H, Math.pow(j / 10, 1.55))
          const sp = lerp(0, W * 2.5, (ty - vpY) / (H - vpY))
          ctx.moveTo(vpX - sp / 2, ty)
          ctx.lineTo(vpX + sp / 2, ty)
        }
        ctx.stroke()
        ctx.restore()
      }

      /* ─ 5. energy rings ───────────────────── */
      ctx.save()
      ctx.lineWidth = 1
      for (let i = rings.length - 1; i >= 0; i--) {
        const rg = rings[i]
        rg.r     += rg.spd
        rg.alpha *= 0.955
        if (rg.alpha < 0.008 || rg.r > rg.maxR) { rings.splice(i, 1); continue }
        ctx.strokeStyle = `rgba(${B},${rg.alpha})`
        ctx.beginPath()
        ctx.arc(rg.x, rg.y, rg.r, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.restore()

      /* ─ 6a. connessioni particelle ─────────── */
      const connR = lerp(CR * 0.68, CR * 1.35, scroll)
      ctx.save()
      ctx.lineWidth = 0.4
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        for (let j = i + 1; j < pts.length; j++) {
          const b  = pts[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          if (Math.abs(dx) > connR || Math.abs(dy) > connR) continue
          const d = Math.hypot(dx, dy)
          if (d < connR) {
            ctx.strokeStyle = `rgba(${B},${(1 - d / connR) * lerp(0.04,0.14,scroll)})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.restore()

      /* ─ 6b. punti particella ───────────────── */
      const REPULSE_R = 110
      for (const p of pts) {
        p.x += p.vx + Math.sin(t * 0.48 + p.phase) * 0.15
        p.y += p.vy + Math.cos(t * 0.43 + p.phase) * 0.15
        p.x += scrollVel * W * 0.07 * (p.depth - 0.5)
        p.y += scrollVel * H * 0.11 * p.depth

        /* mouse repulsion */
        const rdx = p.x - mx, rdy = p.y - my
        if (Math.abs(rdx) < REPULSE_R && Math.abs(rdy) < REPULSE_R) {
          const d = Math.hypot(rdx, rdy)
          if (d < REPULSE_R && d > 0) {
            const force = ((REPULSE_R - d) / REPULSE_R) * 1.4
            p.vx += (rdx / d) * force * 0.14
            p.vy += (rdy / d) * force * 0.14
          }
        }
        p.vx *= 0.968
        p.vy *= 0.968
        if (p.x < -6) p.x = W + 6; if (p.x > W + 6) p.x = -6
        if (p.y < -6) p.y = H + 6; if (p.y > H + 6) p.y = -6

        const sz = p.size * (1 + Math.sin(t * 0.9 + p.phase) * 0.22)
        const gb = lerp(80, 175, p.depth * 0.5 + scroll * 0.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${lerp(18,B[0],p.depth)},${lerp(45,gb,p.depth*.7)},255,${lerp(0.28,0.90,p.depth)*lerp(0.38,0.88,scroll)})`
        ctx.fill()
      }

      /* ─ 7. scan pulse line ─────────────────── */
      {
        const ly = ((t * 50) % (H + 80)) - 40
        const al = lerp(0.03, 0.12, scroll)
        const g  = ctx.createLinearGradient(0, ly - 5, 0, ly + 5)
        g.addColorStop(0,   'rgba(41,151,255,0)')
        g.addColorStop(0.5, `rgba(41,151,255,${al})`)
        g.addColorStop(1,   'rgba(41,151,255,0)')
        ctx.fillStyle = g
        ctx.fillRect(0, ly - 5, W, 10)
      }

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas
        ref={ref}
        style={{
          position: 'fixed', inset: 0,
          width: '100vw', height: '100vh',
          zIndex: -1, display: 'block',
          pointerEvents: 'none',
        }}
      />
      <div style={{
        position: 'fixed', inset: 0, zIndex: -1,
        background: 'linear-gradient(to bottom,rgba(0,0,0,0.44) 0%,transparent 32%,transparent 64%,rgba(0,0,0,0.72) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        height: 1, zIndex: -1,
        background: 'linear-gradient(90deg,transparent,rgba(41,151,255,0.45) 50%,transparent)',
        pointerEvents: 'none',
      }} />
    </>
  )
}
