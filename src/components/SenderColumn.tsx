'use client'

import { OSI_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'
import type { EncapBlock } from './LayerBand'
import { DataCore } from './DataCore'
import type { Phase } from '@/hooks/useOsiState'

interface Props {
  activeIndex: number
  onNext: () => void
  phase: Phase
}

/**
 * 构建到第 layerIndex 层为止的水平封装方块
 * 最新的头部在最左边，原始数据在最右边
 * 例如 L5 active: [会话ID][SSL加密][HTTP请求]
 */
function buildBlocks(upTo: number): EncapBlock[] {
  const blocks: EncapBlock[] = []
  for (let i = upTo; i >= 0; i--) {
    const l = OSI_LAYERS[i]
    blocks.push({
      label: l.encapsulation,
      colorFrom: l.senderColor.from,
      colorTo: l.senderColor.to,
    })
  }
  return blocks
}

export function SenderColumn({ activeIndex, onNext, phase }: Props) {
  const canAdvance = phase === 'sending' && activeIndex < 7

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">发送端</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <DataCore variant="sender" />
      <div className="flex flex-col overflow-y-auto">
        {OSI_LAYERS.map((layer, i) => (
          <LayerBand
            key={layer.level}
            layer={layer}
            status={i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'inactive'}
            colorFrom={layer.senderColor.from}
            colorTo={layer.senderColor.to}
            blocks={i === activeIndex ? buildBlocks(i) : []}
            detail={i === activeIndex ? layer.encapDetail : undefined}
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
