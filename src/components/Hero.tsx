import Link from 'next/link'

export function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
      {/* 渐变光晕 */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)', top: -100, left: -100,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)', top: 100, right: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,243,208,0.35) 0%, transparent 70%)',
          filter: 'blur(60px)', bottom: 50, left: '40%',
        }}
      />

      {/* 导航栏 */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4 backdrop-blur-sm bg-white/60 border-b border-white/40">
        <span className="text-sm font-semibold text-gray-700">OSI 模型</span>
        <Link href="/explore" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          开始探索 →
        </Link>
      </nav>

      {/* Hero 内容 */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight max-w-2xl">
          数据是怎么在
          <br />
          <span className="bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">
            网络中传输的？
          </span>
        </h1>
        <p className="text-gray-500 text-lg mb-10 max-w-md">
          通过 OSI 七层模型，直观理解数据封装、传输与解封的全过程
        </p>
        <Link
          href="/explore"
          className="px-8 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:scale-95 transition-all shadow-md"
        >
          开始探索 →
        </Link>
      </div>
    </div>
  )
}
