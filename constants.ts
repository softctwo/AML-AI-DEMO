
import { Transaction, TransactionType, ReportStatus, RiskLevel, Customer, Account, MonitoringModel, RiskRatingModel, SystemUser, SystemLog } from './types';

// 模拟客户数据 (增强版)
export const MOCK_CUSTOMERS: Customer[] = [
  { 
    id: 'C001', 
    name: '上海贸易有限公司', 
    type: '企业', 
    riskRating: RiskLevel.LOW, 
    country: 'CN', 
    idNumber: '91310000XXXXXXXX01', 
    industry: '进出口贸易', 
    regDate: '2010-05-12',
    address: '上海市浦东新区世纪大道88号',
    legalRep: '张三',
    tags: ['重点客户', '跨境业务'],
    beneficialOwners: [
        { name: '张三', ratio: 60, role: '最终受益人', country: 'CN' },
        { name: '李四', ratio: 40, role: '股东', country: 'CN' }
    ],
    negativeNews: [],
    riskHistory: [
        { date: '2023-01-15', previousLevel: RiskLevel.MEDIUM, newLevel: RiskLevel.LOW, reason: '股权结构变更，风险降低', operator: 'System' }
    ]
  },
  { 
    id: 'C002', 
    name: '全球物流集团', 
    type: '企业', 
    riskRating: RiskLevel.LOW, 
    country: 'SG', 
    idNumber: 'UEN201012345A', 
    industry: '物流运输', 
    regDate: '2012-08-20',
    address: '12 Marina Blvd, Singapore',
    legalRep: 'Michael Tan'
  },
  { 
    id: 'C003', 
    name: '张伟', 
    type: '个人', 
    riskRating: RiskLevel.MEDIUM, 
    country: 'CN', 
    idNumber: '310101198001010001', 
    regDate: 'N/A',
    address: '北京市朝阳区',
    tags: ['高净值', '政治公众人物关联']
  },
  { 
    id: 'C004', 
    name: '加密科技实验室', 
    type: '企业', 
    riskRating: RiskLevel.HIGH, 
    country: 'KY', 
    idNumber: 'KY-CORP-9988', 
    industry: '金融科技', 
    regDate: '2021-01-15',
    address: 'George Town, Grand Cayman',
    tags: ['虚拟货币', '离岸注册'],
    beneficialOwners: [
        { name: 'Crypto Fund A', ratio: 100, role: '机构股东', country: 'VG' }
    ],
    negativeNews: [
        { date: '2023-09-10', source: '金融时报', title: '加密科技实验室涉嫌未经许可的融资活动', snippet: '监管机构正在调查其ICO行为...', riskTag: '非法集资' }
    ],
    riskHistory: [
        { date: '2023-09-11', previousLevel: RiskLevel.MEDIUM, newLevel: RiskLevel.HIGH, reason: '触发负面舆情', operator: 'lihua' }
    ]
  },
  { id: 'C005', name: '李娜', type: '个人', riskRating: RiskLevel.LOW, country: 'CN', idNumber: '310101199002020002', regDate: 'N/A', address: '深圳市南山区' },
  { id: 'C006', name: '王芳', type: '个人', riskRating: RiskLevel.LOW, country: 'CN', idNumber: '310101199203030003', regDate: 'N/A', address: '杭州市西湖区' },
  { id: 'C007', name: '宏大地产开发商', type: '企业', riskRating: RiskLevel.MEDIUM, country: 'CN', idNumber: '91310000XXXXXXXX07', industry: '房地产', regDate: '2005-11-11' },
  { id: 'C008', name: '建设集团A', type: '企业', riskRating: RiskLevel.LOW, country: 'CN', idNumber: '91310000XXXXXXXX08', industry: '建筑工程', regDate: '2008-03-15' },
  { id: 'C009', name: 'Shell Invest Ltd', type: '企业', riskRating: RiskLevel.CRITICAL, country: 'VG', idNumber: 'BVI-123456', industry: '投资咨询', regDate: '2023-09-01', address: 'Road Town, Tortola', tags: ['空壳公司', '无法核实受益人'] },
  { id: 'C010', name: 'Trade Services Inc', type: '企业', riskRating: RiskLevel.HIGH, country: 'PA', idNumber: 'PA-654321', industry: '商务服务', regDate: '2023-09-05', address: 'Panama City' },
  { id: 'C011', name: '豪运在线娱乐', type: '企业', riskRating: RiskLevel.CRITICAL, country: 'PH', idNumber: 'PH-GAME-888', industry: '网络游戏/博彩', regDate: '2022-06-01', address: 'Manila', tags: ['博彩', '地下钱庄关联'] },
];

