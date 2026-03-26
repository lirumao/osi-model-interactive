type HexColor = `#${string}`

export interface OsiLayer {
  level: number
  name: string
  description: string
  protocols: string[]
  /** 该层封装时添加的内容简述（用于封装方块显示） */
  encapsulation: string
  /** 这一步封装具体做了什么（发送端展示） */
  encapDetail: string
  /** 这一步解封具体做了什么（接收端展示） */
  decapDetail: string
  senderColor: { from: HexColor; to: HexColor }
  receiverColor: { from: HexColor; to: HexColor }
}

// Index 0 = L7（应用层），Index 6 = L1（物理层）— 发送端顺序
export const OSI_LAYERS: OsiLayer[] = [
  {
    level: 7, name: '应用层',
    description: '用户直接使用的网络服务，定义数据的呈现方式',
    protocols: ['HTTP', 'FTP', 'DNS', 'SMTP'],
    encapsulation: 'HTTP 请求',
    encapDetail: '将用户操作转为 HTTP 报文 (GET /index.html)',
    decapDetail: '解析 HTTP 报文，将数据内容呈现给应用程序',
    senderColor: { from: '#e0e7ff', to: '#c7d2fe' },
    receiverColor: { from: '#c7d2fe', to: '#a5b4fc' },
  },
  {
    level: 6, name: '表示层',
    description: '对数据进行编码、加密和压缩，统一格式',
    protocols: ['SSL/TLS', 'JPEG', 'ASCII'],
    encapsulation: 'SSL 加密',
    encapDetail: '对数据进行 TLS 加密，确保传输安全',
    decapDetail: 'TLS 解密，将密文数据还原为明文',
    senderColor: { from: '#c7d2fe', to: '#a5b4fc' },
    receiverColor: { from: '#ddd6fe', to: '#c4b5fd' },
  },
  {
    level: 5, name: '会话层',
    description: '建立、维持并终止两端之间的对话连接',
    protocols: ['NetBIOS', 'RPC'],
    encapsulation: '会话 ID',
    encapDetail: '添加会话标识，管理连接的建立与保持',
    decapDetail: '验证会话 ID，确认连接状态，移除会话控制信息',
    senderColor: { from: '#c4b5fd', to: '#a78bfa' },
    receiverColor: { from: '#e9d5ff', to: '#d8b4fe' },
  },
  {
    level: 4, name: '传输层',
    description: '端到端可靠传输，切分报文段并加上端口号',
    protocols: ['TCP', 'UDP'],
    encapsulation: 'TCP 头',
    encapDetail: '添加源/目标端口号，实现可靠的端到端传输',
    decapDetail: '校验 TCP 序列号，重组数据段，去掉端口头部',
    senderColor: { from: '#93c5fd', to: '#60a5fa' },
    receiverColor: { from: '#bfdbfe', to: '#93c5fd' },
  },
  {
    level: 3, name: '网络层',
    description: '添加 IP 地址，决定数据跨网络的路径',
    protocols: ['IP', 'ICMP', 'ARP'],
    encapsulation: 'IP 头',
    encapDetail: '添加源/目标 IP 地址，选择路由路径',
    decapDetail: '读取目标 IP 地址，去掉 IP 头，向传输层递交',
    senderColor: { from: '#7dd3fc', to: '#38bdf8' },
    receiverColor: { from: '#a5f3fc', to: '#67e8f9' },
  },
  {
    level: 2, name: '数据链路层',
    description: '添加 MAC 地址，负责相邻设备间的帧传递',
    protocols: ['Ethernet', 'Wi-Fi', 'PPP'],
    encapsulation: 'MAC 帧',
    encapDetail: '封装成以太网帧，添加 MAC 地址和校验码',
    decapDetail: '校验 CRC 完整性，去掉帧头尾，提取 IP 数据包',
    senderColor: { from: '#67e8f9', to: '#22d3ee' },
    receiverColor: { from: '#99f6e4', to: '#5eead4' },
  },
  {
    level: 1, name: '物理层',
    description: '将一切转化为比特流，通过电/光/无线介质发送',
    protocols: ['RJ45', '光纤', '802.11'],
    encapsulation: '比特流',
    encapDetail: '将帧转为电信号/光信号/电磁波进行物理传输',
    decapDetail: '接收物理信号，将电/光/无线信号还原为比特流',
    senderColor: { from: '#5eead4', to: '#2dd4bf' },
    receiverColor: { from: '#6ee7b7', to: '#34d399' },
  },
]

// 接收端顺序：L1（index 0）→ L7（index 6）
export const RECEIVER_LAYERS: OsiLayer[] = [...OSI_LAYERS].reverse()
