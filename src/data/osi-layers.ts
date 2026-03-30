type HexColor = `#${string}`

export interface ProtocolDetail {
  /** 封装方块中显示的短标签，如 "HTTP 请求" */
  displayName: string
  /** 百科式详细说明，显示在 encap-detail 区域 */
  detail: string
  /** 发送端视角的层功能描述（替换 layer.description） */
  senderDesc?: string
  /** 接收端视角的层功能描述（替换 layer.receiverDescription） */
  receiverDesc?: string
}

export interface OsiLayer {
  level: number
  name: string
  description: string
  /** 接收端视角的层功能描述 */
  receiverDescription: string
  protocols: string[]
  /** 每个协议的详细信息，key = protocols 中的协议名 */
  protocolDetails?: Record<string, ProtocolDetail>
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
    receiverDescription: '解析 HTTP 报文，将数据呈现给用户',
    protocols: ['HTTP', 'FTP', 'DNS', 'SMTP'],
    protocolDetails: {
      HTTP: {
        displayName: 'HTTP 请求',
        detail: '超文本传输协议，定义客户端与服务器之间请求/响应的消息格式，是 Web 通信的基础。',
        senderDesc: '将用户请求格式化为 HTTP 报文，包含请求行、首部字段与可选消息体',
        receiverDesc: '解析 HTTP 响应报文，提取状态码与消息体，交付给应用程序',
      },
      FTP: {
        displayName: 'FTP 数据',
        detail: '文件传输协议，通过控制连接（21端口）与数据连接（20端口）分离实现高效文件上传下载。',
        senderDesc: '通过控制连接发送 FTP 命令，通过数据连接传输文件内容',
        receiverDesc: '解析 FTP 响应码，接收数据连接上的文件内容，完成文件传输',
      },
      DNS: {
        displayName: 'DNS 查询',
        detail: '域名系统，将人类可读的域名（如 example.com）解析为机器可识别的 IP 地址。',
        senderDesc: '将域名封装为 DNS 查询报文，向递归解析器请求 IP 地址',
        receiverDesc: '解析 DNS 应答报文，提取 A/AAAA 记录，将 IP 地址返回给请求方',
      },
      SMTP: {
        displayName: 'SMTP 邮件',
        detail: '简单邮件传输协议，定义邮件在服务器之间传递的规则，负责邮件的发送与中转。',
        senderDesc: '封装邮件为 SMTP 命令序列（EHLO / MAIL FROM / RCPT TO / DATA）',
        receiverDesc: '解析 SMTP 命令，验证收件人地址，将邮件内容存入邮箱',
      },
    },
    encapsulation: 'HTTP 请求',
    encapDetail: '用户发起请求，HTTP 协议将其格式化为标准报文',
    decapDetail: '解析 HTTP 报文，将数据内容呈现给应用程序',
    senderColor: { from: '#e0e7ff', to: '#c7d2fe' },
    receiverColor: { from: '#818cf8', to: '#6366f1' },
  },
  {
    level: 6, name: '表示层',
    description: '对数据进行编码、加密和压缩，统一格式',
    receiverDescription: '解密 TLS，还原统一编码格式',
    protocols: ['SSL/TLS', 'JPEG', 'ASCII'],
    protocolDetails: {
      'SSL/TLS': {
        displayName: 'TLS 加密',
        detail: '传输层安全协议，通过非对称加密协商密钥，再用对称加密保护后续通信，防止窃听与篡改。',
        senderDesc: 'TLS 握手协商会话密钥，对应用层数据加密并封装为 TLS Record',
        receiverDesc: '验证 TLS Record 的 MAC，解密密文，将明文数据交付给应用层',
      },
      JPEG: {
        displayName: 'JPEG 压缩',
        detail: '有损图像压缩标准，利用人眼对高频细节不敏感的特性大幅减小图像体积，适用于照片传输。',
        senderDesc: '对图像进行 DCT 变换、量化与哈夫曼编码，压缩为 JPEG 格式',
        receiverDesc: '解码 JPEG 数据流，反量化与 IDCT 变换，还原像素矩阵',
      },
      ASCII: {
        displayName: 'ASCII 编码',
        detail: '美国标准信息交换码，将128个字符映射为7位二进制数，是文本数据统一编码的基础标准。',
        senderDesc: '将文本字符编码为 ASCII 字节序列，统一不同系统间的数据格式',
        receiverDesc: '将字节序列按 ASCII 解码，还原为可读字符串后交付应用层',
      },
    },
    encapsulation: 'SSL 加密',
    encapDetail: '对数据加密（TLS）并统一编码格式（UTF-8/ASCII）',
    decapDetail: 'TLS 解密，将密文数据还原为明文',
    senderColor: { from: '#c7d2fe', to: '#a5b4fc' },
    receiverColor: { from: '#a78bfa', to: '#8b5cf6' },
  },
  {
    level: 5, name: '会话层',
    description: '建立、维持并终止两端之间的对话连接',
    receiverDescription: '验证会话 ID，维持连接状态',
    protocols: ['NetBIOS', 'RPC'],
    protocolDetails: {
      NetBIOS: {
        displayName: 'NetBIOS 会话',
        detail: '网络基本输入输出系统，提供局域网内的名称解析与会话建立服务，是早期 Windows 网络共享的基础。',
        senderDesc: '广播名称注册，建立 NetBIOS 会话，分配本次通信的会话 ID',
        receiverDesc: '验证 NetBIOS 会话 ID，确认对端名称，维持会话状态',
      },
      RPC: {
        displayName: 'RPC 调用',
        detail: '远程过程调用，允许程序像调用本地函数一样调用远程服务器上的函数，屏蔽网络通信细节。',
        senderDesc: '序列化函数调用参数，封装为 RPC 请求消息，建立远程调用上下文',
        receiverDesc: '反序列化 RPC 请求，在本地执行对应函数，封装返回值回传',
      },
    },
    encapsulation: '会话 ID',
    encapDetail: '建立并维持连接会话，分配唯一会话 ID',
    decapDetail: '验证会话 ID，确认连接状态，移除会话控制信息',
    senderColor: { from: '#c4b5fd', to: '#a78bfa' },
    receiverColor: { from: '#c084fc', to: '#a855f7' },
  },
  {
    level: 4, name: '传输层',
    description: '端到端可靠传输，切分报文段并加上端口号',
    receiverDescription: '重组 TCP 分段，还原完整数据流',
    protocols: ['TCP', 'UDP'],
    protocolDetails: {
      TCP: {
        displayName: 'TCP 首部',
        detail: '传输控制协议，提供三次握手建立连接、序列号确保有序传输、ACK 确认机制保证可靠交付。',
        senderDesc: '切分数据为 MSS 大小的段，添加序列号与端口号，三次握手建立连接',
        receiverDesc: '按序列号重组乱序数据段，发送 ACK 确认，去掉 TCP 首部后向上交付',
      },
      UDP: {
        displayName: 'UDP 首部',
        detail: '用户数据报协议，无连接、无确认，延迟极低，适用于视频流、游戏、DNS 等对速度敏感的场景。',
        senderDesc: '封装为 UDP 数据报，仅添加端口号与校验和，无连接直接发送',
        receiverDesc: '校验 UDP 校验和，按目标端口将载荷数据交付给对应应用',
      },
    },
    encapsulation: 'TCP 首部',
    encapDetail: 'TCP 分段数据，添加端口号确保送达正确应用',
    decapDetail: '校验 TCP 序列号，重组数据段，去掉端口头部',
    senderColor: { from: '#93c5fd', to: '#60a5fa' },
    receiverColor: { from: '#60a5fa', to: '#3b82f6' },
  },
  {
    level: 3, name: '网络层',
    description: '添加 IP 地址，决定数据跨网络的路径',
    receiverDescription: '读取目标 IP，确认数据到达本机',
    protocols: ['IP', 'ICMP', 'ARP'],
    protocolDetails: {
      IP: {
        displayName: 'IP 首部',
        detail: '互联网协议，为每个数据包添加源/目标 IP 地址，路由器据此在不同网络间逐跳转发数据包。',
        senderDesc: '添加源/目标 IP 地址，设置 TTL 与协议字段，路由器据此逐跳转发',
        receiverDesc: '验证目标 IP 为本机，检查 TTL，剥除 IP 首部后向传输层递交',
      },
      ICMP: {
        displayName: 'ICMP 报文',
        detail: '互联网控制消息协议，用于网络诊断（如 ping）和错误报告（如"目标不可达"），不传输用户数据。',
        senderDesc: '封装 ICMP Echo Request 或错误通知消息，用于网络探测与路径诊断',
        receiverDesc: '解析 ICMP 类型字段，响应 Echo Request 或记录错误信息',
      },
      ARP: {
        displayName: 'ARP 请求',
        detail: '地址解析协议，在已知 IP 地址的情况下广播查询对应的 MAC 地址，实现局域网内的地址映射。',
        senderDesc: '广播 ARP 请求帧，查询目标 IP 地址对应的 MAC 地址',
        receiverDesc: '响应 ARP 请求，回复本机 MAC 地址，缓存对端 IP/MAC 映射',
      },
    },
    encapsulation: 'IP 首部',
    encapDetail: '添加源/目标 IP，路由器据此决定转发路径',
    decapDetail: '读取目标 IP 地址，去掉 IP 首部，向传输层递交',
    senderColor: { from: '#7dd3fc', to: '#38bdf8' },
    receiverColor: { from: '#22d3ee', to: '#06b6d4' },
  },
  {
    level: 2, name: '数据链路层',
    description: '添加 MAC 地址，负责相邻设备间的帧传递',
    receiverDescription: '校验 MAC 地址，剥除帧头',
    protocols: ['Ethernet', 'Wi-Fi', 'PPP'],
    protocolDetails: {
      Ethernet: {
        displayName: 'MAC 首部',
        detail: '以太网协议，将数据封装为帧并附加源/目标 MAC 地址与 CRC 校验码，保障局域网内相邻节点的可靠传输。',
        senderDesc: '封装为以太网帧，添加目标/源 MAC 地址、EtherType 字段与 FCS 校验码',
        receiverDesc: '校验 FCS 完整性，验证目标 MAC 地址，剥除以太网帧头尾',
      },
      'Wi-Fi': {
        displayName: 'Wi-Fi 帧头',
        detail: '无线局域网标准（IEEE 802.11），通过无线电波传输帧，增加了认证和加密字段以保护无线信道安全。',
        senderDesc: '封装为 802.11 帧，添加 BSSID 与序列控制字段，CCMP 加密帧体',
        receiverDesc: '解密 CCMP，校验帧完整性，验证 BSSID，剥除 802.11 帧头',
      },
      PPP: {
        displayName: 'PPP 帧头',
        detail: '点对点协议，用于两台设备之间的直连通信，提供认证、压缩和多协议封装，常用于宽带拨号连接。',
        senderDesc: '封装为 PPP 帧，添加标志字节（0x7E）、协议字段与 FCS 尾部',
        receiverDesc: '校验 PPP FCS，剥除标志字节与协议字段，提取网络层数据包',
      },
    },
    encapsulation: 'MAC 首部',
    encapDetail: '封装成帧，MAC 地址确保在局域网内正确投递',
    decapDetail: '校验 CRC 完整性，去掉帧头尾，提取 IP 数据包',
    senderColor: { from: '#67e8f9', to: '#22d3ee' },
    receiverColor: { from: '#2dd4bf', to: '#14b8a6' },
  },
  {
    level: 1, name: '物理层',
    description: '将一切转化为比特流，通过电/光/无线介质发送',
    receiverDescription: '接收物理信号，还原为比特流',
    protocols: ['RJ45', '光纤', '802.11'],
    protocolDetails: {
      RJ45: {
        displayName: '电信号',
        detail: 'RJ45 双绞线接口，通过铜线传输差分电压信号，支持最高 10 Gbps，是有线以太网最常见的物理介质。',
        senderDesc: '将比特流编码为差分电压信号，通过双绞线铜缆向外发送',
        receiverDesc: '接收双绞线上的电压信号，均衡放大后解码为数字比特流',
      },
      '光纤': {
        displayName: '光信号',
        detail: '利用光的全内反射在玻璃纤维中传输数据，带宽极高、损耗极低，是骨干网与跨洋通信的核心介质。',
        senderDesc: '将比特流调制为激光脉冲，通过光纤以光速传输',
        receiverDesc: '光电探测器接收光脉冲，经跨阻放大器转换后解码为比特流',
      },
      '802.11': {
        displayName: '无线电波',
        detail: 'Wi-Fi 物理层标准，将比特流调制为 2.4GHz/5GHz/6GHz 无线电波，通过天线在空气中传播。',
        senderDesc: '将比特流经 OFDM 调制编码为射频信号，通过天线发射',
        receiverDesc: '天线接收射频信号，经 ADC 采样与 OFDM 解调，还原为比特流',
      },
    },
    encapsulation: '',
    encapDetail: '比特流通过 RJ45/光纤/802.11 转为物理信号发送',
    decapDetail: '接收物理信号，将电/光/无线信号还原为比特流',
    senderColor: { from: '#5eead4', to: '#2dd4bf' },
    receiverColor: { from: '#34d399', to: '#10b981' },
  },
]

// 接收端顺序：L1（index 0）→ L7（index 6）
export const RECEIVER_LAYERS: OsiLayer[] = [...OSI_LAYERS].reverse()