// 模拟账户数据
export const MOCK_ACCOUNTS: Account[] = [
  { id: 'ACC001', customerId: 'C001', accountNo: '6222023100000001', balance: 15000000.00, currency: 'CNY', status: '正常', openDate: '2015-01-01', branch: '上海分行', avgDailyBalance: 12000000 },
  { id: 'ACC002', customerId: 'C003', accountNo: '6222023100000002', balance: 50000.00, currency: 'USD', status: '正常', openDate: '2020-06-15', branch: '北京分行', avgDailyBalance: 45000 },
  { id: 'ACC003', customerId: 'C009', accountNo: '6222023100000003', balance: 100.00, currency: 'USD', status: '冻结', openDate: '2023-09-10', branch: '离岸业务部', avgDailyBalance: 200 },
  { id: 'ACC004', customerId: 'C001', accountNo: '6222023100000004', balance: 300000.00, currency: 'EUR', status: '正常', openDate: '2018-03-20', branch: '上海分行', avgDailyBalance: 280000 },
];

// 模拟交易数据 (增强版，包含更多场景)
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-2023-001',
    date: '2023-10-24 09:15:00',
    amount: 5200000,
    currency: 'CNY',
    sender: MOCK_CUSTOMERS[0],
    recipient: MOCK_CUSTOMERS[1],
    type: TransactionType.LARGE_VALUE,
    triggerRule: '单笔交易超过 500万 人民币',
    status: ReportStatus.PENDING_REVIEW,
    channel: '网银转账',
    ipAddress: '114.88.xx.xx (上海)',
    summary: '货款支付'
  },
  {
    id: 'TRX-2023-002',
    date: '2023-10-24 10:30:00',
    amount: 49000,
    currency: 'USD',
    sender: MOCK_CUSTOMERS[2],
    recipient: MOCK_CUSTOMERS[3],
    type: TransactionType.SUSPICIOUS,
    triggerRule: '向高风险司法管辖区跨境汇款',
    status: ReportStatus.PENDING_REVIEW,
    channel: '手机银行',
    ipAddress: '202.106.xx.xx (北京)',
    summary: '技术服务费'
  },
  {
    id: 'TRX-2023-003',
    date: '2023-10-24 11:45:00',
    amount: 19999,
    currency: 'CNY',
    sender: MOCK_CUSTOMERS[4],
    recipient: MOCK_CUSTOMERS[5],
    type: TransactionType.SUSPICIOUS,
    triggerRule: '结构化交易 (拆分) - 多笔略低于阈值',
    status: ReportStatus.PENDING_REVIEW,
    channel: 'ATM存款',
    deviceId: 'ATM-SH-0042',
    summary: '现金存款'
  },
  {
    id: 'TRX-2023-004',
    date: '2023-10-24 14:20:00',
    amount: 12000000,
    currency: 'CNY',
    sender: MOCK_CUSTOMERS[6],
    recipient: MOCK_CUSTOMERS[7],
    type: TransactionType.LARGE_VALUE,
    triggerRule: '单日累计交易超过 500万 人民币',
    status: ReportStatus.ACCEPTED,
    reportId: 'RPT-2023-8899',
    feedbackMessage: '报文已校验通过并归档。',
    channel: '柜面转账',
    summary: '工程款进度款'
  },
  {
    id: 'TRX-2023-005',
    date: '2023-10-24 16:10:00',
    amount: 500000,
    currency: 'USD',
    sender: MOCK_CUSTOMERS[8],
    recipient: MOCK_CUSTOMERS[9],
    type: TransactionType.SUSPICIOUS,
    triggerRule: '无明显经济目的的回路交易',
    status: ReportStatus.PENDING_REVIEW,
    channel: '网银转账',
    ipAddress: '45.33.xx.xx (VPN)',
    summary: 'Consulting Fee'
  },
  {
    id: 'TRX-2023-006',
    date: '2023-10-24 23:15:00',
    amount: 500,
    currency: 'CNY',
    sender: MOCK_CUSTOMERS[5],
    recipient: MOCK_CUSTOMERS[10], // 豪运在线娱乐
    type: TransactionType.SUSPICIOUS,
    triggerRule: '夜间频繁向涉赌商户小额转账',
    status: ReportStatus.PENDING_REVIEW,
    channel: '第三方支付',
    summary: '充值',
    ipAddress: '192.168.x.x'
  },
  {
    id: 'TRX-2023-007',
    date: '2023-10-25 02:00:00',
    amount: 1200,
    currency: 'CNY',
    sender: MOCK_CUSTOMERS[5],
    recipient: MOCK_CUSTOMERS[10],
    type: TransactionType.SUSPICIOUS,
    triggerRule: '夜间频繁向涉赌商户小额转账',
    status: ReportStatus.PENDING_REVIEW,
    channel: '第三方支付',
    summary: '充值',
    ipAddress: '192.168.x.x'
  }
];

