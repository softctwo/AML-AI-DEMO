
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
  legalRep?: string; // 法人代表
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
  channel?: string; // 交易渠道
  ipAddress?: string;
  deviceId?: string;
  summary?: string; // 附言/备注
  aiAnalysis?: string;
  aiConfidence?: number;
  reportId?: string;
  feedbackMessage?: string;
  aiFeedback?: AiFeedback;
}

export interface MonitoringModel {
  id: string;
  name: string;
  type: '大额' | '可疑';
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