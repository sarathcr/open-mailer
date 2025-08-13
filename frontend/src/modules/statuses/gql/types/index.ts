export interface Statuses {
  id: string;
  smtpConfigId: string;
  apiToken: {
    id: string;
    name: string;
  };
  smtpConfig: {
    id: string;
    from: string;
  };
  emailTemplateId?: string;
  emailTemplate: {
    id: string;
    name: string;
  };
  recipients?: string;
  data?: string;
  status?: string;
  retries?: string;
  maxRetries?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
