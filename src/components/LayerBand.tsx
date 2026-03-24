'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { OsiLayer } from '@/data/osi-layers'

export type BandStatus = 'inactive' | 'active' | 'done'

interface LayerBandProps {
  layer: OsiLayer
  status: BandStatus
  colorFrom: string
  colorTo: string
  replayKey?: number
}

export function LayerBand({ layer, status, colorFrom, colorTo, replayKey = 0 }: LayerBandProps) {
  const bandRef = useRef<HTMLDivElement>(null)
  const collapsedRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const band = bandRef.current
    const collapsed = collapsedRef.current
    const content = contentRef.current
    if (!band || !collapsed || !content) return

    if (status === 'active') {
      const tl = gsap.timeline()
      tl.to(band, { height: 76, duration: 0.3, ease: 'power2.out' })
      tl.to(collapsed, { opacity: 0, duration: 0.15 }, 0)
      tl.fromTo(
        Array.from(content.children),
        { opacity: 0, y: 4 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: 'power1.out' },
        0.15
      )
    } else {
      gsap.timeline()
        .to(Array.from(content.children), { opacity: 0, duration: 0.15 }, 0)
        .to(band, { height: 20, duration: 0.25, ease: 'power2.in' }, 0)
        .to(collapsed, { opacity: 1, duration: 0.2 }, 0.1)
    }
  }, [status, replayKey])

  const bandOpacity = status === 'inactive' ? 0.35 : status === 'done' ? 0.65 : 1

  return (
    <div
      ref={bandRef}
      className="w-full rounded-lg overflow-hidden mb-1 select-none"
      style={{
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        opacity: bandOpacity,
        transition: 'opacity 0.3s',
        height: 20,
      }}
    >
      {/* 折叠态：仅显示层号 */}
      <div ref={collapsedRef} className="flex items-center px-3" style={{ height: 20 }}>
        <span className="text-[10px] font-medium text-gray-600">L{layer.level}</span>
      </div>

      {/* 展开态：始终在 DOM，opacity 由 GSAP 控制 */}
      <div ref={contentRef} className="px-3 pb-2" style={{ opacity: 0 }}>
        <div className="text-[10px] text-gray-500 font-medium">
          L{layer.level} · {layer.name}
        </div>
        <div className="text-[17px] font-bold text-gray-800 leading-tight mt-0.5">
          {layer.name}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
          {layer.description}
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {layer.protocols.map((p) => (
            <span
              key={p}
              className="text-[9px] px-1.5 py-0.5 bg-white/60 rounded-full text-gray-600 font-medium"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
