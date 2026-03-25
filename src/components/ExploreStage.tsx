'use client'

import { useOsiState } from '@/hooks/useOsiState'
import { SenderColumn } from './SenderColumn'
import { ReceiverColumn } from './ReceiverColumn'
import { TransmissionAnim } from './TransmissionAnim'
import { CompletionView } from './CompletionView'

export function ExploreStage() {
  const {
    state,
    advanceSender,
    onTransmissionComplete,
    advanceReceiver,
    reset,
  } = useOsiState()

  if (state.phase === 'complete') {
    return (
      <div className="flex items-start justify-center w-full h-full overflow-y-auto">
        <CompletionView onReset={reset} />
      </div>
    )
  }

  return (
    <div className="relative flex justify-center items-center h-full w-full px-[8%]">
      {/* 传输动画 SVG 覆盖层 */}
      <TransmissionAnim
        playing={state.transmitting}
        onComplete={onTransmissionComplete}
      />

      {/* 发送端 */}
      <div className="flex flex-col overflow-hidden flex-1 max-w-[520px]" style={{ padding: '16px 12px 16px 0' }}>
        <SenderColumn activeIndex={state.senderActive} onNext={advanceSender} phase={state.phase} />
      </div>

      {/* 间隔（传输动画穿越区域） */}
      <div style={{ width: 80 }} />

      {/* 接收端 */}
      <div className="flex flex-col overflow-hidden flex-1 max-w-[520px]" style={{ padding: '16px 0 16px 12px' }}>
        <ReceiverColumn
          activeIndex={state.phase === 'receiving' ? state.receiverActive : -1}
          onNext={advanceReceiver}
          phase={state.phase}
        />
      </div>
    </div>
  )
}
