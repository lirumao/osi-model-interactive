'use client'

import { useCallback, useRef, useState } from 'react'

export type Phase = 'sending' | 'transmitting' | 'receiving' | 'complete'

export interface OsiState {
  phase: Phase
  /** 发送端当前激活层 index（0=L7, 6=L1）；7 = 全部完成 */
  senderActive: number
  /** 接收端当前激活层 index（0=L1, 6=L7）；-1 = 未开始 */
  receiverActive: number
  /** 传输动画是否正在播放 */
  transmitting: boolean
  /** 用户在发送端输入的原始数据内容 */
  userText: string
  /** 接收端需要高亮的层 index（OSI_LAYERS index，0=L7, 6=L1）；null 表示无高亮 */
  highlightReceiverLayer: number | null
}

const INITIAL: OsiState = {
  phase: 'sending',
  senderActive: -1,
  receiverActive: -1,
  transmitting: false,
  userText: '',
  highlightReceiverLayer: null,
}

export function useOsiState() {
  const [state, setState] = useState<OsiState>(INITIAL)
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 用户点击「下一层」（发送端）
  // 当到达第 7 层时，自动进入传输阶段并开始播放动画
  const advanceSender = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'sending') return prev
      if (prev.senderActive === 6) {
        // L1 已激活，再点一次进入传输阶段
        return { ...prev, senderActive: 7, phase: 'transmitting', transmitting: true, highlightReceiverLayer: null }
      }
      if (prev.senderActive < 6) {
        const nextIndex = prev.senderActive + 1
        // 清掉上一个 timer
        if (highlightTimerRef.current !== null) {
          clearTimeout(highlightTimerRef.current)
        }
        // 600ms 后 reset 高亮
        highlightTimerRef.current = setTimeout(() => {
          setState((s) => ({ ...s, highlightReceiverLayer: null }))
          highlightTimerRef.current = null
        }, 600)
        return { ...prev, senderActive: nextIndex, highlightReceiverLayer: nextIndex }
      }
      return prev
    })
  }, [])

  // 传输动画播放完毕
  const onTransmissionComplete = useCallback(() => {
    setState((prev) => ({
      ...prev,
      transmitting: false,
      phase: 'receiving',
      receiverActive: 0,
    }))
  }, [])

  // 用户点击「解封下一层」（接收端）
  const advanceReceiver = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'receiving') return prev
      const next = prev.receiverActive + 1
      if (next >= 7) return { ...prev, receiverActive: 7 }
      return { ...prev, receiverActive: next }
    })
  }, [])

  // 用户在接收端数据显示后，手动触发完成
  const completeReceiving = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'receiving' || prev.receiverActive < 7) return prev
      return { ...prev, phase: 'complete' }
    })
  }, [])

  const setUserText = useCallback((text: string) => {
    setState((prev) => ({ ...prev, userText: text }))
  }, [])

  // 重置到初始状态
  const reset = useCallback(() => setState(INITIAL), [])

  return { state, advanceSender, onTransmissionComplete, advanceReceiver, completeReceiving, reset, setUserText }
}
