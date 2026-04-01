'use client'

import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { OSI_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'
import type { EncapBlock } from './LayerBand'
import { DataCore } from './DataCore'
import type { Phase } from '@/hooks/useOsiState'

interface Props {
  activeIndex: number  // 0=L1 active, 1=L2 active, ..., 6=L7 active, 7=done
  onNext: () => void
  onComplete: () => void
  phase: Phase
  l1Ref?: React.RefObject<HTMLDivElement | null>
  userText: string
  highlightReceiverLayer?: number | null
}

/**
 * 接收端方块：显示剩余未解封的封装。
 * selectedProtocols: 每层选中的协议，用于将该层的 displayName 显示到对应载荷方块上。
 */
function buildReceiverBlocks(
  receiverActive: number,
  userText: string,
  selectedProtocols: Record<number, string>,
): EncapBlock[] {
  if (receiverActive < 0) return []
  // OSI_LAYERS: [L7(0), L6(1), ..., L1(6)]
  // 当前解封层在 OSI_LAYERS 的 index = 6 - receiverActive
  // 剩余方块 = index 0 到 6 - receiverActive
  const endIndex = 6 - receiverActive
  const blocks: EncapBlock[] = []
  for (let i = endIndex; i >= 0; i--) {
    const l = OSI_LAYERS[i]
    let label: string
    if (i === 0) {
      label = userText.trim()
        ? (userText.length > 12 ? userText.slice(0, 12) + '…' : userText)
        : (l.protocolDetails?.[selectedProtocols[i] ?? l.protocols[0]]?.displayName ?? l.encapsulation)
    } else {
      const chosen = selectedProtocols[i] ?? l.protocols[0]
      label = l.protocolDetails?.[chosen]?.displayName ?? l.encapsulation
    }
    if (label) blocks.push({
      label,
      colorFrom: l.receiverColor.from,
      colorTo: l.receiverColor.to,
    })
  }
  // L2 尚未解封时保留 FCS 尾部（endIndex >= 5 表示 L2 块仍在）
  if (endIndex >= 5) {
    const l2 = OSI_LAYERS[5]
    blocks.push({ label: 'FCS 校验', colorFrom: l2.receiverColor.from, colorTo: l2.receiverColor.to })
  }
  return blocks
}

export function ReceiverColumn({ activeIndex, onNext, onComplete, phase, l1Ref, userText, highlightReceiverLayer }: Props) {
  const canAdvance = phase === 'receiving' && activeIndex >= 0 && activeIndex < 7
  const activeLayerRef = useRef<HTMLDivElement>(null)

  const [selectedProtocols, setSelectedProtocols] = useState<Record<number, string>>(
    () => Object.fromEntries(OSI_LAYERS.map((l, i) => [i, l.protocols[0]]))
  )

  const handleProtocolChange = (layerIndex: number, protocol: string) => {
    setSelectedProtocols(prev => ({ ...prev, [layerIndex]: protocol }))
  }

  // 显示顺序同发送端：OSI_LAYERS (L7=index0 在上, L1=index6 在下)
  // receiverActive=0 → L1 active → 显示 index 6 active
  // receiverActive=1 → L2 active → 显示 index 5 active
  const activeDisplayIndex = activeIndex >= 0 && activeIndex < 7 ? 6 - activeIndex : -1
  const currentLayer = activeDisplayIndex >= 0 ? OSI_LAYERS[activeDisplayIndex] : undefined

  const handleNext = () => {
    const band = activeLayerRef.current
    if (!band) { onNext(); return }
    const firstBlock = band.querySelector('.encap-block')
    if (!firstBlock) { onNext(); return }

    gsap.to(firstBlock, {
      scaleX: 0,
      opacity: 0,
      transformOrigin: 'left center',
      duration: 0.35,
      ease: 'power2.in',
      onComplete: onNext,
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">接收端</span>
      </div>
      {activeIndex >= 7 ? (
        <DataCore variant="receiver" userText={userText} />
      ) : activeIndex === 6 ? (
        /* L7 正在处理：已还原，显示正常样式 */
        <div className="rounded-xl px-4 py-3 mb-3 border border-emerald-300 bg-emerald-50/80">
          <div className="text-[10px] text-emerald-600 font-semibold mb-1">原始数据</div>
          <div className="font-semibold text-xs text-emerald-800">{userText}</div>
        </div>
      ) : (
        /* 等待占位：与 DataCore 等高，不隐藏，给用户视觉反馈 */
        <div className="rounded-xl px-4 py-3 mb-3 border-2 border-dashed border-blue-400 bg-blue-100/70">
          <div className="text-[10px] text-blue-600 font-semibold mb-1">等待接收</div>
          {userText.trim() ? (
            <div className="font-semibold text-xs text-gray-300 py-0.5">{userText}</div>
          ) : (
            <div className="font-semibold text-xs text-teal-600 py-0.5">— — —</div>
          )}
        </div>
      )}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {OSI_LAYERS.map((layer, i) => {
          let status: 'inactive' | 'active' | 'done'
          if (activeIndex < 0) {
            status = 'inactive'
          } else if (i > activeDisplayIndex) {
            status = 'done'    // 下方的层已解封
          } else if (i === activeDisplayIndex) {
            status = 'active'
          } else {
            status = 'inactive' // 上方的层还没到
          }

          const mergedRef = (i === 6 && i === activeDisplayIndex)
            ? (el: HTMLDivElement | null) => {
                (activeLayerRef as { current: HTMLDivElement | null }).current = el
                if (l1Ref) (l1Ref as { current: HTMLDivElement | null }).current = el
              }
            : i === activeDisplayIndex ? activeLayerRef
            : i === 6 ? l1Ref
            : undefined

          return (
            <LayerBand
              key={layer.level}
              layer={layer}
              status={status}
              colorFrom={layer.receiverColor.from}
              colorTo={layer.receiverColor.to}
              blocks={i === activeDisplayIndex ? buildReceiverBlocks(activeIndex, userText, selectedProtocols) : []}
              detail={i === activeDisplayIndex ? currentLayer?.decapDetail : undefined}
              activeProtocol={selectedProtocols[i]}
              onProtocolChange={(p) => handleProtocolChange(i, p)}
              receiverDescription={layer.receiverDescription}
              variant="receiver"
              lockDetail
              bandRef={mergedRef}
              highlight={highlightReceiverLayer === i}
            />
          )
        })}
      </div>
      {canAdvance && (
        <button
          onClick={handleNext}
          className="mt-3 w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all"
        >
          向上交付解封装
        </button>
      )}
      {activeIndex >= 7 && phase === 'receiving' && (
        <button
          onClick={onComplete}
          className="mt-3 w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
        >
          查看完整回顾 →
        </button>
      )}
    </div>
  )
}
