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
    startTransmission,
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
    <div className="flex h-full w-full">
      {/* 发送端 38% */}
      <div className="flex flex-col overflow-hidden" style={{ width: '38%', padding: '16px 12px 16px 16px' }}>
        <SenderColumn activeIndex={state.senderActive} onNext={advanceSender} phase={state.phase} />
      </div>

      {/* 传输区 24% */}
      <div
        className="flex flex-col"
        style={{
          width: '24%',
          padding: '16px 8px',
          borderLeft: '1px solid rgba(0,0,0,0.06)',
          borderRight: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <TransmissionAnim
          playing={state.transmitting}
          onComplete={onTransmissionComplete}
          showButton={state.phase === 'transmitting' && !state.transmitting}
          onSend={startTransmission}
        />
      </div>

      {/* 接收端 38% */}
      <div className="flex flex-col overflow-hidden" style={{ width: '38%', padding: '16px 16px 16px 12px' }}>
        <ReceiverColumn
          activeIndex={
            state.phase === 'receiving'
              ? state.receiverActive
              : -1
          }
          onNext={advanceReceiver}
          phase={state.phase}
        />
      </div>
    </div>
  )
}
