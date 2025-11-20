
export enum RiskLevel {
  LOW = '低风险',
  MEDIUM = '中风险',
  HIGH = '高风险',
  CRITICAL = '极高风险'
}

export enum TransactionType {
  LARGE_VALUE = '大额交易',
  SUSPICIOUS = '可疑交易'
}

export enum ReportStatus {
  PENDING_REVIEW = '待复核',
  ANALYZING = 'AI分析中',
  ANALYZED = '已分析',
  SUBMITTED = '已上报',
  ACCEPTED = '中心已接收',
  REJECTED = '中心驳回',
  DISMISSED = '已排除'
}

export interface BeneficialOwner {
  name: string;
  ratio: number;
  role: string;
  country: string;
  status: '已核实' | '待核实' | '异常' | '无需核实';
  verificationDate?: string;
  idType?: string;
  idNumber?: string;
  expiryDate?: string;
}

export interface NegativeNews {
  date: string;
  source: string;
  title: string;
  snippet: string;
  riskTag: string;
}

export interface RiskAssessmentLog {
  date: string;
  previousLevel: RiskLevel;
  newLevel: RiskLevel;
  reason: string;
  operator: string;
}

export interface Customer {
  id: string;
  name: string;
  type: '个人' | '企业';
  riskRating: RiskLevel;
  country: string;
  idNumber: string; 
  industry?: string;
  regDate?: string;
  address?: string;
  legalRep?: string;
  beneficialOwners?: BeneficialOwner[];
  negativeNews?: NegativeNews[];
  riskHistory?: RiskAssessmentLog[];
  tags?: string[];
}

export interface Account {
  id: string;
  customerId: string;
  accountNo: string;
  balance: number;
  currency: string;
  status: '正常' | '冻结' | '销户';
  openDate: string;
  branch?: string;
  avgDailyBalance?: number;
}

export interface AiFeedback {
  rating: 'positive' | 'negative';
  comment: string;
  timestamp: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  sender: Customer;
  recipient: Customer;
  type: TransactionType;
  triggerRule: string; 
  status: ReportStatus;
  channel?: string;
  ipAddress?: string;
  deviceId?: string;
  summary?: string;
  aiAnalysis?: string;
  aiConfidence?: number;
  reportId?: string;
  feedbackMessage?: string;
  aiFeedback?: AiFeedback;
}

export type ModelTechType = '规则' | '机器学习' | '图谱';

export interface MonitoringModel {
  id: string;
  name: string;
  type: '大额' | '可疑';
  techType: ModelTechType; // New field
  description: string;
  threshold: number;
  thresholdCurrency: string;
  riskScoreWeight: number; 
  isEnabled: boolean;
  parameters: { [key: string]: string | number }; 
  lastUpdated: string;
  stats?: {
    dailyAlerts: number;
    falsePositiveRate: string;
  };
}

export interface RiskRatingFactor {
  id: string;
  name: string;
  weight: number; // 0-100
  description: string;
}

export interface RiskRatingModel {
  id: string;
  name: string;
  version: string;
  description: string;
  factors: RiskRatingFactor[];
  status: '生效中' | '历史版本' | '草稿';
  lastUpdated: string;
}

export interface SystemUser {
  id: string;
  username: string;
  role: '管理员' | '合规主管' | '分析员';
  department: string;
  lastLogin: string;
  status: '启用' | '禁用';
  permissions?: string[];
}

export interface SystemLog {
  id: string;
  timestamp: string;
  operator: string;
  module: string;
  action: string;
  details: string;
  ip: string;
}

export interface DailyStats {
  date: string;
  largeValueCount: number;
  suspiciousCount: number;
}

export interface RegulatoryReport {
  id: string;
  fileName: string;
  reportDate: string;
  type: '可疑交易报告' | '大额交易报告';
  transactionCount: number;
  status: '上传成功' | '上传失败' | '校验通过' | '校验失败';
  feedbackFileName?: string;
  feedbackContent?: string;
  feedbackTime?: string;
}

export enum InspectionStatus {
    COMPLIANT = '达标',
    PARTIAL = '部分达标',
    NON_COMPLIANT = '未达标',
    NOT_APPLICABLE = '不适用'
}

