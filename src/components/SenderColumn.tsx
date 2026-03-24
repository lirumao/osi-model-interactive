'use client'

import { OSI_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'
import { DataCore } from './DataCore'
import type { Phase } from '@/hooks/useOsiState'

interface Props {
  activeIndex: number  // 0-6 = 当前激活层；7 = 全部完成
  onNext: () => void
  phase: Phase
}

export function SenderColumn({ activeIndex, onNext, phase }: Props) {
  const canAdvance = phase === 'sending' && activeIndex < 7

  return (
    <div className="flex flex-col h-full">
      <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">
        发送端
      </div>
      <DataCore variant="sender" />
      <div className="flex flex-col flex-1 justify-end">
        {OSI_LAYERS.map((layer, i) => (
          <LayerBand
            key={layer.level}
            layer={layer}
            status={i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'inactive'}
            colorFrom={layer.senderColor.from}
            colorTo={layer.senderColor.to}
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
