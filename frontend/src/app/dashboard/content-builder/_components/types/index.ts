import { BodyData } from '@/modules/smtp/gql/types';
import { EmailTemplate } from '@/modules/template/gql/types';
import { Dispatch, SetStateAction } from 'react';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

export interface BuilderControlerProps {
  onRunTemplate: () => void;
  // eslint-disable-next-line no-unused-vars
  setSmtpFrom: (from: string) => void;
  placeholders: string[];
}

export interface ContentBuilderFormInputs {
  smtp: string;
  template: string;
  recipient: string[];
  cc: string[];
  bcc: string[];
  sendSeparately: boolean;
  subject: string;
  heading: string;
  from: string;
}

export type BuilderTemplateProps = {
  smtpFrom: string;
  templateData: ContentBuilderFormInputs | null;
  emailTemplateData?: EmailTemplate | null;
  placeholders: string[];
  setPlaceholders: Dispatch<SetStateAction<string[]>>;
};

export type EmailData = {
  subject: string;
  heading: string;
  body: BodyData[];
  from?: string;
};

export interface TestmailFormProps {
  formValues: ContentBuilderFormInputs;
  setValue: UseFormSetValue<ContentBuilderFormInputs>;
  errors: FieldErrors<ContentBuilderFormInputs>;
  data: EmailData;
}
