export interface Surveyor {
  id: string;
  name: string;
  company: string;
  email: string;
}

export interface Quote {
  id: string;
  surveyorId: string;
  discipline: string;
  surveyType: string;
  quoteAmount: number;
  turnaroundDays: number;
  isInstructed: boolean;
}

export interface Project {
  id: string;
  quoteId: string;
  surveyorId: string;
  siteVisitDate: Date | null;
  firstDraftDate: Date | null;
  finalReportDate: Date | null;
  discipline: string;
  surveyType: string;
}

export type TimelineEvent = {
  projectId: string;
  surveyorId: string;
  date: Date;
  type: 'SITE_VISIT' | 'FIRST_DRAFT' | 'FINAL_REPORT';
  description: string;
} 