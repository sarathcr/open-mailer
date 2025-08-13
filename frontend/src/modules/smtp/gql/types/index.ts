import React from 'react';
import { SmtpFormInputs } from '../../schemas';
import {
  buttonContentInputs,
  buttonGroupContentInputs,
} from '../../schemas/flexibleContent.schema';
import { APITokenFormInputs } from '@/modules/api-token/schemas/api-tokenSchemas';

export interface SmtpData {
  findAllSmtp: {
    data: SmtpFormInputs[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface SmtpFormProps {
  values: SmtpFormInputs;
  onClickSubmit?: () => void;
}

export type BodyData =
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'button';
      buttonText: string;
      buttonLink: string;
      align: string;
    }
  | {
      type: 'buttons';
      buttons: {
        text: string;
        link: string;
      }[];
      align: string;
    };
export interface SelectContentTypeProps {
  setContentState: React.Dispatch<React.SetStateAction<BodyData[]>>;
  currentIndex: number;
  item?: BodyData;
}

export interface TextFormProps {
  value: { textContent: string };
  // eslint-disable-next-line no-unused-vars
  onSubmitText: (textContent: string) => void;
}

export interface ButtonformProps {
  // eslint-disable-next-line no-unused-vars
  onSubmitButton: (data: buttonContentInputs) => void;
  defaultValues: buttonContentInputs;
}
export interface ButtonGroupformProps {
  // eslint-disable-next-line no-unused-vars
  onSubmitButtonGroup: (data: buttonGroupContentInputs) => void;
  editData?: {
    buttons: { text: string; link: string }[];
    align: string;
  };
}

export interface APITokenData {
  apitokens: {
    data: APITokenFormInputs[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface APITokenFormProps {
  values: { apiToken: APITokenFormInputs };
  onClickSubmit?: () => void;
}

export interface APITokenFormPropsinput {
  values: APITokenFormInputs;
  onClickSubmit?: () => void;
}
