
import { Transaction, TransactionType, ReportStatus, RiskLevel, Customer, Account, MonitoringModel, RiskRatingModel, SystemUser, SystemLog, RegulatoryReport, InspectionItem, InspectionStatus, MonitoredEntity, ScreeningHit, ScreeningCategory, StandardReportTable, CustomerStructure, CddCase, CddStatus, RiskRatingFactor } from './types';

// 模拟客户数据 (增强版 - 包含UBO状态)
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
        { name: '张三', ratio: 60, role: '最终受益人', country: 'CN', status: '已核实', verificationDate: '2023-01-15', idType: '身份证', idNumber: '310xxxxxxxxxxx' },
        { name: '李四', ratio: 40, role: '股东', country: 'CN', status: '无需核实' }
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
    legalRep: 'Michael Tan',
    beneficialOwners: []
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
        { name: 'John Doe', ratio: 50, role: '最终受益人', country: 'US', status: '待核实', idType: '护照' },
        { name: 'Crypto Fund A', ratio: 100, role: '机构股东', country: 'VG', status: '无需核实' }
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
  { id: 'C009', name: 'Shell Invest Ltd', type: '企业', riskRating: RiskLevel.CRITICAL, country: 'VG', idNumber: 'BVI-123456', industry: '投资咨询', regDate: '2023-09-01', address: 'Road Town, Tortola', tags: ['空壳公司', '无法核实受益人'], beneficialOwners: [] },
  { id: 'C010', name: 'Trade Services Inc', type: '企业', riskRating: RiskLevel.HIGH, country: 'PA', idNumber: 'PA-654321', industry: '商务服务', regDate: '2023-09-05', address: 'Panama City', beneficialOwners: [] },
  { id: 'C011', name: '豪运在线娱乐', type: '企业', riskRating: RiskLevel.CRITICAL, country: 'PH', idNumber: 'PH-GAME-888', industry: '网络游戏/博彩', regDate: '2022-06-01', address: 'Manila', tags: ['博彩', '地下钱庄关联'], beneficialOwners: [] },
];

// 模拟账户数据
export const MOCK_ACCOUNTS: Account[] = [
  { id: 'ACC001', customerId: 'C001', accountNo: '6222023100000001', balance: 15000000.00, currency: 'CNY', status: '正常', openDate: '2015-01-01', branch: '上海分行', avgDailyBalance: 12000000 },
  { id: 'ACC002', customerId: 'C003', accountNo: '6222023100000002', balance: 50000.00, currency: 'USD', status: '正常', openDate: '2020-06-15', branch: '北京分行', avgDailyBalance: 45000 },
  { id: 'ACC003', customerId: 'C009', accountNo: '6222023100000003', balance: 100.00, currency: 'USD', status: '冻结', openDate: '2023-09-10', branch: '离岸业务部', avgDailyBalance: 200 },
  { id: 'ACC004', customerId: 'C001', accountNo: '6222023100000004', balance: 300000.00, currency: 'EUR', status: '正常', openDate: '2018-03-20', branch: '上海分行', avgDailyBalance: 280000 },
];

// 模拟交易数据
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
    recipient: MOCK_CUSTOMERS[10],
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
      '金额特征': '20%'
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
    riskScoreWeight: 70,
    isEnabled: true,
    parameters: { 
      '时间窗口': '夜间22:00-04:00', 
      '金额特征': '整数倍',
      '对手方风险': '高'
    },
    lastUpdated: '2023-08-10',
    stats: {
      dailyAlerts: 25,
      falsePositiveRate: '20%'
    }
  }
];

