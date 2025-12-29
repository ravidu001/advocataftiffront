export type CompositionDetailContent = {
  introParagraphs: string[];
  growthSummary: string;
  firstMetrics: string[];
  secondMetrics: string[];
  recommendations: string[];
};

export type TrendDetailContent = {
  intro: string;
  disruptionParagraph: string;
  longTermTrends: string[];
  emergingPattern: string;
  recommendations: string[];
};

export type RankingDetailContent = {
  intro: string;
  stabilityRanking: string[];
  linkTexts: string[];
  recommendations: string[];
};

export type DataQualityDetailContent = {
  intro: string;
  missingDataSummary: string;
  breakdown: string[];
  timeline: string[];
  outliers: string[];
  checks: string[];
  recommendations: string[];
};

export type ForecastDetailContent = {
  intro: string;
  forecastSummary: string;
  categoryProjections: string[];
  validationNotes: string[];
  riskFactors: string[];
  recommendations: string[];
};

export type DatasetDetailContent = {
  intro: string;
  enhancements: string[];
  fileFormats: string[];
  newColumns: string[];
  qaChecks: string[];
  recommendations: string[];
};

export type KeyInsightContent = {
  title: string;
  content: string;
  confidence: string;
};

export type DetailContentMap = {
  keyInsights: KeyInsightContent[];
  composition: CompositionDetailContent;
  trend: TrendDetailContent;
  ranking: RankingDetailContent;
  dataQuality: DataQualityDetailContent;
  forecast: ForecastDetailContent;
  dataset: DatasetDetailContent;
};

export type DetailVariant = keyof DetailContentMap;
