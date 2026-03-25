'use client'

import { useCallback, useState } from 'react'

export type Phase = 'sending' | 'transmitting' | 'receiving' | 'complete'

export interface OsiState {
  phase: Phase
  /** 发送端当前激活层 index（0=L7, 6=L1）；7 = 全部完成 */
  senderActive: number
  /** 接收端当前激活层 index（0=L1, 6=L7）；-1 = 未开始 */
  receiverActive: number
  /** 传输动画是否正在播放 */
  transmitting: boolean
}

const INITIAL: OsiState = {
  phase: 'sending',
  senderActive: 0,
  receiverActive: -1,
  transmitting: false,
}

export function useOsiState() {
  const [state, setState] = useState<OsiState>(INITIAL)

  // 用户点击「下一层」（发送端）
  // 当到达第 7 层时，自动进入传输阶段并开始播放动画
  const advanceSender = useCallback(() => {
    setState((prev) => {
      if (prev.phase !== 'sending') return prev
      const next = prev.senderActive + 1
      if (next >= 7) {
        return { ...prev, senderActive: 7, phase: 'transmitting', transmitting: true }
      }
      return { ...prev, senderActive: next }
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
      if (next >= 7) return { ...prev, receiverActive: 7, phase: 'complete' }
      return { ...prev, receiverActive: next }
    })
  }, [])

  // 重置到初始状态
  const reset = useCallback(() => setState(INITIAL), [])

  return { state, advanceSender, onTransmissionComplete, advanceReceiver, reset }
}
