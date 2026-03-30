'use client'

import React, { useState } from 'react'
import { OSI_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'
import type { EncapBlock } from './LayerBand'
import { DataCore } from './DataCore'
import type { Phase } from '@/hooks/useOsiState'

interface Props {
  activeIndex: number
  onNext: () => void
  phase: Phase
  l1Ref?: React.RefObject<HTMLDivElement | null>
  userText: string
  onUserTextChange: (text: string) => void
}

/**
 * 构建到第 layerIndex 层为止的水平封装方块。
 * selectedProtocols: 每层用户已选中的协议名（index 对应 OSI_LAYERS）。
 * 用选中协议的 displayName 作为该层载荷标签，使高层选择能级联到低层。
 */
function buildBlocks(
  upTo: number,
  userText: string,
  selectedProtocols: Record<number, string>,
): EncapBlock[] {
  const blocks: EncapBlock[] = []
  for (let i = upTo; i >= 0; i--) {
    const l = OSI_LAYERS[i]
    let label: string
    if (i === 0) {
      // 原始数据：显示用户输入文字；无输入时用 L7 选中协议的 displayName
      label = userText.trim()
        ? (userText.length > 12 ? userText.slice(0, 12) + '…' : userText)
        : (l.protocolDetails?.[selectedProtocols[i] ?? l.protocols[0]]?.displayName ?? l.encapsulation)
    } else {
      // 已封装层：用该层选中协议的 displayName，体现用户的协议选择
      const chosen = selectedProtocols[i] ?? l.protocols[0]
      label = l.protocolDetails?.[chosen]?.displayName ?? l.encapsulation
    }
    if (label) blocks.push({
      label,
      colorFrom: l.senderColor.from,
      colorTo: l.senderColor.to,
    })
  }
  // L2 数据链路层封装时追加 FCS 尾部
  if (upTo >= 5) {
    const l2 = OSI_LAYERS[5]
    blocks.push({ label: 'FCS 校验', colorFrom: l2.senderColor.from, colorTo: l2.senderColor.to })
  }
  return blocks
}

export function SenderColumn({ activeIndex, onNext, phase, l1Ref, userText, onUserTextChange }: Props) {
  const canAdvance = phase === 'sending' && activeIndex < 7

  // 每层选中的协议，key = OSI_LAYERS index，初始为各层第一个协议
  const [selectedProtocols, setSelectedProtocols] = useState<Record<number, string>>(
    () => Object.fromEntries(OSI_LAYERS.map((l, i) => [i, l.protocols[0]]))
  )

  const handleProtocolChange = (layerIndex: number, protocol: string) => {
    setSelectedProtocols(prev => ({ ...prev, [layerIndex]: protocol }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">发送端</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <DataCore variant="sender" userText={userText} onUserTextChange={onUserTextChange} />
      {activeIndex === 0 && !userText.trim() && (
        <p className="text-xs text-gray-400 text-center mb-2">
          在上方输入内容，然后点击「下一层」开始封装
        </p>
      )}
      <div className="flex flex-col flex-1 overflow-y-auto">
        {OSI_LAYERS.map((layer, i) => (
          <LayerBand
            key={layer.level}
            layer={layer}
            status={i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'inactive'}
            colorFrom={layer.senderColor.from}
            colorTo={layer.senderColor.to}
            blocks={i === activeIndex ? buildBlocks(i, userText, selectedProtocols) : []}
            detail={i === activeIndex ? layer.encapDetail : undefined}
            activeProtocol={selectedProtocols[i]}
            onProtocolChange={(p) => handleProtocolChange(i, p)}
            bandRef={i === 6 ? l1Ref : undefined}
          />
        ))}
      </div>
      {canAdvance && (
        <button
          onClick={onNext}
          className="mt-3 w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all"
        >
          下一层 →
        </button>
      )}
    </div>
  )
}