// 模拟监测模型配置
export const MOCK_MODELS: MonitoringModel[] = [
  {
    id: 'MDL-LV-01',
    name: '大额现金交易监测',
    type: '大额',
    description: '监测单笔或当日累计人民币交易超过规定阈值的行为。依据PBOC大额交易报告管理办法。',
    threshold: 50000,
    thresholdCurrency: 'CNY',
    riskScoreWeight: 20,
    isEnabled: true,
    parameters: { 
      '累计周期': '1天',
      '交易渠道': '柜面/ATM',
      '职业白名单': '无'
    },
    lastUpdated: '2023-01-01',
    stats: {
      dailyAlerts: 45,
      falsePositiveRate: '12%'
    }
  },
  {
    id: 'MDL-LV-02',
    name: '大额转账交易监测 (对公)',
    type: '大额',
    description: '监测对公账户单笔或当日累计转账超过规定阈值。重点关注非工作时间交易。',
    threshold: 2000000,
    thresholdCurrency: 'CNY',
    riskScoreWeight: 30,
    isEnabled: true,
    parameters: { 
      '累计周期': '1天', 
      '排除关联账户': '是',
      '非工作时间权重': 1.5
    },
    lastUpdated: '2023-01-01',
    stats: {
      dailyAlerts: 120,
      falsePositiveRate: '5%'
    }
  },
  {
    id: 'MDL-SUS-01',
    name: '分散转入集中转出',
    type: '可疑',
    description: '短期内资金分散转入，随后集中转出，或反之。符合"快进快出"洗钱特征。',
    threshold: 10,
    thresholdCurrency: 'COUNT',
    riskScoreWeight: 80,
    isEnabled: true,
    parameters: { 
      '时间窗口': '10天', 
      '对手方数量': 5,
      '金额偏离度': '20%'
    },
    lastUpdated: '2023-06-15',
    stats: {
      dailyAlerts: 12,
      falsePositiveRate: '45%'
    }
  },
  {
    id: 'MDL-SUS-02',
    name: '频繁跨境汇款',
    type: '可疑',
    description: '向敏感国家或地区频繁进行跨境资金转移。',
    threshold: 10000,
    thresholdCurrency: 'USD',
    riskScoreWeight: 90,
    isEnabled: true,
    parameters: { 
      '频率': '3次/周',
      '高风险地区': 'KY, VG, PA, IR, KP',
      '交易目的校验': '严格'
    },
    lastUpdated: '2023-06-20',
    stats: {
      dailyAlerts: 8,
      falsePositiveRate: '30%'
    }
  },
  {
    id: 'MDL-SUS-03',
    name: '网络赌博特征监测',
    type: '可疑',
    description: '监测夜间频繁小额转账、整百整千金额交易，对手方涉及已知博彩商户或风险账户。',
    threshold: 5,
    thresholdCurrency: 'COUNT',
    riskScoreWeight: 85,
    isEnabled: true,
    parameters: { 
      '时间段': '22:00-05:00', 
      '金额特征': '整数倍',
      '对手方黑名单': '启用'
    },
    lastUpdated: '2023-10-01',
    stats: {
      dailyAlerts: 55,
      falsePositiveRate: '25%'
    }
  }
];

