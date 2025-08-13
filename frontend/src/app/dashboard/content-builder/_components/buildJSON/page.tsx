'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';
import { ContentBuilderFormInputs } from '../types';

interface BuildJsonProps {
  builderValues: ContentBuilderFormInputs;
  data: any;
}

export default function BuildJson({ data, builderValues }: BuildJsonProps) {
  const [copyMessage, setCopyMessage] = useState('');

  const {
    smtp: smtpConfigId,
    template: emailTemplateId,
    recipient,
  } = builderValues;

  const copyGql = `
  mutation {
    sendMail(
      input: {
        smtpConfigId: "${smtpConfigId}"
        emailTemplateId: "${emailTemplateId}"
        recipients: "${recipient.join(',')}"
        data: {
          subject: "${data.subject}"
          heading: "${data.heading}"
          body: ${JSON.stringify(data.body, null, 2)}
        }
      }
    )
  }
`;

  const handleCopy = () => {
    navigator.clipboard
      .writeText(copyGql)
      .then(() => {
        setCopyMessage('Copied to clipboard!');
        setTimeout(() => setCopyMessage(''), 2000);
      })
      .catch((error) => {
        console.error('Failed to copy text: ', error);
        setCopyMessage('Failed to copy!');
        setTimeout(() => setCopyMessage(''), 2000);
      });
  };

  return (
    <Tabs defaultValue="account" className="h-[400px] w-full">
      <div className="flex flex-col items-center gap-4">
        <TabsList className="flex w-full justify-center gap-2">
          <TabsTrigger
            value="account"
            className="flex-1 text-center md:w-[150px] md:flex-none"
          >
            Rest API
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="flex-1 text-center md:w-[150px] md:flex-none"
          >
            GraphQL
          </TabsTrigger>
        </TabsList>
      </div>
      <div>
        <div>
          <div
            className="m-2 flex cursor-pointer text-gray-500 hover:text-black"
            onClick={handleCopy}
          >
            <Copy className="ml-auto" />
          </div>
          <TabsContent value="account">
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-words">
              Content for Rest API
            </pre>
          </TabsContent>
          <TabsContent value="password">
            <pre className="max-h-[300px] overflow-auto whitespace-pre-wrap break-words">
              {copyGql}
            </pre>
          </TabsContent>
        </div>
      </div>

      {copyMessage && (
        <div className="mt-2 text-center text-sm text-green-600">
          {copyMessage}
        </div>
      )}
    </Tabs>
  );
}
