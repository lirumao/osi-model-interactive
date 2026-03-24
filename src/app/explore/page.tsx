import { ExploreStage } from '@/components/ExploreStage'

export default function ExplorePage() {
  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col bg-white">
      {/* 背景光晕 */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196,181,253,0.2) 0%, transparent 70%)',
          top: 0, left: 0, filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,243,208,0.2) 0%, transparent 70%)',
          bottom: 0, right: 0, filter: 'blur(60px)',
        }}
      />
      <div className="relative z-10 flex-1 overflow-hidden">
        <ExploreStage />
      </div>
    </main>
  )
}
