interface DataCoreProps {
  variant: 'sender' | 'receiver'
}

export function DataCore({ variant }: DataCoreProps) {
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
        {isSender ? '原始数据' : 'HTTP Request 已还原'}
      </div>
      <div className="font-semibold text-xs">GET /index.html HTTP/1.1</div>
      <div className="text-[10px] text-gray-400 mt-0.5">Host: example.com</div>
    </div>
  )
}
