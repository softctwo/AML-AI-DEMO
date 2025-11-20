
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

// Ensure API key is present
const API_KEY = process.env.API_KEY || '';

// Initialize Gemini Client
let aiClient: GoogleGenAI | null = null;

try {
  if (API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: API_KEY });
  } else {
    console.warn("Gemini API Key is missing. AI features will be disabled.");
  }
} catch (error) {
  console.error("Failed to initialize Gemini client", error);
}

export const analyzeTransaction = async (transaction: Transaction): Promise<string> => {
  if (!aiClient) {
    return "错误: 未配置 Gemini API Key，无法进行分析。";
  }

  const prompt = `
    **角色设定**: 您是反洗钱(AML)领域的资深专家，精通FATF建议及中国人民银行关于大额和可疑交易报告的监管要求。
    
    **任务目标**: 对以下触发监测规则的交易进行深度智能分析，生成一份专业的《可疑交易甄别分析报告》。
    
    **交易数据**:
    - 交易流水号: ${transaction.id}
    - 交易时间: ${transaction.date}
    - 交易金额: ${transaction.amount.toLocaleString()} ${transaction.currency}
    - 触发模型/规则: ${transaction.triggerRule}
    - 交易类型: ${transaction.type}
    - 交易附言: ${transaction.summary || '无'}
    
    **主体画像**:
    - 付款方: ${transaction.sender.name} (${transaction.sender.type}, 风险等级: ${transaction.sender.riskRating}, 地区: ${transaction.sender.country})
    - 收款方: ${transaction.recipient.name} (${transaction.recipient.type}, 风险等级: ${transaction.recipient.riskRating}, 地区: ${transaction.recipient.country})
    
    **分析要求**:
    请按照Markdown格式输出，包含以下四个章节：
    
    ### 1. 资金路径与关联分析
    分析资金流向的合理性。付款方与收款方是否存在明显的业务关联或地域关联？是否存在跨风险地区转移资金的迹象？
    
    ### 2. 行为特征识别
    分析交易金额、频率、时间是否符合该客户类型的正常经营或生活规律。是否存在如“整存整取”、“分散转入集中转出”、“快进快出”等典型洗钱特征？
    
    ### 3. 风险深度研判
    结合触发规则和主体背景，指出具体的风险点。例如：是否涉及地下钱庄、网络赌博、虚假贸易、制裁规避等具体洗钱上游犯罪类型。
    
    ### 4. 处置建议与结论
    - **风险等级判定**: [低 / 中 / 高]
    - **建议动作**: [排除风险 / 持续关注 / 上报可疑交易报告(STR)]
    - **填报理由**: (请提供一段精炼的、可直接填入监管报送系统的分析描述，200字以内)
  `;

  try {
    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "无法生成分析结果。";
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return "错误: 连接AI服务失败，请检查网络或API配额。";
  }
};

export const generateReportXml = (transaction: Transaction, rationale: string): string => {
  // Simulation of generating a CN-AML compliant XML string
  return `<?xml version="1.0" encoding="UTF-8"?>
<STRReport>
    <ReportInfo>
        <ReportDate>${new Date().toISOString().split('T')[0]}</ReportDate>
        <ReportID>STR-${Date.now()}</ReportID>
    </ReportInfo>
    <TransactionInfo>
        <TransID>${transaction.id}</TransID>
        <Amount>${transaction.amount}</Amount>
        <Currency>${transaction.currency}</Currency>
        <Date>${transaction.date}</Date>
    </TransactionInfo>
    <SubjectInfo>
        <Sender>${transaction.sender.name}</Sender>
        <Receiver>${transaction.recipient.name}</Receiver>
    </SubjectInfo>
    <AnalysisNarrative>
        <![CDATA[${rationale.slice(0, 1000)}...]]>
    </AnalysisNarrative>
</STRReport>`;
};