export type InspectionCategory = '内控制度' | '客户身份识别(KYC)' | '大额可疑报送' | '资料保存' | '员工培训' | '反洗钱保密';

export interface InspectionItem {
    id: string;
    category: InspectionCategory;
    requirement: string;
    auditPoint: string;
    status: InspectionStatus;
    remark?: string;
    lastChecked?: string;
}

export interface StandardReportTable {
    id: string;
    tableName: string;
    tableCode: string;
    description: string;
    recordCount: number;
    lastGenerated: string;
    status: '已生成' | '未生成' | '生成中';
}

export enum ScreeningCategory {
    PEP = '政治公众人物 (PEP)',
    SANCTION = '制裁名单 (Sanctions)',
    ADVERSE_MEDIA = '不良媒体 (Adverse Media)',
    WATCHLIST = '执法/监管黑名单 (Watchlist)'
}

export interface ScreeningHit {
    id: string;
    category: ScreeningCategory;
    name: string;
    matchScore: number;
    sourceList: string;
    details: string;
    dateAdded: string;
    url?: string;
}

export interface MonitoredEntity {
    id: string;
    name: string;
    type: '个人' | '企业';
    addedDate: string;
    lastScreened: string;
    status: '监控中' | '已暂停';
    riskLevel: RiskLevel;
    hits: ScreeningHit[];
}

export interface ShareholderNode {
    id: string;
    name: string;
    ratio: number;
    type: '个人' | '企业';
    children?: ShareholderNode[];
    isUBO?: boolean;
    country?: string;
}

export interface CustomerStructure {
    customerId: string;
    rootNode: ShareholderNode;
    updateDate: string;
}

export enum CddStatus {
  NEW = '新建',
  IN_PROGRESS = '尽调中',
  PENDING_APPROVAL = '待审批',
  APPROVED = '通过',
  REJECTED = '拒绝',
  ENHANCED_DUE_DILIGENCE = '转入EDD'
}

export interface KycCheck {
  id: string;
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN' | 'MANUAL';
  details: string;
  timestamp: string;
}

export interface RiskScoreComponent {
  category: string;
  score: number;
  riskLevel: RiskLevel;
  factor: string;
}

export interface CddCase {
  id: string;
  customerId: string;
  customerName: string;
  type: '新户准入' | '定期复核' | '触发式调查';
  status: CddStatus;
  priority: '高' | '中' | '低';
  assignee: string;
  createDate: string;
  dueDate: string;
  riskScore: number;
  riskComponents: RiskScoreComponent[];
  kycChecks: KycCheck[];
  comments?: string[];
}

// --- 方案 A: 资金链路分析相关类型 ---
export interface GraphNode {
    id: string;
    name: string;
    type: 'account' | 'customer' | 'external';
    riskLevel: RiskLevel;
    isFocus?: boolean; // 是否为当前分析中心节点
}

export interface GraphLink {
    source: string;
    target: string;
    amount: number;
    currency: string;
    date: string;
    isSuspicious?: boolean;
}

export interface TransactionGraph {
    nodes: GraphNode[];
    links: GraphLink[];
}

// --- 方案 B: AML Copilot 相关类型 ---
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    relatedContext?: string; // e.g. "Viewing Customer C001"
}

// --- 方案 C: 统一调查案卷相关类型 ---
export enum CaseStatus {
    OPEN = '调查中',
    PENDING_REVIEW = '待复核',
    CLOSED_SUBMITTED = '已结案(上报)',
    CLOSED_DISMISSED = '已结案(排除)',
    ARCHIVED = '已归档'
}

export interface InvestigationCase {
    id: string;
    title: string; // e.g. "关于[客户名]涉嫌地下钱庄的调查"
    primarySubjectId: string; // 主体客户ID
    primarySubjectName: string;
    createDate: string;
    status: CaseStatus;
    owner: string; // 负责人
    severity: '高' | '中' | '低';
    linkedAlerts: string[]; // 关联的预警ID (Transaction IDs)
    linkedEntities: string[]; // 关联的其他实体ID
    description: string;
    conclusion?: string;
}