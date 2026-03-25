'use client'

import { useEffect, useRef, useState } from 'react'
import React from 'react'
import gsap from 'gsap'

interface Props {
  playing: boolean
  onComplete: () => void
  senderL1Ref: React.RefObject<HTMLDivElement | null>
  receiverL1Ref: React.RefObject<HTMLDivElement | null>
}

// 二进制字符流：30个字符，固定序列，带 y 轴偏移
const BITS = [
  { ch: '1', yOff: -2,  delay: 0.00, dur: 1.10 },
  { ch: '0', yOff:  1,  delay: 0.04, dur: 1.05 },
  { ch: '1', yOff: -1,  delay: 0.08, dur: 1.08 },
  { ch: '1', yOff:  2,  delay: 0.11, dur: 1.12 },
  { ch: '0', yOff: -2,  delay: 0.15, dur: 1.00 },
  { ch: '0', yOff:  1,  delay: 0.18, dur: 1.06 },
  { ch: '1', yOff: -3,  delay: 0.22, dur: 1.03 },
  { ch: '0', yOff:  2,  delay: 0.25, dur: 1.09 },
  { ch: '1', yOff: -1,  delay: 0.28, dur: 1.07 },
  { ch: '1', yOff:  3,  delay: 0.32, dur: 1.04 },
  { ch: '0', yOff: -2,  delay: 0.35, dur: 1.11 },
  { ch: '1', yOff:  1,  delay: 0.38, dur: 1.02 },
  { ch: '0', yOff: -1,  delay: 0.41, dur: 1.08 },
  { ch: '0', yOff:  2,  delay: 0.44, dur: 1.05 },
  { ch: '1', yOff: -3,  delay: 0.47, dur: 1.10 },
  { ch: '1', yOff:  1,  delay: 0.50, dur: 1.03 },
  { ch: '0', yOff: -1,  delay: 0.53, dur: 1.06 },
  { ch: '1', yOff:  2,  delay: 0.56, dur: 1.01 },
  { ch: '0', yOff: -2,  delay: 0.59, dur: 1.09 },
  { ch: '1', yOff:  1,  delay: 0.62, dur: 1.04 },
  { ch: '0', yOff: -1,  delay: 0.65, dur: 1.07 },
  { ch: '1', yOff:  2,  delay: 0.68, dur: 1.02 },
  { ch: '0', yOff: -3,  delay: 0.71, dur: 1.05 },
  { ch: '1', yOff:  1,  delay: 0.74, dur: 1.08 },
  { ch: '0', yOff: -1,  delay: 0.77, dur: 1.03 },
]

export function TransmissionAnim({ playing, onComplete, senderL1Ref, receiverL1Ref }: Props) {
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
    const parentEl = container?.parentElement
    const senderEl = senderL1Ref.current
    const receiverEl = receiverL1Ref.current
    if (!container || !parentEl || !senderEl || !receiverEl) return

    const containerRect = parentEl.getBoundingClientRect()
    const senderRect = senderEl.getBoundingClientRect()
    const receiverRect = receiverEl.getBoundingClientRect()
    const leftX = senderRect.right - containerRect.left
    const rightX = receiverRect.left - containerRect.left
    const y = (
      senderRect.top + senderRect.height / 2 +
      receiverRect.top + receiverRect.height / 2
    ) / 2 - containerRect.top

    const fiberCore = container.querySelector('#fiberCore') as SVGLineElement
    const fiberGlow = container.querySelector('#fiberGlow') as SVGLineElement
    if (!fiberCore || !fiberGlow) return

    fiberCore.setAttribute('x1', String(leftX))
    fiberCore.setAttribute('y1', String(y))
    fiberCore.setAttribute('x2', String(rightX))
    fiberCore.setAttribute('y2', String(y))
    fiberGlow.setAttribute('x1', String(leftX))
    fiberGlow.setAttribute('y1', String(y))
    fiberGlow.setAttribute('x2', String(rightX))
    fiberGlow.setAttribute('y2', String(y))

    const tl = gsap.timeline({ onComplete })
    const lastEnd = Math.max(...BITS.map(b => b.delay + b.dur))

    // 光纤线：渐显
    tl.fromTo([fiberCore, fiberGlow],
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' },
      0
    )

    // 二进制字符流
    BITS.forEach(({ yOff, delay, dur }, i) => {
      const el = container.querySelector(`#bit${i}`) as SVGTextElement
      if (!el) return

      gsap.set(el, { attr: { x: leftX, y: y + yOff }, opacity: 0 })
      tl.to(el, { opacity: 1, duration: 0.08 }, 0.1 + delay)
      tl.to(el, { attr: { x: rightX }, duration: dur, ease: 'none' }, 0.1 + delay)
      tl.to(el, { opacity: 0, duration: 0.1 }, 0.1 + delay + dur - 0.08)
    })

    // 光纤线：渐出
    tl.to([fiberCore, fiberGlow], { opacity: 0, duration: 0.4 }, lastEnd + 0.15)

    return () => { tl.kill() }
  }, [playing, onComplete, size, senderL1Ref, receiverL1Ref])

  useEffect(() => {
    if (!playing) hasPlayed.current = false
  }, [playing])

  if (size.w === 0) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20" />
  }

  const { w, h } = size

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20">
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0" style={{ overflow: 'visible' }}>
        <defs>
          {/* 光纤外层光晕 */}
          <filter id="fiberGlowFilter" x="-20%" y="-500%" width="140%" height="1100%">
            <feGaussianBlur stdDeviation="6" result="b1" />
            <feGaussianBlur stdDeviation="12" result="b2" />
            <feMerge>
              <feMergeNode in="b2" />
              <feMergeNode in="b1" />
            </feMerge>
          </filter>
          {/* 二进制字符光晕 */}
          <filter id="bitGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 光纤芯（白色细线） */}
        <line
          id="fiberCore"
          x1="0" y1="0" x2="0" y2="0"
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="1.5"
          opacity="0"
        />
        {/* 光纤辉光 */}
        <line
          id="fiberGlow"
          x1="0" y1="0" x2="0" y2="0"
          stroke="#67e8f9"
          strokeWidth="4"
          opacity="0"
          filter="url(#fiberGlowFilter)"
        />

        {/* 二进制字符 */}
        {BITS.map(({ ch }, i) => (
          <text
            key={i}
            id={`bit${i}`}
            fontSize="8"
            fontFamily="monospace"
            fontWeight="bold"
            fill="#67e8f9"
            textAnchor="middle"
            dominantBaseline="middle"
            opacity="0"
            filter="url(#bitGlow)"
          >
            {ch}
          </text>
        ))}
      </svg>
    </div>
  )
}