// 模拟风险评级模型
export const MOCK_RISK_MODELS: RiskRatingModel[] = [
  {
    id: 'RSK-CORP-01',
    name: '对公客户风险评级模型',
    version: 'v2.1',
    description: '适用于一般企业客户的风险等级评估，包含地域、行业、股权结构等因子。',
    factors: [
        { id: 'F01', name: '注册地域风险', weight: 20, description: '注册地是否位于高风险国家或地区' },
        { id: 'F02', name: '行业风险', weight: 20, description: '是否属于现金密集型或高风险行业' },
        { id: 'F03', name: '股权结构复杂度', weight: 15, description: '是否存在多层嵌套或无法识别受益人' },
        { id: 'F04', name: '制裁名单筛查', weight: 25, description: '股东及法人是否命中国际制裁名单' },
        { id: 'F05', name: '历史可疑交易', weight: 20, description: '过去12个月内是否触发可疑交易报告' },
    ],
    status: '生效中',
    lastUpdated: '2023-05-01'
  },
  {
    id: 'RSK-IND-01',
    name: '个人客户风险评级模型',
    version: 'v1.5',
    description: '适用于个人零售客户的风险评估。',
    factors: [
        { id: 'P01', name: '职业风险', weight: 20, description: '是否为政治公众人物(PEP)或高风险职业' },
        { id: 'P02', name: '国籍/居住地', weight: 20, description: '国籍或长期居住地风险' },
        { id: 'P03', name: '交易行为异常', weight: 30, description: '资金快进快出、与身份不符的大额交易' },
        { id: 'P04', name: '负面媒体报道', weight: 10, description: '涉及负面舆情' },
        { id: 'P05', name: '配合程度', weight: 20, description: '提供身份证明文件的配合度' },
    ],
    status: '生效中',
    lastUpdated: '2023-02-15'
  }
];

// 模拟系统用户
export const MOCK_USERS: SystemUser[] = [
    { id: 'U001', username: 'admin', role: '管理员', department: '科技部', lastLogin: '2023-10-25 09:00', status: '启用', permissions: ['ALL'] },
    { id: 'U002', username: 'lihua', role: '分析员', department: '合规部', lastLogin: '2023-10-25 08:30', status: '启用', permissions: ['ALERT_HANDLE', 'DATA_QUERY'] },
    { id: 'U003', username: 'zhangwei', role: '合规主管', department: '合规部', lastLogin: '2023-10-24 17:00', status: '启用', permissions: ['REVIEW', 'REPORT_SUBMIT', 'MODEL_VIEW'] },
    { id: 'U004', username: 'wangfang', role: '分析员', department: '运营部', lastLogin: '2023-10-20 10:00', status: '禁用', permissions: ['ALERT_HANDLE'] },
];

// 模拟系统日志
export const MOCK_SYSTEM_LOGS: SystemLog[] = [
    { id: 'LOG-001', timestamp: '2023-10-25 10:05:23', operator: 'admin', module: '系统管理', action: '修改配置', details: '更新了大额交易监测阈值参数', ip: '192.168.1.10' },
    { id: 'LOG-002', timestamp: '2023-10-25 09:45:10', operator: 'lihua', module: '预警处理', action: '排除风险', details: '排除 TRX-2023-005 可疑预警', ip: '192.168.1.15' },
    { id: 'LOG-003', timestamp: '2023-10-25 09:30:00', operator: 'system', module: '数据导入', action: '自动导入', details: '完成 T-1 日交易数据批量导入 (15000条)', ip: '127.0.0.1' },
    { id: 'LOG-004', timestamp: '2023-10-24 16:20:00', operator: 'zhangwei', module: '监管报送', action: '上报STR', details: '提交可疑交易报告 STR-2023-1024-01', ip: '192.168.1.20' },
];

// 模拟统计数据
export const STAT_DATA = [
  { name: '10/18', large: 40, suspicious: 24 },
  { name: '10/19', large: 30, suspicious: 13 },
  { name: '10/20', large: 20, suspicious: 58 },
  { name: '10/21', large: 27, suspicious: 39 },
  { name: '10/22', large: 18, suspicious: 48 },
  { name: '10/23', large: 23, suspicious: 38 },
  { name: '10/24', large: 34, suspicious: 43 },
];

export const RISK_DIST_DATA = [
  { name: '低风险', value: 850, color: '#10b981' },
  { name: '中风险', value: 120, color: '#f59e0b' },
  { name: '高风险', value: 25, color: '#ef4444' },
  { name: '极高', value: 5, color: '#7f1d1d' },
];

export const CUSTOMER_TYPE_DATA = [
  { name: '个人客户', value: 65, color: '#3b82f6' },
  { name: '企业客户', value: 30, color: '#8b5cf6' },
  { name: '金融机构', value: 5, color: '#10b981' },
];

