'use client'

interface DataCoreProps {
  variant: 'sender' | 'receiver'
  userText?: string
  onUserTextChange?: (text: string) => void
}

export function DataCore({ variant, userText = '', onUserTextChange }: DataCoreProps) {
  const isSender = variant === 'sender'
  return (
    <div
      className={`rounded-xl px-4 py-3 mb-3 text-sm font-mono backdrop-blur-sm border ${
        isSender
          ? 'bg-white/80 border-gray-200 text-gray-700'
          : 'bg-emerald-50/80 border-emerald-300 text-emerald-800'
      }`}
    >
      <div className="text-[10px] text-gray-400 mb-1">
        {isSender ? '原始数据' : '已还原'}
      </div>
      {isSender && onUserTextChange ? (
        <input
          type="text"
          value={userText}
          onChange={(e) => onUserTextChange(e.target.value)}
          placeholder="输入任意内容…"
          className="font-semibold text-xs w-full bg-transparent outline-none border-b border-gray-200 focus:border-blue-400 transition-colors py-0.5"
        />
      ) : (
        <div className="font-semibold text-xs">{userText}</div>
      )}
    </div>
  )
}
