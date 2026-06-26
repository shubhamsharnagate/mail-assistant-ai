export type EmailTone = "Formal" | "Professional" | "Friendly" | "Casual";

export type EmailType = 
  | "Leave Request"
  | "Job Application"
  | "Complaint"
  | "Meeting Request"
  | "Internship Request"
  | "Custom Email";

export interface EmailGenerationInput {
  emailType: EmailType;
  recipientName: string;
  senderName: string;
  purpose: string;
  tone: EmailTone;
  additionalInfo: string;
}

export interface EmailGenerationResult {
  subject: string;
  body: string;
}

export interface EmailHistoryItem {
  id: string;
  timestamp: string;
  input: EmailGenerationInput;
  result: EmailGenerationResult;
}
