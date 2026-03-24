type HexColor = `#${string}`

export interface OsiLayer {
  level: number
  name: string
  description: string
  protocols: string[]
  senderColor: { from: HexColor; to: HexColor }
  receiverColor: { from: HexColor; to: HexColor }
}

// Index 0 = L7（应用层），Index 6 = L1（物理层）— 发送端顺序
export const OSI_LAYERS: OsiLayer[] = [
  {
    level: 7, name: '应用层',
    description: '用户直接使用的网络服务，定义数据的呈现方式',
    protocols: ['HTTP', 'FTP', 'DNS', 'SMTP'],
    senderColor: { from: '#e0e7ff', to: '#c7d2fe' },
    receiverColor: { from: '#ecfdf5', to: '#d1fae5' },
  },
  {
    level: 6, name: '表示层',
    description: '对数据进行编码、加密和压缩，统一格式',
    protocols: ['SSL/TLS', 'JPEG', 'ASCII'],
    senderColor: { from: '#c7d2fe', to: '#a5b4fc' },
    receiverColor: { from: '#d1fae5', to: '#a7f3d0' },
  },
  {
    level: 5, name: '会话层',
    description: '建立、维持并终止两端之间的对话连接',
    protocols: ['NetBIOS', 'RPC'],
    senderColor: { from: '#c4b5fd', to: '#a78bfa' },
    receiverColor: { from: '#a7f3d0', to: '#6ee7b7' },
  },
  {
    level: 4, name: '传输层',
    description: '端到端可靠传输，切分报文段并加上端口号',
    protocols: ['TCP', 'UDP'],
    senderColor: { from: '#93c5fd', to: '#60a5fa' },
    receiverColor: { from: '#bbf7d0', to: '#86efac' },
  },
  {
    level: 3, name: '网络层',
    description: '添加 IP 地址，决定数据跨网络的路径',
    protocols: ['IP', 'ICMP', 'ARP'],
    senderColor: { from: '#7dd3fc', to: '#38bdf8' },
    receiverColor: { from: '#86efac', to: '#4ade80' },
  },
  {
    level: 2, name: '数据链路层',
    description: '添加 MAC 地址，负责相邻设备间的帧传递',
    protocols: ['Ethernet', 'Wi-Fi', 'PPP'],
    senderColor: { from: '#67e8f9', to: '#22d3ee' },
    receiverColor: { from: '#6ee7b7', to: '#34d399' },
  },
  {
    level: 1, name: '物理层',
    description: '将一切转化为比特流，通过电/光/无线介质发送',
    protocols: ['RJ45', '光纤', '802.11'],
    senderColor: { from: '#5eead4', to: '#2dd4bf' },
    receiverColor: { from: '#5eead4', to: '#2dd4bf' },
  },
]

// 接收端顺序：L1（index 0）→ L7（index 6）
export const RECEIVER_LAYERS: OsiLayer[] = [...OSI_LAYERS].reverse()