export const TRX_VOLUME_DATA = [
  { date: '10/18', largeValue: 5000, suspicious: 1200 },
  { date: '10/19', largeValue: 4200, suspicious: 800 },
  { date: '10/20', largeValue: 6800, suspicious: 2100 },
  { date: '10/21', largeValue: 5500, suspicious: 1500 },
  { date: '10/22', largeValue: 4900, suspicious: 1800 },
  { date: '10/23', largeValue: 7200, suspicious: 2400 },
  { date: '10/24', largeValue: 6100, suspicious: 1900 },
];

export const MOCK_REPORTS: RegulatoryReport[] = [
    { id: 'RPT-001', fileName: 'STR_20231024_001.xml', reportDate: '2023-10-24 16:30', type: '可疑交易报告', transactionCount: 5, status: '校验通过', feedbackFileName: 'ACK_STR_20231024_001.xml', feedbackTime: '2023-10-24 16:35', feedbackContent: '<?xml version="1.0"?>\n<Receipt>\n  <Status>ACCEPTED</Status>\n  <Message>Report format valid. Processed successfully.</Message>\n  <BatchNo>998877</BatchNo>\n</Receipt>' },
    { id: 'RPT-002', fileName: 'LCTR_20231024_001.xml', reportDate: '2023-10-24 10:00', type: '大额交易报告', transactionCount: 120, status: '上传成功' },
    { id: 'RPT-003', fileName: 'STR_20231023_005.xml', reportDate: '2023-10-23 15:00', type: '可疑交易报告', transactionCount: 1, status: '校验失败', feedbackContent: 'Error: Invalid schema at line 45. <TransID> is missing.' },
];

// 模拟自检数据
export const MOCK_INSPECTION_ITEMS: InspectionItem[] = [
    { id: 'INS-001', category: '内控制度', requirement: '建立健全反洗钱内部控制制度', auditPoint: '是否制定了包含客户身份识别、大额可疑交易报告等在内的完整制度体系，并经高管层审批。', status: InspectionStatus.COMPLIANT, lastChecked: '2023-10-01' },
    { id: 'INS-002', category: '内控制度', requirement: '设立专门的反洗钱管理机构', auditPoint: '是否明确了反洗钱牵头部门，并配备了专职人员。', status: InspectionStatus.COMPLIANT, lastChecked: '2023-10-01' },
    { id: 'INS-003', category: '客户身份识别(KYC)', requirement: '对高风险客户采取强化识别措施', auditPoint: '是否对高风险客户定期（至少半年）进行一次重新识别。抽查5户高风险客户档案。', status: InspectionStatus.PARTIAL, remark: '部分高风险客户档案更新滞后，正在整改。', lastChecked: '2023-10-15' },
    { id: 'INS-004', category: '大额可疑报送', requirement: '按规定时限报送大额交易报告', auditPoint: '是否存在漏报、迟报情况。系统是否能在T+1日自动生成大额报文。', status: InspectionStatus.COMPLIANT, lastChecked: '2023-10-20' },
    { id: 'INS-005', category: '员工培训', requirement: '开展反洗钱业务培训', auditPoint: '每年是否至少开展1次全员反洗钱培训，并记录考核结果。', status: InspectionStatus.NON_COMPLIANT, remark: '本年度尚未组织全行规模培训，计划于11月进行。', lastChecked: '2023-09-30' },
    { id: 'INS-006', category: '资料保存', requirement: '客户身份资料及交易记录保存期限', auditPoint: '是否保存至少5年。抽查已销户客户资料是否完整。', status: InspectionStatus.COMPLIANT, lastChecked: '2023-10-01' },
];

export const MOCK_STANDARD_TABLES: StandardReportTable[] = [
    { id: 'TBL-01', tableName: '个人客户信息表', tableCode: 'GRKHXX', description: '记录个人客户的基本身份信息', recordCount: 15420, lastGenerated: '2023-10-01', status: '已生成' },
    { id: 'TBL-02', tableName: '单位客户信息表', tableCode: 'DWKHXX', description: '记录对公客户的注册及受益人信息', recordCount: 2300, lastGenerated: '2023-10-01', status: '已生成' },
    { id: 'TBL-03', tableName: '账户信息表', tableCode: 'ZHXX', description: '客户名下所有账户的状态及属性', recordCount: 18500, lastGenerated: '2023-10-01', status: '已生成' },
    { id: 'TBL-04', tableName: '交易流水表', tableCode: 'JYLS', description: '报告期内发生的所有借贷交易流水', recordCount: 450000, lastGenerated: '2023-10-24', status: '生成中' },
    { id: 'TBL-05', tableName: '大额交易报告表', tableCode: 'DEJY', description: '已上报的大额交易记录', recordCount: 5000, lastGenerated: '2023-10-01', status: '已生成' },
];

