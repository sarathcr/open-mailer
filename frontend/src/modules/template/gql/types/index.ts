import { templateFormInputs } from '../../template.schema';

export interface EmailTemplate {
  id: string;
  name: string;
  filePath?: string;
  primaryImageUrl?: string;
  primaryLinkUrl?: string;
  primaryBg?: string;
  secondaryImageUrl?: string;
  secondaryLinkUrl?: string;
  secondaryBg?: string;
  footerContent?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export type UpdateEmailTemplate = Partial<
  Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>
>;

export interface TemplateFormProps {
  values: templateFormInputs;
  // eslint-disable-next-line no-unused-vars
  onClickSubmit?: () => void;
}
export interface CreateEmailTemplate {
  createEmailTempalte: EmailTemplate;
}
export interface SoftDeleteTemplate {
  softDeleteTemplate: EmailTemplate;
}
export interface RestoreTemplate {
  restoreTemplate: EmailTemplate;
}
export interface RemoveEmailTemplate {
  removeEmailTemplate: EmailTemplate;
}
