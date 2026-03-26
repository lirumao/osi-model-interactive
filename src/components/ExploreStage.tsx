'use client'

import { useRef } from 'react'
import { useOsiState } from '@/hooks/useOsiState'
import { OSI_LAYERS } from '@/data/osi-layers'

import { SenderColumn } from './SenderColumn'
import { ReceiverColumn } from './ReceiverColumn'
import { TransmissionAnim } from './TransmissionAnim'
import { CompletionView } from './CompletionView'

function LayerIndicator({ phase, senderActive, receiverActive }: {
  phase: string
  senderActive: number
  receiverActive: number
}) {
  if (phase === 'transmitting' || phase === 'complete') return null
  const isSending = phase === 'sending'
  // OSI_LAYERS index 0=L7, 6=L1
  return (
    <div className="relative z-10 flex flex-col items-center gap-1 select-none py-2">
      <span className="text-[8px] text-gray-400 mb-1">{isSending ? '封装' : '解封'}</span>
      {OSI_LAYERS.map((layer, i) => {
        // 发送端：activeIndex = senderActive，已完成 i < senderActive，当前 i === senderActive
        // 接收端：从下往上，activeIndex = 6 - receiverActive，已完成 i > 6-receiverActive，当前 i === 6-receiverActive
        const currentIdx = isSending ? senderActive : (6 - receiverActive)
        const isDone = isSending ? i < currentIdx : i > currentIdx
        const isActive = i === currentIdx
        return (
          <div key={layer.level} className="flex flex-col items-center">
            <div
              className={[
                'w-2 h-2 rounded-full transition-all duration-300',
                isActive ? 'bg-indigo-500 scale-125' : isDone ? 'bg-indigo-300' : 'bg-gray-200'
              ].join(' ')}
            />
            {isActive && (
              <span className="text-[7px] text-indigo-500 leading-none mt-0.5 max-w-[50px] text-center">
                L{layer.level}
              </span>
            )}
          </div>
        )
      })}
      <span className="text-[8px] text-gray-300 mt-1">{isSending ? '↓' : '↑'}</span>
    </div>
  )
}

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
    <div className="relative flex justify-center items-start h-full w-full px-[3%]">
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
        <div className="absolute inset-y-0 left-1/2 w-px bg-gray-200 -translate-x-1/2" />
        <LayerIndicator phase={state.phase} senderActive={state.senderActive} receiverActive={state.receiverActive} />
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