// 模拟筛查命中数据库
export const MOCK_SCREENING_HITS_DB: { [key: string]: ScreeningHit[] } = {
    'putin': [
        { id: 'HIT-001', category: ScreeningCategory.PEP, name: 'Vladimir Putin', matchScore: 100, sourceList: 'Global PEP List', details: 'President of the Russian Federation.', dateAdded: '2000-01-01' }
    ],
    'kim': [
        { id: 'HIT-002', category: ScreeningCategory.SANCTION, name: 'Kim Jong Un', matchScore: 95, sourceList: 'OFAC SDN', details: 'Leader of North Korea (DPRK). Sanctioned for nuclear proliferation activities.', dateAdded: '2012-03-15' }
    ],
    'osama': [
        { id: 'HIT-003', category: ScreeningCategory.SANCTION, name: 'Osama bin Laden', matchScore: 100, sourceList: 'UN Consolidated', details: 'Deceased. Former leader of Al-Qaeda.', dateAdded: '2001-10-01' }
    ],
    'crypto': [
        { id: 'HIT-004', category: ScreeningCategory.ADVERSE_MEDIA, name: 'Crypto King LLC', matchScore: 85, sourceList: 'Global Media Check', details: 'Associated with alleged Ponzi scheme in 2022 news reports.', dateAdded: '2023-01-10', url: 'http://news.example.com/crypto-scam' }
    ],
    'huawei': [
        { id: 'HIT-005', category: ScreeningCategory.WATCHLIST, name: 'Huawei Technologies', matchScore: 100, sourceList: 'US Entity List', details: 'Restricted entity for export controls.', dateAdded: '2019-05-16' }
    ]
};

export const MOCK_MONITORED_ENTITIES: MonitoredEntity[] = [
    { id: 'ENT-001', name: 'Iran Shipping Lines', type: '企业', addedDate: '2022-01-15', lastScreened: '2023-10-25', status: '监控中', riskLevel: RiskLevel.CRITICAL, hits: [] },
    { id: 'ENT-002', name: '张三', type: '个人', addedDate: '2023-05-20', lastScreened: '2023-10-25', status: '监控中', riskLevel: RiskLevel.LOW, hits: [] },
    { id: 'ENT-003', name: 'North Korea Trading Co', type: '企业', addedDate: '2023-09-01', lastScreened: '2023-10-25', status: '监控中', riskLevel: RiskLevel.CRITICAL, hits: [] },
];

// 模拟股权结构树
export const MOCK_STRUCTURES: CustomerStructure[] = [
    {
        customerId: 'C001',
        updateDate: '2023-09-15',
        rootNode: {
            id: 'N1', name: '上海贸易有限公司', ratio: 100, type: '企业', country: 'CN',
            children: [
                {
                    id: 'N2', name: '张三', ratio: 60, type: '个人', country: 'CN', isUBO: true,
                },
                {
                    id: 'N3', name: '李四', ratio: 40, type: '个人', country: 'CN',
                }
            ]
        }
    },
    {
        customerId: 'C004',
        updateDate: '2023-10-01',
        rootNode: {
            id: 'N1', name: '加密科技实验室', ratio: 100, type: '企业', country: 'KY',
            children: [
                {
                    id: 'N2', name: 'Crypto Fund A', ratio: 100, type: '企业', country: 'VG',
                    children: [
                        { id: 'N3', name: 'John Doe', ratio: 50, type: '个人', country: 'US', isUBO: true },
                        { id: 'N4', name: 'Unknown Entity B', ratio: 50, type: '企业', country: 'PA' }
                    ]
                }
            ]
        }
    }
];

