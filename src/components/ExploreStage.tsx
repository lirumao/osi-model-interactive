'use client'

import { useRef } from 'react'
import { useOsiState } from '@/hooks/useOsiState'
import { OSI_LAYERS } from '@/data/osi-layers'
import { SenderColumn } from './SenderColumn'
import { ReceiverColumn } from './ReceiverColumn'
import { TransmissionAnim } from './TransmissionAnim'
import { CompletionView } from './CompletionView'

export function ExploreStage() {
  const senderL1Ref = useRef<HTMLDivElement>(null)
  const receiverL1Ref = useRef<HTMLDivElement>(null)

  const {
    state,
    advanceSender,
    onTransmissionComplete,
    advanceReceiver,
    reset,
    setUserText,
  } = useOsiState()

  if (state.phase === 'complete') {
    return (
      <div className="flex items-start justify-center w-full h-full overflow-y-auto">
        <CompletionView onReset={reset} />
      </div>
    )
  }

  return (
    <div className="relative flex justify-center items-center h-full w-full px-[3%]">
      {/* 传输动画 SVG 覆盖层 */}
      <TransmissionAnim
        playing={state.transmitting}
        onComplete={onTransmissionComplete}
        senderL1Ref={senderL1Ref}
        receiverL1Ref={receiverL1Ref}
      />

      {/* 发送端 */}
      <div className="flex flex-col overflow-hidden flex-1 max-w-[600px]" style={{ padding: '16px 12px 16px 0' }}>
        <SenderColumn activeIndex={state.senderActive} onNext={advanceSender} phase={state.phase} l1Ref={senderL1Ref} userText={state.userText} onUserTextChange={setUserText} />
      </div>

      {/* 间隔（传输动画穿越区域） */}
      <div style={{ width: 120 }} className="relative flex-shrink-0 flex flex-col items-center justify-center">
        {/* 竖线 */}
        <div className="absolute inset-y-0 left-1/2 w-px bg-gray-200 -translate-x-1/2" />
        {/* 层进度指示器 */}
        {state.phase !== 'transmitting' && (() => {
          const isSending = state.phase === 'sending'
          const layerIndex = isSending
            ? state.senderActive
            : (6 - state.receiverActive)
          if (layerIndex < 0 || layerIndex > 6) return null
          const layer = OSI_LAYERS[layerIndex]
          return (
            <div className="relative z-10 flex flex-col items-center gap-0.5 select-none">
              <span className="text-indigo-400 text-xs leading-none">{isSending ? '↓' : '↑'}</span>
              <div className="w-2 h-2 rounded-full bg-indigo-400" />
              <span className="text-[9px] text-gray-500 leading-none">L{layer.level}</span>
              <span className="text-[9px] text-gray-400 leading-none max-w-[60px] text-center truncate">{layer.name}</span>
            </div>
          )
        })()}
      </div>

      {/* 接收端 */}
      <div className="flex flex-col overflow-hidden flex-1 max-w-[600px]" style={{ padding: '16px 0 16px 12px' }}>
        <ReceiverColumn
          activeIndex={state.phase === 'receiving' ? state.receiverActive : -1}
          onNext={advanceReceiver}
          phase={state.phase}
          l1Ref={receiverL1Ref}
          userText={state.userText}
          highlightReceiverLayer={state.highlightReceiverLayer}
        />
      </div>
    </div>
  )
}
