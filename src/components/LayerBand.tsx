'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import type { OsiLayer } from '@/data/osi-layers'

export type BandStatus = 'inactive' | 'active' | 'done'

export interface EncapBlock {
  label: string
  colorFrom: string
  colorTo: string
}

interface LayerBandProps {
  layer: OsiLayer
  status: BandStatus
  colorFrom: string
  colorTo: string
  /** 水平排列的累积封装方块（左=最外层头部，右=原始数据） */
  blocks?: EncapBlock[]
  /** 当前层封装的说明文字 */
  detail?: string
  /** 接收端视角的层描述（展开态替换 layer.description） */
  receiverDescription?: string
  /** sender=新方块弹入, receiver=旧方块消失 */
  variant?: 'sender' | 'receiver'
  replayKey?: number
  bandRef?: React.Ref<HTMLDivElement>
  /** 为 true 时触发一次高亮闪烁动画 */
  highlight?: boolean
}

export function LayerBand({ layer, status, colorFrom, colorTo, blocks = [], detail, receiverDescription, variant = 'sender', replayKey = 0, bandRef, highlight = false }: LayerBandProps) {
  const innerBandRef = useRef<HTMLDivElement>(null)
  const collapsedRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const mergedBandRef = (el: HTMLDivElement | null) => {
    innerBandRef.current = el
    if (!bandRef) return
    if (typeof bandRef === 'function') bandRef(el)
    else (bandRef as { current: HTMLDivElement | null }).current = el
  }

  const hasBlocks = status === 'active' && blocks.length > 0
  const hasDetail = hasBlocks && !!detail
  // 基础展开 88px + 方块行 44px + detail 文字行 20px
  const expandedHeight = 88 + (hasBlocks ? 44 : 0) + (hasDetail ? 20 : 0)

  useEffect(() => {
    const band = innerBandRef.current
    const collapsed = collapsedRef.current
    const content = contentRef.current
    if (!band || !collapsed || !content) return

    let tl: gsap.core.Timeline

    if (status === 'active') {
      tl = gsap.timeline()
      tl.to(band, { height: expandedHeight, duration: 0.3, ease: 'power2.out' })
      tl.to(collapsed, { opacity: 0, duration: 0.15 }, 0)

      // 整个内容区 + 所有子元素淡入
      tl.to(content, { opacity: 1, duration: 0.25 }, 0.1)
      tl.to(Array.from(content.children), { opacity: 1, duration: 0.25 }, 0.1)

      // 方块动画
      const blockEls = content.querySelectorAll('.encap-block')
      if (blockEls.length > 0) {
        gsap.set(blockEls, { opacity: 1, scaleX: 1 })

        if (variant === 'sender') {
          // 发送端：最左边的方块（新加的头部）弹性弹入
          const newBlock = blockEls[0]
          tl.fromTo(
            newBlock,
            { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
            { opacity: 1, scaleX: 1, duration: 0.4, ease: 'back.out(2)' },
            0.2
          )
        } else {
          // 接收端：显示一个「被移除」的幽灵方块，从左边缩小消失
          // 用第一个方块的左侧做一个视觉暗示：所有方块先整体右移再归位
          tl.fromTo(
            blockEls,
            { x: -20 },
            { x: 0, duration: 0.4, ease: 'power2.out' },
            0.2
          )
        }
      }
      // 说明文字淡入
      const detailEl = content.querySelector('.encap-detail')
      if (detailEl) {
        gsap.set(detailEl, { opacity: 1 })
        tl.fromTo(detailEl, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)
      }
    } else {
      tl = gsap.timeline()
        .to(Array.from(content.children), { opacity: 0, duration: 0.15 }, 0)
        .to(band, { height: 28, duration: 0.25, ease: 'power2.in' }, 0)
        .to(collapsed, { opacity: 1, duration: 0.2 }, 0.1)
    }

    return () => { tl.kill() }
  }, [status, replayKey, expandedHeight])

  useEffect(() => {
    const band = innerBandRef.current
    if (!band || !highlight) return
    const tl = gsap.timeline()
    tl.to(band, { boxShadow: '0 0 0 3px rgba(255,255,255,0.9), 0 0 12px 4px rgba(255,255,255,0.6)', duration: 0.15, ease: 'power2.out' })
    tl.to(band, { boxShadow: '0 0 0 0px rgba(255,255,255,0)', duration: 0.35, ease: 'power2.in' })
    return () => { tl.kill() }
  }, [highlight])

  const bandOpacity = status === 'done' ? 0.9 : 1

  return (
    <div
      ref={mergedBandRef}
      className="w-full rounded-lg overflow-hidden mb-1 select-none"
      style={{
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        opacity: bandOpacity,
        transition: 'opacity 0.3s',
        height: 28,
      }}
    >
      {/* 折叠态 */}
      <div ref={collapsedRef} className="flex items-center justify-center gap-1.5 px-3" style={{ height: 28 }}>
        <span className="text-[11px] font-semibold text-gray-700">L{layer.level}</span>
        <span className="text-[11px] text-gray-600">{layer.name}</span>
      </div>

      {/* 展开态 */}
      <div ref={contentRef} className="px-3 pb-2 text-center" style={{ opacity: 0 }}>
        <div className="text-[20px] font-bold text-gray-800 leading-tight mt-0.5">
          L{layer.level} · {layer.name}
        </div>
        <div className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
          {variant === 'receiver' && receiverDescription ? receiverDescription : layer.description}
        </div>
        <div className="flex flex-wrap gap-1 mt-1.5 justify-center">
          {layer.protocols.map((p) => (
            <span
              key={p}
              className="text-[9px] px-1.5 py-0.5 bg-white/60 rounded-full text-gray-600 font-medium"
            >
              {p}
            </span>
          ))}
        </div>

        {/* 封装方块行：水平排列，左=最新头部，右=原始数据 */}
        {hasBlocks && (
          <div className="encap-row mt-2 flex flex-col items-center">
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {blocks.map((b, idx) => (
                <div
                  key={idx}
                  className="encap-block flex-shrink-0 flex items-center justify-center rounded text-[10px] font-semibold text-gray-700 whitespace-nowrap"
                  style={{
                    height: 28,
                    padding: '0 10px',
                    background: `linear-gradient(135deg, ${b.colorFrom}, ${b.colorTo})`,
                    border: '1px solid rgba(255,255,255,0.6)',
                  }}
                >
                  {b.label}
                </div>
              ))}
            </div>
            {hasDetail && detail !== layer.description && (
              <div className="encap-detail text-[9px] text-gray-600 mt-1 text-center italic line-clamp-1 max-w-full px-1">
                {detail}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