// --- 新增：模拟客户尽职调查 (CDD) 案例数据 ---
export const MOCK_CDD_CASES: CddCase[] = [
  {
    id: 'CDD-2023-001',
    customerId: 'C011',
    customerName: '豪运在线娱乐',
    type: '新户准入',
    status: CddStatus.PENDING_APPROVAL,
    priority: '高',
    assignee: 'zhangwei',
    createDate: '2023-10-24',
    dueDate: '2023-10-26',
    riskScore: 85,
    riskComponents: [
        { category: '行业风险', score: 90, riskLevel: RiskLevel.CRITICAL, factor: '博彩/游戏行业' },
        { category: '地域风险', score: 80, riskLevel: RiskLevel.HIGH, factor: '注册地位于菲律宾' },
        { category: '结构风险', score: 70, riskLevel: RiskLevel.MEDIUM, factor: '股权结构较为复杂' }
    ],
    kycChecks: [
        { id: 'K001', name: '营业执照核验', status: 'PASS', details: '注册号有效，存续状态正常', timestamp: '2023-10-24 10:00' },
        { id: 'K002', name: '法人活体检测', status: 'PASS', details: '相似度 98.5%', timestamp: '2023-10-24 10:05' },
        { id: 'K003', name: '制裁名单筛查', status: 'WARN', details: '疑似命中 PEP 关联名单', timestamp: '2023-10-24 10:06' },
        { id: 'K004', name: '不良媒体检索', status: 'FAIL', details: '发现 3 条关于非法赌博的负面新闻', timestamp: '2023-10-24 10:07' }
    ],
    comments: ['客户属于高风险行业，且存在负面舆情，建议拒绝准入或转入EDD流程。']
  },
  {
    id: 'CDD-2023-002',
    customerId: 'C001',
    customerName: '上海贸易有限公司',
    type: '定期复核',
    status: CddStatus.IN_PROGRESS,
    priority: '中',
    assignee: 'lihua',
    createDate: '2023-10-20',
    dueDate: '2023-10-30',
    riskScore: 25,
    riskComponents: [
        { category: '行业风险', score: 30, riskLevel: RiskLevel.LOW, factor: '一般贸易' },
        { category: '地域风险', score: 10, riskLevel: RiskLevel.LOW, factor: '境内注册' }
    ],
    kycChecks: [
        { id: 'K001', name: '工商信息比对', status: 'PASS', details: '信息一致', timestamp: '2023-10-20 14:00' },
        { id: 'K002', name: '受益人变更检查', status: 'PASS', details: '无变更', timestamp: '2023-10-20 14:05' }
    ]
  },
  {
    id: 'CDD-2023-003',
    customerId: 'C003',
    customerName: '张伟',
    type: '触发式调查',
    status: CddStatus.NEW,
    priority: '高',
    assignee: 'Unassigned',
    createDate: '2023-10-25',
    dueDate: '2023-10-27',
    riskScore: 60,
    riskComponents: [
        { category: '交易行为', score: 85, riskLevel: RiskLevel.HIGH, factor: '触发大额可疑预警' }
    ],
    kycChecks: []
  },
  {
    id: 'CDD-2023-004',
    customerId: 'C002',
    customerName: '全球物流集团',
    type: '新户准入',
    status: CddStatus.APPROVED,
    priority: '低',
    assignee: 'admin',
    createDate: '2023-10-01',
    dueDate: '2023-10-05',
    riskScore: 15,
    riskComponents: [],
    kycChecks: [
        { id: 'K001', name: '所有检查项', status: 'PASS', details: '系统自动通过', timestamp: '2023-10-01 09:00' }
    ]
  }
];

// 权限定义
export const AVAILABLE_PERMISSIONS = [
    { key: 'ALERT_HANDLE', label: '预警处理 (查看/分析/排除)' },
    { key: 'REPORT_SUBMIT', label: '监管报送 (生成/上传XML)' },
    { key: 'MODEL_VIEW', label: '模型查看 (仅查看参数)' },
    { key: 'MODEL_EDIT', label: '模型配置 (修改阈值/权重)' },
    { key: 'USER_MGMT', label: '用户管理 (新增/赋权)' },
    { key: 'DATA_QUERY', label: '数据查询 (客户/交易)' },
    { key: 'REVIEW', label: '复核审批 (CDD/大额审批)' },
    { key: 'ALL', label: '超级管理员权限' }
];
