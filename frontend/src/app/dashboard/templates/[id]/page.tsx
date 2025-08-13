/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { toast } from '@/hooks/use-toast';
import {
  GET_EMAIL_TEMPLATE,
  UPDATE_EMAIL_TEMPLATE,
} from '@/modules/template/gql';
import {
  EmailTemplate as EmailTemplateType,
  UpdateEmailTemplate,
} from '@/modules/template/gql/types';
import { extractPlaceholders } from '@/utils';
import { useMutation, useQuery } from '@apollo/client';
import Handlebars from 'handlebars';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import EmailTemplate from '../_components/emailTemplate';
import { TemplateHeader } from '../_components/templateHeader';
import keycloak from '@/auth/keycloak';

Handlebars.registerHelper(
  'ifCond',
  function (
    this: any,
    v1: any,
    operator: string,
    v2: any,
    options: Handlebars.HelperOptions
  ) {
    if (!options) {
      console.error('Handlebars "ifCond" helper options are undefined');
      return '';
    }

    switch (operator) {
      case '==':
        return v1 == v2 ? options.fn(this) : options.inverse(this);
      case '===':
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  }
);
const TemplatePage = () => {
  const TemplateController = dynamic(
    () => import('../_components/templateControler'),
    {
      ssr: false,
    }
  );
  const { id } = useParams() as { id: string };
  const { data, refetch, loading } = useQuery(GET_EMAIL_TEMPLATE, {
    variables: { id },
  });
  const { findOneEmailTemplate: initialData } = data || {};
  const [templateData, setTemplateData] = useState<EmailTemplateType>();
  const [htmlContent, setHtmlContent] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [updateEmailTemplate, { loading: loadingUpdate }] = useMutation(
    UPDATE_EMAIL_TEMPLATE
  );
  const token = keycloak.token;
  const placeholderDiv = `
  <div class="placeholder text-lg leading-9 p-8 text-gray-400 border-2 border-dashed text-center">
    Content goes here
  </div>`;
  const [templateFormData, setTemplateFormData] =
    useState<UpdateEmailTemplate>();

  useEffect(() => {
    if (templateData && templateFormData) {
      const keysToCheck = [
        'primaryImageUrl',
        'primaryLinkUrl',
        'primaryBg',
        'secondaryImageUrl',
        'secondaryLinkUrl',
        'secondaryBg',
        'footerContent',
      ];

      const isDifferent = keysToCheck.some(
        (key) =>
          templateData[key as keyof UpdateEmailTemplate] !==
          templateFormData[key as keyof UpdateEmailTemplate]
      );

      setIsModified(isDifferent);
    }
  }, [templateData, templateFormData]);

  const prevInitialDataRef = useRef<typeof initialData | null>(null);

  // Function to check if initialData is the same as the previous value
  const isSameAsPrevious = () => {
    const prevData = prevInitialDataRef.current;
    if (!prevData) return false; // No previous value to compare
    const keysToCheck = [
      'filePath',
      'primaryImageUrl',
      'primaryLinkUrl',
      'primaryBg',
      'secondaryImageUrl',
      'secondaryLinkUrl',
      'secondaryBg',
      'footerContent',
    ];
    return keysToCheck.every(
      (key) =>
        prevData[key as keyof typeof initialData] ===
        initialData[key as keyof typeof initialData]
    );
  };

  useEffect(() => {
    if (initialData) {
      // Compare the current initialData with the previous value
      if (isSameAsPrevious()) {
        return; // Return early if the data hasn't changed
      }

      // Update state only if data is different
      setTemplateData(initialData);
      setTemplateFormData((prev) => ({
        ...prev,
        primaryImageUrl: initialData.primaryImageUrl,
        primaryLinkUrl: initialData.primaryLinkUrl,
        primaryBg: initialData.primaryBg,
        secondaryImageUrl: initialData.secondaryImageUrl,
        secondaryLinkUrl: initialData.secondaryLinkUrl,
        secondaryBg: initialData.secondaryBg,
        footerContent: initialData.footerContent,
      }));

      // Update the previous value reference
      prevInitialDataRef.current = initialData;
    }
  }, [initialData]);

  useEffect(() => {
    if (!templateData?.id) {
      return;
    }

    setIsFileLoading(true);
    setFileError(null);
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NEXT_PUBLIC_API_KEY) {
      headers.apiKey = process.env.NEXT_PUBLIC_API_KEY;
    }
    fetch(
      `${templateData.filePath || process.env.NEXT_PUBLIC_DEFAULT_TEMPLATE_URL}`,
      {
        method: 'GET',
        headers,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((templateData) => {
        const placeholders = extractPlaceholders(templateData);
        setPlaceholders(placeholders);
        setHtmlContent(templateData);
      })
      .catch(() => {
        setFileError('Failed to fetch template. Please try again later.');
      })
      .finally(() => {
        setIsFileLoading(false);
      });
  }, [templateData]);

  const compiledHtml = useMemo(() => {
    setCompileError(null);
    try {
      if (htmlContent && templateFormData) {
        const template = Handlebars.compile(htmlContent);
        return template({
          ...templateData,
          ...templateFormData,
          body: [{ type: 'text', text: placeholderDiv }],
        });
      }
      return '';
    } catch (error) {
      setPlaceholders([]);
      setCompileError(
        'Failed to compile template. Please check the template structure.'
      );
      return '';
    }
  }, [htmlContent, templateFormData]);

  const handleTemplateFormSave = async () => {
    if (!templateFormData) return;
    emailTemplateUpdate(templateFormData);
  };

  const emailTemplateUpdate = async (data: UpdateEmailTemplate) => {
    try {
      const response = await updateEmailTemplate({
        variables: {
          id,
          updateEmailTemplateInput: data,
        },
      });
      if (response) {
        toast({
          title: 'Template Saved Successfully',
          description: `Your changes have been saved.`,
          variant: 'default',
          duration: 5000,
        });
        refetch();
      }
    } catch (err) {
      console.error('Error saving template:', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-89px)]">
      <div className="sticky top-0 mr-5 h-full w-[300px] overflow-y-auto">
        <div className="bg-primary p-5 text-center font-bold uppercase text-white">
          Edit Template
        </div>
        <div className="h-[calc(100%-64px)] overflow-y-auto bg-gray-100 py-5">
          {!loading && (
            <TemplateController
              setTemplateData={setTemplateFormData}
              data={initialData}
              formData={templateFormData || {}}
              placeholders={placeholders}
            />
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div className="h-[70px]">
          <TemplateHeader
            data={initialData}
            onSubmitFrom={emailTemplateUpdate}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          {fileError || compileError || isFileLoading ? (
            <div className="h-full bg-gray-100 p-10">
              <div className="h-full border bg-white p-8">
                <div className="flex h-full items-center justify-center border-2 border-dashed text-center">
                  {fileError && (
                    <div className="error-message">{fileError}</div>
                  )}
                  {compileError && (
                    <div className="error-message">{compileError}</div>
                  )}
                  {isFileLoading && (
                    <Loader2 className="animate-spin text-blue-700" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <EmailTemplate
              compiledHtml={compiledHtml}
              handleSave={handleTemplateFormSave}
              isModified={isModified}
              loading={loadingUpdate || loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplatePage;
