'use client';

import { FIND_ONE_EMAIL_TEMPLATE } from '@/modules/content-builder/gql/queries';
import { contentBuilderSchema } from '@/modules/content-builder/schemas/content-builder.schema';
import { useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { ContentBuilderFormInputs } from './_components/types';
import dynamic from 'next/dynamic';

const BuilderControler = dynamic(
  () => import('./_components/builderControler'),
  { ssr: false }
);
const BuilderTemplate = dynamic(() => import('./_components/builderTemplate'), {
  ssr: false,
});

const ContentBuilder = () => {
  const [emailTemplateId, setEmailTemplateId] = useState('');
  const [smtpFrom, setSmtpFrom] = useState('');
  const [emailTemplateData, setEmailTemplateData] = useState();
  const [placeholders, setPlaceholders] = useState<string[]>([]);

  const { data } = useQuery(FIND_ONE_EMAIL_TEMPLATE, {
    variables: { emailTemplateId: emailTemplateId },
    skip: !emailTemplateId,
  });

  useEffect(() => {
    if (data) {
      setEmailTemplateData(data.findOneEmailTemplate);
    }
  }, [data]);

  const methods = useForm<ContentBuilderFormInputs>({
    defaultValues: {
      smtp: '',
      template: '',
      recipient: [],
      subject: '',
      heading: '',
      from: '',
      sendSeparately: false,
      cc: [],
      bcc: [],
    },
    resolver: zodResolver(contentBuilderSchema),
  });

  const [templateData, setTemplateData] =
    useState<ContentBuilderFormInputs | null>(null);

  const onRunTemplate = () => {
    const formValues = methods.getValues();
    if (formValues.smtp && formValues.template && formValues.recipient) {
      setTemplateData(formValues);
    }
    setEmailTemplateId(formValues.template);
  };

  return (
    <>
      <FormProvider {...methods}>
        <div className="flex">
          <div className="sticky top-0 mr-5 h-[calc(100vh-89px)] w-[300px] overflow-y-auto">
            <div className="bg-primary p-5 text-center font-bold uppercase text-white">
              Content builder
            </div>
            <div className="h-[calc(100vh-153px)] overflow-y-auto bg-gray-100 p-5">
              <BuilderControler
                onRunTemplate={onRunTemplate}
                setSmtpFrom={setSmtpFrom}
                placeholders={placeholders}
              />
            </div>
          </div>
          <div className="h-[calc(100vh-89px)] w-[calc(100%-300px)] overflow-y-auto">
            <BuilderTemplate
              templateData={templateData}
              smtpFrom={smtpFrom}
              emailTemplateData={emailTemplateData}
              placeholders={placeholders}
              setPlaceholders={setPlaceholders}
            />
          </div>
        </div>
      </FormProvider>
    </>
  );
};
export default ContentBuilder;
