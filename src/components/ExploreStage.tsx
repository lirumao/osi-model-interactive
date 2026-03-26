'use client'

import { useRef } from 'react'
import { useOsiState } from '@/hooks/useOsiState'
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
      <div style={{ width: 120 }} />

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
