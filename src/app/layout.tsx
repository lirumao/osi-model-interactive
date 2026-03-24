import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OSI 七层模型 — 交互动画',
  description: '通过精美动画直观理解 OSI 网络模型数据封装与传输过程',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ fontFamily: '-apple-system, "PingFang SC", "Microsoft YaHei", sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
