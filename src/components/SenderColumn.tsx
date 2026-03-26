'use client'

import React from 'react'
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
 * 构建到第 layerIndex 层为止的水平封装方块
 * 最新的头部在最左边，原始数据在最右边
 * 最右边一块的 label 显示 userText（截断到 12 字符）
 */
function buildBlocks(upTo: number, userText: string): EncapBlock[] {
  const blocks: EncapBlock[] = []
  for (let i = upTo; i >= 0; i--) {
    const l = OSI_LAYERS[i]
    // 最右边（i=0，原始数据层）用 userText 替换
    const label = i === 0
      ? (userText.trim()
          ? (userText.length > 12 ? userText.slice(0, 12) + '…' : userText)
          : l.encapsulation)
      : l.encapsulation
    if (label) blocks.push({
      label,
      colorFrom: l.senderColor.from,
      colorTo: l.senderColor.to,
    })
  }
  return blocks
}

export function SenderColumn({ activeIndex, onNext, phase, l1Ref, userText, onUserTextChange }: Props) {
  const canAdvance = phase === 'sending' && activeIndex < 7

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
            blocks={i === activeIndex ? buildBlocks(i, userText) : []}
            detail={i === activeIndex ? layer.encapDetail : undefined}
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
