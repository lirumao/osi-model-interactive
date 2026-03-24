'use client'

import { RECEIVER_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'
import { DataCore } from './DataCore'
import type { Phase } from '@/hooks/useOsiState'

interface Props {
  activeIndex: number  // -1 = 未开始；0-6 = 当前激活；7 = 全部完成
  onNext: () => void
  phase: Phase
}

export function ReceiverColumn({ activeIndex, onNext, phase }: Props) {
  const canAdvance = phase === 'receiving' && activeIndex >= 0 && activeIndex < 7

  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest text-right">
        接收端
      </div>
      <div className="flex flex-col">
        {RECEIVER_LAYERS.map((layer, i) => (
          <LayerBand
            key={layer.level}
            layer={layer}
            status={
              activeIndex < 0
                ? 'inactive'
                : i < activeIndex
                ? 'done'
                : i === activeIndex
                ? 'active'
                : 'inactive'
            }
            colorFrom={layer.receiverColor.from}
            colorTo={layer.receiverColor.to}
          />
        ))}
      </div>
      {activeIndex >= 7 && <DataCore variant="receiver" />}
      {canAdvance && (
        <button
          onClick={onNext}
          className="mt-3 w-full py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 active:scale-95 transition-all"
        >
          解封下一层 →
        </button>
      )}
    </div>
  )
}
