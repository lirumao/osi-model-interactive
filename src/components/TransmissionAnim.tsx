'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  playing: boolean
  onComplete: () => void
  showButton: boolean
  onSend: () => void
}

export function TransmissionAnim({ playing, onComplete, showButton, onSend }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const packetRef = useRef<HTMLDivElement>(null)
  const hasPlayed = useRef(false)

  useEffect(() => {
    if (!playing || hasPlayed.current) return
    hasPlayed.current = true

    const track = trackRef.current
    const packet = packetRef.current
    if (!track || !packet) return

    const trackWidth = track.offsetWidth

    const tl = gsap.timeline({ onComplete })
    tl.set(packet, { x: 0, opacity: 1 })
    tl.to(packet, { x: trackWidth - 76, duration: 1.2, ease: 'power2.inOut' })
    tl.to(packet, { opacity: 0, duration: 0.15 }, '-=0.1')

    return () => { tl.kill() }
  }, [playing, onComplete])

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {/* 虚线轨道 */}
      <div ref={trackRef} className="relative w-full" style={{ height: 48 }}>
        <div
          className="absolute inset-x-0"
          style={{
            top: '50%',
            height: 2,
            transform: 'translateY(-50%)',
            backgroundImage:
              'repeating-linear-gradient(90deg, #6366f1 0 8px, transparent 8px 12px, #10b981 12px 20px, transparent 20px 24px)',
            opacity: 0.5,
          }}
        />
        {/* 数据包 */}
        <div
          ref={packetRef}
          className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold text-white"
          style={{
            opacity: 0,
            background: 'linear-gradient(135deg, #6366f1, #10b981)',
            boxShadow: '0 0 12px rgba(99,102,241,0.5)',
            width: 68,
            textAlign: 'center',
          }}
        >
          比特流
        </div>
      </div>

      {/* 发送按钮 */}
      {showButton && (
        <button
          onClick={onSend}
          className="px-6 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #6366f1, #10b981)' }}
        >
          发送数据 →
        </button>
      )}

      <div className="text-center">
        <div className="text-xs font-medium text-gray-500">物理介质</div>
        <div className="text-[10px] text-gray-400">比特流传输</div>
      </div>
    </div>
  )
}
