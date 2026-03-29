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
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: '15px', lineHeight: 1.6 }}
      className={`rounded-xl px-4 py-3 mb-3 backdrop-blur-sm border ${
        isSender
          ? 'bg-blue-100/90 border-blue-400 text-blue-800 shadow-sm'
          : 'bg-emerald-50/80 border-emerald-300 text-emerald-800'
      }`}
    >
      <div className={`text-[10px] mb-1 ${isSender ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
        {isSender ? '原始数据' : '已还原'}
      </div>
      {isSender && onUserTextChange ? (
        <input
          type="text"
          value={userText}
          onChange={(e) => onUserTextChange(e.target.value)}
          placeholder="输入任意内容…"
          style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: '14px', letterSpacing: '-0.01em' }}
          className="font-semibold w-full bg-transparent outline-none border-b border-blue-300 focus:border-blue-500 text-blue-800 transition-colors py-0.5"
        />
      ) : (
        <div className="font-semibold text-xs">{userText}</div>
      )}
    </div>
  )
}
