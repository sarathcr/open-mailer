import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import { InputTags } from '@/components/ui/inputWithTags';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { FIND_ALL_EMAIL_TEMPLATES } from '@/modules/content-builder/gql/queries';
import { EmailTemplatesData } from '@/modules/content-builder/gql/types';
import { FIND_ALL_SMTP_QUERY } from '@/modules/smtp/gql';
import { SmtpData } from '@/modules/smtp/gql/types';
import { useQuery } from '@apollo/client';
import { Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { BuilderControlerProps, ContentBuilderFormInputs } from '../types';

const BuilderControler: React.FC<BuilderControlerProps> = ({
  onRunTemplate,
  setSmtpFrom,
  placeholders,
}) => {
  const [selectedSmtpValue, setSelectedSmtpValue] = useState('');
  const [selectedTemplateValue, setSelectedTemplateValue] = useState('');
  const { data: smtpData } = useQuery<SmtpData>(FIND_ALL_SMTP_QUERY, {
    variables: { filter: { isBackUp: false } },
  });
  const { data: emailTemplatesData } = useQuery<EmailTemplatesData>(
    FIND_ALL_EMAIL_TEMPLATES
  );

  const {
    clearErrors,
    trigger,
    register,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<ContentBuilderFormInputs>();

  const formValues = watch();

  useEffect(() => {
    const checkValidityAndRun = async () => {
      const isValid = await trigger(['smtp', 'template']);
      if (isValid) {
        onRunTemplate();
      }
    };

    if (formValues.smtp || formValues.template) {
      checkValidityAndRun();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.smtp, formValues.template, formValues.heading, trigger]);

  const smtpValueChange = (value: string) => {
    const smtpUsername = smtpData?.findAllSmtp?.data?.find(
      (item: any) => item.id === value
    );
    setSmtpFrom(smtpUsername?.from || '');
    setSelectedSmtpValue(value);
    setValue('smtp', value, { shouldValidate: true });
  };

  const templateValueChange = (value: string) => {
    setSelectedTemplateValue(value);
    setValue('template', value, { shouldValidate: true });
  };
  return (
    <div className="flex h-full flex-col items-end justify-between">
      <div className="w-full">
        <div className="mb-5">
          <Label className="text-xs text-gray-7">
            SMTP<span className="ml-2 text-red-500">*</span>
          </Label>
          <Select value={selectedSmtpValue} onValueChange={smtpValueChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an SMTP" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {smtpData?.findAllSmtp?.data?.map((item: any) => (
                  <SelectItem key={item.id} value={item?.id}>
                    {item.from}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.smtp && (
            <span className="block text-xs text-red-500">
              {errors.smtp.message}
            </span>
          )}
        </div>
        <div className="mb-5">
          <Label className="text-xs text-gray-7">
            Template<span className="ml-2 text-red-500">*</span>
          </Label>
          <Select
            value={selectedTemplateValue}
            onValueChange={templateValueChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {emailTemplatesData?.findAllEmailTemplates?.data?.map(
                  (item: any) => (
                    <SelectItem key={item.id} value={item?.id}>
                      {item.name}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.template && (
            <span className="block text-xs text-red-500">
              {errors.template.message}
            </span>
          )}
        </div>
        <div className="mb-5">
          <Label className="text-xs text-gray-7">Send mail separately</Label>
          <br />
          <div className="flex gap-2">
            <Controller
              name="sendSeparately"
              control={control}
              defaultValue={false}
              render={({ field: { value, onChange } }) => (
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => {
                    onChange(checked);
                  }}
                />
              )}
            />

            <span className="flex gap-1">
              <Info className="mt-0.5 h-4 w-4 text-gray-5" />
              <p className="mt-0.5 text-xs text-gray-7">
                {formValues.sendSeparately
                  ? 'Mails will be sent separately'
                  : 'Mails will not be sent separately'}
              </p>
            </span>
            {errors.sendSeparately && (
              <span className="block text-xs text-red-500">
                {errors.sendSeparately.message}
              </span>
            )}
          </div>
        </div>
        <div className="mb-5">
          <Label className="text-xs text-gray-7">Recipients</Label>
          <Controller
            name="recipient"
            control={control}
            render={({ field }) => (
              <InputTags
                value={field.value || []}
                onChange={(values) => {
                  field.onChange(values);
                  trigger('recipient');
                }}
                placeholder="Enter recipient addresses, comma-separated"
                className="w-full"
              />
            )}
          />
          {errors.recipient && (
            <span className="block text-xs text-red-500">
              {Array.isArray(errors.recipient) ? (
                <ul className="text-xs text-red-500">
                  {errors.recipient.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              ) : (
                <span className="mt-[5px] block text-xs text-red-500">
                  {errors.recipient.message}
                </span>
              )}
            </span>
          )}
        </div>
        <div className="mb-5">
          <Label className="text-xs text-gray-7">CC</Label>
          <Controller
            name="cc"
            control={control}
            render={({ field }) => (
              <InputTags
                value={field.value || []}
                onChange={(values) => {
                  field.onChange(values);
                  trigger('cc');
                }}
                placeholder="Enter cc addresses, comma-separated"
                className="w-full"
              />
            )}
          />
          {errors.cc && (
            <p className="block text-xs text-red-500">
              {Array.isArray(errors.cc) ? (
                <ul className="text-xs text-red-500">
                  {errors.cc.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-red-500">{errors.cc.message}</p>
              )}
            </p>
          )}
        </div>
        <div className="mb-5">
          <Label className="text-xs text-gray-7">BCC</Label>
          <Controller
            name="bcc"
            control={control}
            render={({ field }) => (
              <InputTags
                value={field.value || []}
                onChange={(values) => {
                  field.onChange(values);
                  trigger('bcc');
                }}
                placeholder="Enter bcc addresses, comma-separated"
                className="w-full"
              />
            )}
          />
          {errors.bcc && (
            <p className="block text-xs text-red-500">
              {Array.isArray(errors.bcc) ? (
                <ul className="text-xs text-red-500">
                  {errors.bcc.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-red-500">{errors.bcc.message}</p>
              )}
            </p>
          )}
        </div>
        <div className="mb-5">
          <FloatingLabelInput
            id="subject"
            label="subject"
            {...register('subject')}
            className="bg-white placeholder:text-gray-400"
            onInput={() => clearErrors('subject')}
          />
          {errors.subject && (
            <span className="block text-xs text-red-500">
              {errors.subject.message}
            </span>
          )}
        </div>
        {placeholders.includes('{{heading}}') && (
          <div className="mb-5">
            <FloatingLabelInput
              id="heading"
              label="Heading"
              {...register('heading')}
              className="bg-white placeholder:text-gray-400"
              onInput={() => clearErrors('heading')}
            />
            {errors.heading && (
              <span className="block text-xs text-red-500">
                {errors.heading.message}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderControler;
