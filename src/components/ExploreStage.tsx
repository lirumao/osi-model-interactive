'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
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
  const senderDotRefs = useRef<(HTMLDivElement | null)[]>([])
  const receiverDotRefs = useRef<(HTMLDivElement | null)[]>([])
  const senderArrowRef = useRef<SVGSVGElement>(null)
  const receiverArrowRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    senderDotRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.killTweensOf(el)
      gsap.set(el, { scale: 1, opacity: 1 })
      if (i === senderActive) {
        gsap.to(el, { scale: 1.6, opacity: 0.6, duration: 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }
    })
  }, [senderActive])

  useEffect(() => {
    const recvCurrentIdx = phase === 'receiving' ? 6 - receiverActive : -1
    receiverDotRefs.current.forEach((el, i) => {
      if (!el) return
      gsap.killTweensOf(el)
      gsap.set(el, { scale: 1, opacity: 1 })
      if (i === recvCurrentIdx) {
        gsap.to(el, { scale: 1.6, opacity: 0.6, duration: 0.7, repeat: -1, yoyo: true, ease: 'sine.inOut' })
      }
    })
  }, [receiverActive, phase])

  useEffect(() => {
    if (!senderArrowRef.current) return
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(senderArrowRef.current, { y: 6, duration: 0.5, ease: 'power1.inOut' })
    tl.to(senderArrowRef.current, { y: 0, duration: 0.5, ease: 'power1.inOut' })
    return () => { tl.kill() }
  }, [])

  useEffect(() => {
    if (!receiverArrowRef.current) return
    const tl = gsap.timeline({ repeat: -1 })
    tl.to(receiverArrowRef.current, { y: -6, duration: 0.5, ease: 'power1.inOut' })
    tl.to(receiverArrowRef.current, { y: 0, duration: 0.5, ease: 'power1.inOut' })
    return () => { tl.kill() }
  }, [])

  if (phase === 'transmitting' || phase === 'complete') return null

  return (
    <div className="relative z-10 flex flex-col items-center gap-0 select-none w-full px-2">
      {/* 顶部箭头行：发送端朝下箭头 */}
      <div className="flex w-full justify-between mb-1 px-1 items-center" style={{ minHeight: 16 }}>
        <svg ref={senderArrowRef} width="16" height="12" viewBox="0 0 16 12" className="text-indigo-400" fill="currentColor">
          <path d="M8 0L15 8H9V12H7V8H1L8 0Z" transform="rotate(180 8 6)" />
        </svg>
        <div />
      </div>

      {/* 7层双点轨道 */}
      {OSI_LAYERS.map((layer, i) => {
        const senderDone = i < senderActive
        const senderActive_ = i === senderActive

        const recvCurrentIdx = phase === 'receiving' ? 6 - receiverActive : -1
        const recvDone = phase === 'receiving' && i > recvCurrentIdx
        const recvActive_ = i === recvCurrentIdx

        return (
          <div key={layer.level} className="flex items-center w-full gap-1" style={{ marginBottom: 4 }}>
            {/* 左点（发送） */}
            <div
              ref={el => { senderDotRefs.current[i] = el }}
              className={[
                'w-3 h-3 rounded-full flex-shrink-0',
                senderActive_ ? 'bg-indigo-500' :
                senderDone ? 'bg-indigo-300' : 'bg-gray-200'
              ].join(' ')}
            />
            {/* 中间层标签 */}
            <div className="flex-1 text-center">
              <span className="text-[7px] text-gray-400">L{layer.level}</span>
            </div>
            {/* 右点（接收） */}
            <div
              ref={el => { receiverDotRefs.current[i] = el }}
              className={[
                'w-3 h-3 rounded-full flex-shrink-0',
                recvActive_ ? 'bg-emerald-500' :
                recvDone ? 'bg-emerald-300' : 'bg-gray-200'
              ].join(' ')}
            />
          </div>
        )
      })}

      {/* 底部箭头行：接收端朝上箭头 */}
      <div className="flex w-full justify-between mt-1 px-1 items-center" style={{ minHeight: 16 }}>
        <div />
        <svg ref={receiverArrowRef} width="16" height="12" viewBox="0 0 16 12" className="text-emerald-400" fill="currentColor">
          <path d="M8 0L15 8H9V12H7V8H1L8 0Z" />
        </svg>
      </div>
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
      <div style={{ width: 120 }} className="relative flex-shrink-0 self-stretch flex flex-col items-center justify-center">
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
