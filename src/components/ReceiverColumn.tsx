'use client'

import React from 'react'
import { OSI_LAYERS } from '@/data/osi-layers'
import { LayerBand } from './LayerBand'
import type { EncapBlock } from './LayerBand'
import { DataCore } from './DataCore'
import type { Phase } from '@/hooks/useOsiState'

interface Props {
  activeIndex: number  // 0=L1 active, 1=L2 active, ..., 6=L7 active, 7=done
  onNext: () => void
  phase: Phase
  l1Ref?: React.RefObject<HTMLDivElement | null>
  userText: string
}

/**
 * 接收端方块：显示剩余未解封的封装
 * receiverActive=0 (L1 active): 7 个（全部）
 * receiverActive=1 (L2 active): 6 个（去掉 L1 比特流）
 * ...
 * receiverActive=6 (L7 active): 1 个（只剩 HTTP 请求）
 */
function buildReceiverBlocks(receiverActive: number, userText: string): EncapBlock[] {
  if (receiverActive < 0) return []
  // OSI_LAYERS: [L7(0), L6(1), ..., L1(6)]
  // 当前解封层在 OSI_LAYERS 的 index = 6 - receiverActive
  // 剩余方块 = index 0 到 6 - receiverActive
  const endIndex = 6 - receiverActive
  const blocks: EncapBlock[] = []
  for (let i = endIndex; i >= 0; i--) {
    const l = OSI_LAYERS[i]
    const label = i === 0
      ? (userText.length > 12 ? userText.slice(0, 12) + '…' : userText)
      : l.encapsulation
    blocks.push({
      label,
      colorFrom: l.receiverColor.from,
      colorTo: l.receiverColor.to,
    })
  }
  return blocks
}

export function ReceiverColumn({ activeIndex, onNext, phase, l1Ref, userText }: Props) {
  const canAdvance = phase === 'receiving' && activeIndex >= 0 && activeIndex < 7

  // 显示顺序同发送端：OSI_LAYERS (L7=index0 在上, L1=index6 在下)
  // receiverActive=0 → L1 active → 显示 index 6 active
  // receiverActive=1 → L2 active → 显示 index 5 active
  const activeDisplayIndex = activeIndex >= 0 && activeIndex < 7 ? 6 - activeIndex : -1
  const currentLayer = activeDisplayIndex >= 0 ? OSI_LAYERS[activeDisplayIndex] : undefined

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-500 tracking-widest uppercase">接收端</span>
      </div>
      {activeIndex >= 7 ? (
        <DataCore variant="receiver" userText={userText} />
      ) : (
        /* 等待占位：与 DataCore 等高，不隐藏，给用户视觉反馈 */
        <div className="rounded-xl px-4 py-3 mb-3 border border-dashed border-gray-200 bg-gray-50/60">
          <div className="text-[10px] text-gray-300 mb-1">等待接收</div>
          {userText.trim() ? (
            <div className="font-semibold text-xs text-gray-300 opacity-50">{userText}</div>
          ) : (
            <div className="font-semibold text-xs text-gray-300">— — —</div>
          )}
          <div className="text-[10px] text-gray-300 mt-0.5">传输完成后开始解封</div>
        </div>
      )}
      <div className="flex flex-col overflow-y-auto">
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

          return (
            <LayerBand
              key={layer.level}
              layer={layer}
              status={status}
              colorFrom={layer.receiverColor.from}
              colorTo={layer.receiverColor.to}
              blocks={i === activeDisplayIndex ? buildReceiverBlocks(activeIndex, userText) : []}
              detail={i === activeDisplayIndex ? currentLayer?.decapDetail : undefined}
              variant="receiver"
              bandRef={i === 6 ? l1Ref : undefined}
            />
          )
        })}
      </div>
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
