'use client'

import { useState } from 'react'
import { OSI_LAYERS, RECEIVER_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'

interface Props {
  onReset: () => void
}

export function CompletionView({ onReset }: Props) {
  const [replayKeys, setReplayKeys] = useState({
    sender: Array<number>(7).fill(0),
    receiver: Array<number>(7).fill(0),
  })
  const [active, setActive] = useState<{ side: 'sender' | 'receiver'; index: number } | null>(null)

  const handleReplay = (side: 'sender' | 'receiver', index: number) => {
    setActive({ side, index })
    setReplayKeys((prev) => ({
      ...prev,
      [side]: prev[side].map((k, i) => (i === index ? k + 1 : k)),
    }))
    setTimeout(() => setActive(null), 700)
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto py-8 px-4">
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 mb-2">传输完成</div>
        <div className="text-sm text-gray-400">点击任意层条带可重播该层动画</div>
      </div>

      <div className="flex gap-6 w-full">
        <div className="flex-1">
          <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">
            发送端（封装）
          </div>
          {OSI_LAYERS.map((layer, i) => (
            <div key={layer.level} className="cursor-pointer" onClick={() => handleReplay('sender', i)}>
              <LayerBand
                layer={layer}
                status={active?.side === 'sender' && active.index === i ? 'active' : 'done'}
                colorFrom={layer.senderColor.from}
                colorTo={layer.senderColor.to}
                replayKey={replayKeys.sender[i]}
              />
            </div>
          ))}
        </div>

        <div className="flex-1">
          <div className="text-[10px] font-semibold text-gray-400 mb-2 uppercase tracking-widest">
            接收端（解封）
          </div>
          {RECEIVER_LAYERS.map((layer, i) => (
            <div key={layer.level} className="cursor-pointer" onClick={() => handleReplay('receiver', i)}>
              <LayerBand
                layer={layer}
                status={active?.side === 'receiver' && active.index === i ? 'active' : 'done'}
                colorFrom={layer.receiverColor.from}
                colorTo={layer.receiverColor.to}
                replayKey={replayKeys.receiver[i]}
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        className="px-8 py-3 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50 active:scale-95 transition-all"
      >
        重新开始
      </button>
    </div>
  )
}
