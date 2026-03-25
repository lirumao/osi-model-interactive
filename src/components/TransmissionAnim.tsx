'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface Props {
  playing: boolean
  onComplete: () => void
}

export function TransmissionAnim({ playing, onComplete }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasPlayed = useRef(false)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = containerRef.current?.parentElement
    if (!el) return
    const update = () => setSize({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const ro = new ResizeObserver(() => update())
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || hasPlayed.current || size.w === 0) return
    hasPlayed.current = true

    const container = containerRef.current
    if (!container) return

    const path = container.querySelector('#motionPath') as SVGPathElement
    const dot = container.querySelector('#packet') as SVGCircleElement
    const trail = container.querySelector('#trail') as SVGPathElement
    const trackLine = container.querySelector('#trackLine') as SVGPathElement
    if (!path || !dot || !trail || !trackLine) return

    const length = path.getTotalLength()

    const tl = gsap.timeline({ onComplete })

    // 轨迹线渐显
    gsap.set(trackLine, { strokeDasharray: length, strokeDashoffset: length })
    tl.to(trackLine, { strokeDashoffset: 0, duration: 0.4, ease: 'power1.out' }, 0)

    // 发光点沿路径移动
    tl.set(dot, { opacity: 1 }, 0.2)
    tl.to({ t: 0 }, {
      t: 1,
      duration: 1.2,
      ease: 'power1.inOut',
      onUpdate() {
        const progress = (this.targets()[0] as { t: number }).t
        const point = path.getPointAtLength(progress * length)
        gsap.set(dot, { attr: { cx: point.x, cy: point.y } })

        const trailLen = length * 0.2
        const startDist = Math.max(0, progress * length - trailLen)
        gsap.set(trail, {
          strokeDasharray: `${trailLen} ${length}`,
          strokeDashoffset: -startDist,
        })
      },
    }, 0.2)

    tl.to([dot, trail, trackLine], { opacity: 0, duration: 0.3 }, '+=0.1')

    return () => { tl.kill() }
  }, [playing, onComplete, size])

  useEffect(() => {
    if (!playing) hasPlayed.current = false
  }, [playing])

  if (size.w === 0) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20" />
  }

  const { w, h } = size
  // 底部水平连接：发送端 L1 右边 → 接收端 L1 左边
  const leftX = w * 0.48
  const rightX = w * 0.52
  const y = h - 46  // L1 行高度

  const d = `M ${leftX} ${y} L ${rightX} ${y}`

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20">
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <filter id="dotGlow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          id="trackLine"
          d={d}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="2"
          strokeDasharray="5 4"
          opacity="0.3"
        />

        <path id="motionPath" d={d} fill="none" stroke="none" />

        <path
          id="trail"
          d={d}
          fill="none"
          stroke="url(#lineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.5"
          strokeDasharray={`0 ${9999}`}
        />

        <circle
          id="packet"
          r="5"
          fill="#818cf8"
          opacity="0"
          filter="url(#dotGlow)"
        />
      </svg>
    </div>
  )
}