// 模拟风险评级模型
export const MOCK_RISK_MODELS: RiskRatingModel[] = [
  {
    id: 'RM-2024-V1',
    name: '个人客户风险评级模型 (标准版)',
    version: 'v1.2',
    description: '适用于普通个人零售客户的风险评级，基于4个核心维度进行打分。',
    factors: [
      { id: 'F01', name: '客户地域风险', weight: 30, description: '客户户籍地、居住地是否属于高风险地区' },
      { id: 'F02', name: '职业/行业风险', weight: 20, description: '客户职业是否属于高现金密集或政治敏感行业' },
      { id: 'F03', name: '历史可疑交易记录', weight: 40, description: '过去12个月内是否触发过可疑交易预警' },
      { id: 'F04', name: '服务渠道风险', weight: 10, description: '是否主要通过非面对面渠道办理业务' }
    ],
    status: '生效中',
    lastUpdated: '2023-09-01'
  },
  {
    id: 'RM-2024-V2',
    name: '机构客户风险评级模型 (增强版)',
    version: 'v2.0',
    description: '适用于对公企业的复杂评级模型，增加了对股权结构和受益所有人的穿透分析。',
    factors: [
      { id: 'F01', name: '股权结构复杂度', weight: 25, description: '是否存在多层嵌套、交叉持股或离岸架构' },
      { id: 'F02', name: '行业风险', weight: 25, description: '行业洗钱风险敞口（如博彩、废品回收、贵金属）' },
      { id: 'F03', name: '注册地风险', weight: 20, description: '注册地是否位于FATF黑/灰名单国家' },
      { id: 'F04', name: '控制人风险', weight: 30, description: '实控人是否涉及负面清单或制裁名单' }
    ],
    status: '生效中',
    lastUpdated: '2023-10-15'
  }
];

// 模拟系统用户
export const MOCK_USERS: SystemUser[] = [
  { id: 'U001', username: 'admin', role: '管理员', department: '科技部', lastLogin: '2023-10-25 08:30', status: '启用', permissions: ['ALL'] },
  { id: 'U002', username: 'lihua', role: '合规主管', department: '合规部', lastLogin: '2023-10-25 09:00', status: '启用', permissions: ['REVIEW', 'REPORT_SUBMIT', 'MODEL_VIEW'] },
  { id: 'U003', username: 'zhangsan', role: '分析员', department: '反洗钱中心', lastLogin: '2023-10-25 09:15', status: '启用', permissions: ['ALERT_HANDLE', 'DATA_QUERY'] }
];

// 模拟系统日志
export const MOCK_SYSTEM_LOGS: SystemLog[] = [
    { id: 'LOG-001', timestamp: '2023-10-25 10:15:22', operator: 'lihua', module: '预警处理', action: '复核通过', details: '复核交易 TRX-2023-001，确认上报', ip: '10.20.1.5' },
    { id: 'LOG-002', timestamp: '2023-10-25 10:10:05', operator: 'admin', module: '系统配置', action: '更新模型', details: '修改模型 MDL-LV-01 阈值为 60000', ip: '10.20.1.2' },
    { id: 'LOG-003', timestamp: '2023-10-25 09:45:11', operator: 'zhangsan', module: '数据查询', action: '查询客户', details: '查询客户 C004 详情及交易记录', ip: '10.20.3.8' },
    { id: 'LOG-004', timestamp: '2023-10-25 09:30:00', operator: 'SYSTEM', module: '批量任务', action: '跑批结束', details: '完成 T-1 日交易数据跑批，生成预警 158 条', ip: 'localhost' },
    { id: 'LOG-005', timestamp: '2023-10-25 09:00:22', operator: 'lihua', module: '登录', action: '系统登录', details: '登录成功', ip: '10.20.1.5' },
];

export const STAT_DATA: any[] = [
  { name: '周一', large: 40, susp: 24 },
  { name: '周二', large: 30, susp: 13 },
  { name: '周三', large: 20, susp: 38 },
  { name: '周四', large: 27, susp: 39 },
  { name: '周五', large: 18, susp: 48 },
  { name: '周六', large: 23, susp: 38 },
  { name: '周日', large: 34, susp: 43 },
];

// 仪表盘：客户类型分布
export const CUSTOMER_TYPE_DATA = [
  { name: '企业客户', value: 45, color: '#3b82f6' },
  { name: '个人客户', value: 55, color: '#10b981' },
];

// 仪表盘：账户风险分布
export const RISK_DIST_DATA = [
  { name: '低风险', value: 65, color: '#10b981' },
  { name: '中风险', value: 25, color: '#f59e0b' },
  { name: '高风险', value: 8, color: '#ef4444' },
  { name: '极高', value: 2, color: '#7f1d1d' },
];

// 仪表盘：交易流量趋势 (面积图)
export const TRX_VOLUME_DATA = [
  { date: '10-18', inbound: 500, outbound: 450 },
  { date: '10-19', inbound: 600, outbound: 550 },
  { date: '10-20', inbound: 400, outbound: 380 },
  { date: '10-21', inbound: 700, outbound: 720 },
  { date: '10-22', inbound: 850, outbound: 800 },
  { date: '10-23', inbound: 650, outbound: 600 },
  { date: '10-24', inbound: 900, outbound: 880 },
];
