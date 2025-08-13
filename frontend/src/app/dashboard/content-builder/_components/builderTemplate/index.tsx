'use client';

import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useDialog from '@/hooks/useDialog';
import { BodyData } from '@/modules/smtp/gql/types';
import { extractPlaceholders } from '@/utils';
import Handlebars from 'handlebars';
import React, { useEffect, useRef, useState } from 'react';
import ReactDragListView from 'react-drag-listview';
import { useFormContext } from 'react-hook-form';
import BuildJson from '../buildJSON/page';
import { SelectContentType } from '../contentTypeSelector';
// import TestmailForm from '../testMail';
import TestmailForm from '../testMail';
import {
  BuilderTemplateProps,
  ContentBuilderFormInputs,
  EmailData,
} from '../types';
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
const BuilderTemplate: React.FC<BuilderTemplateProps> = ({
  smtpFrom,
  templateData,
  emailTemplateData,
  placeholders,
  setPlaceholders,
}) => {
  const [isCustomFrom, setCustomIsFrom] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [contentState, setContentState] = useState<BodyData[]>([]);

  const helpersRegistered = useRef(false);
  const { isOpen, clearDialog } = useDialog();

  const {
    trigger,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useFormContext<ContentBuilderFormInputs>();
  const formValues = watch();
  const token = keycloak.token;

  useEffect(() => {
    if (!helpersRegistered.current) {
      helpersRegistered.current = true;
    }
    if (emailTemplateData) {
      const templatepath =
        emailTemplateData?.filePath && emailTemplateData?.filePath !== ''
          ? emailTemplateData?.filePath
          : process.env.NEXT_PUBLIC_DEFAULT_TEMPLATE_URL;
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      if (process.env.NEXT_PUBLIC_API_KEY) {
        headers.apiKey = process.env.NEXT_PUBLIC_API_KEY;
      }
      fetch(templatepath + '', {
        method: 'GET',
        headers,
      })
        .then((response) => response.text())
        .then((template) => {
          const placeholders = extractPlaceholders(template);
          setPlaceholders(placeholders);
          const compiledTemplate = Handlebars.compile(template);
          const placeholderDiv = `
        <div class="placeholder text-lg leading-9 p-8 text-gray-400 border-2 border-dashed text-center">
          Content goes here
        </div>`;
          const populatedContent = compiledTemplate({
            ...emailTemplateData,
            body:
              contentState.length === 0
                ? [{ type: 'text', text: placeholderDiv }]
                : contentState,
            heading: formValues.heading,
          });
          setHtmlContent(populatedContent);
        })
        .catch((error) => {
          console.error('Error fetching or compiling template:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    contentState,
    emailTemplateData,
    emailTemplateData?.filePath,
    templateData,
  ]);

  useEffect(() => {
    if (htmlContent && emailTemplateData) {
      const template = Handlebars.compile(htmlContent);
      template(emailTemplateData);
    }
  }, [htmlContent, emailTemplateData]);

  const data: EmailData = {
    subject: formValues.subject,
    heading: formValues.heading,
    from: formValues.from ?? '',
    body: contentState,
  };

  const { openDialog } = useDialog();

  const onTestMail = async () => {
    const isValid = await trigger(['recipient', 'subject', 'heading']);
    if (isValid) {
      openDialog({
        title: 'Send Test mail',
        content: (
          <TestmailForm
            formValues={formValues}
            setValue={setValue}
            errors={errors}
            data={data}
          />
        ),
      });
    }
  };

  const onCopyJson = async () => {
    const isValid = await trigger(['recipient', 'subject', 'heading']);
    if (isValid) {
      openDialog({
        title: 'Build JSON',
        content: (
          <div className="'w-[900px] bg-gray-200 p-4">
            <BuildJson builderValues={formValues} data={data} />
          </div>
        ),
      });
    }
  };

  const onContent = (currentIndex?: number, item?: BodyData) => {
    openDialog({
      title: 'Select Content Type',
      content: (
        <SelectContentType
          setContentState={setContentState}
          currentIndex={currentIndex ?? 0}
          item={item}
        />
      ),
    });
  };

  useEffect(() => {
    if (htmlContent) {
      const contentDiv = document.getElementById('templateBody');
      if (contentDiv) {
        const directChildren = contentDiv.querySelectorAll(':scope > div');
        directChildren.forEach((child, idx) => {
          child.classList.add(
            'draggable-item',
            'group',
            'mb-2.5',
            'p-2.5',
            'flex',
            'items-center',
            'relative',
            'border-2',
            'border-transparent',
            'hover:border-dashed',
            'hover:border-gray-300'
          );

          const actionDiv = document.createElement('div');
          actionDiv.classList.add(
            'action',
            'absolute',
            'right-[-25px]',
            'top-[-2px]',
            'flex',
            'items-center',
            'justify-between',
            'flex-col',
            'bg-gray-200',
            'gap-2',
            'invisible',
            'group-hover:visible'
          );

          const drag = document.createElement('a');
          drag.href = '#';
          drag.classList.add(
            'drag-handle',

            'cursor-grab',
            'p-1.5'
          );
          drag.innerHTML = `
            <svg  width="12px" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
              <path fill-rule="nonzero" d="M332.649 72.558c5.869 6.101 5.681 15.806-.421 21.675-6.101 5.868-15.806 5.68-21.675-.421l-38.878-40.213v187.336h187.253l-33.908-32.656c-6.101-5.869-6.29-15.574-.421-21.676 5.869-6.101 15.574-6.289 21.675-.42l61.445 59.19c5.868 6.101 5.68 15.807-.421 21.675l-67.856 65.601c-6.101 5.869-15.806 5.681-21.675-.421-5.868-6.101-5.68-15.806.421-21.675l40.213-38.878H271.675v186.726l38.878-40.213c5.869-6.101 15.574-6.289 21.675-.421 6.102 5.869 6.29 15.574.421 21.675l-65.601 67.856c-5.868 6.101-15.574 6.289-21.675.421l-66.022-68.277c-5.869-6.101-5.681-15.806.421-21.675 6.101-5.868 15.806-5.68 21.675.421l39.488 40.846V271.675H53.599l40.213 38.878c6.101 5.869 6.289 15.574.421 21.675-5.869 6.102-15.574 6.29-21.675.421L4.702 267.048c-6.101-5.868-6.289-15.574-.421-21.675l68.277-66.022c6.101-5.869 15.806-5.681 21.675.421 5.868 6.101 5.68 15.806-.421 21.675l-40.846 39.488h187.969V52.966l-39.488 40.846c-5.869 6.101-15.574 6.289-21.675.421-6.102-5.869-6.29-15.574-.421-21.675l66.022-68.277c6.101-5.868 15.807-5.68 21.675.421l65.601 67.856z"/>
            </svg>
          `;

          const trash = document.createElement('a');
          trash.href = '#';
          trash.classList.add('trash-bin', 'cursor-pointer', 'p-1.5');
          trash.innerHTML = `
            <svg width="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105.7 122.88" >
              <path fill="#ff0000" d="M30.46,14.57V5.22A5.18,5.18,0,0,1,32,1.55v0A5.19,5.19,0,0,1,35.68,0H70a5.22,5.22,0,0,1,3.67,1.53l0,0a5.22,5.22,0,0,1,1.53,3.67v9.35h27.08a3.36,3.36,0,0,1,3.38,3.37V29.58A3.38,3.38,0,0,1,102.32,33H98.51l-8.3,87.22a3,3,0,0,1-2.95,2.69H18.43a3,3,0,0,1-3-2.95L7.19,33H3.37A3.38,3.38,0,0,1,0,29.58V17.94a3.36,3.36,0,0,1,3.37-3.37Zm36.27,0V8.51H39v6.06ZM49.48,49.25a3.4,3.4,0,0,1,6.8,0v51.81a3.4,3.4,0,1,1-6.8,0V49.25ZM69.59,49a3.4,3.4,0,1,1,6.78.42L73,101.27a3.4,3.4,0,0,1-6.78-.43L69.59,49Zm-40.26.42A3.39,3.39,0,1,1,36.1,49l3.41,51.8a3.39,3.39,0,1,1-6.77.43L29.33,49.46ZM92.51,33.38H13.19l7.94,83.55H84.56l8-83.55Z"/>
            </svg>
          `;

          trash.addEventListener('click', (event) => {
            event.preventDefault();
            handleDelete(idx);
          });

          const edit = document.createElement('a');
          edit.href = '#';
          edit.classList.add('edit', 'cursor-pointer', 'p-1.5');
          edit.innerHTML = `
     <svg width="12px" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px" viewBox="0 0 121.48 122.88" style="enable-background:new 0 0 121.48 122.88" xml:space="preserve"><style type="text/css">.st0{fill-rule:evenodd;clip-rule:evenodd;}</style><g><path class="st0" d="M96.84,2.22l22.42,22.42c2.96,2.96,2.96,7.8,0,10.76l-12.4,12.4L73.68,14.62l12.4-12.4 C89.04-0.74,93.88-0.74,96.84,2.22L96.84,2.22z M70.18,52.19L70.18,52.19l0,0.01c0.92,0.92,1.38,2.14,1.38,3.34 c0,1.2-0.46,2.41-1.38,3.34v0.01l-0.01,0.01L40.09,88.99l0,0h-0.01c-0.26,0.26-0.55,0.48-0.84,0.67h-0.01 c-0.3,0.19-0.61,0.34-0.93,0.45c-1.66,0.58-3.59,0.2-4.91-1.12h-0.01l0,0v-0.01c-0.26-0.26-0.48-0.55-0.67-0.84v-0.01 c-0.19-0.3-0.34-0.61-0.45-0.93c-0.58-1.66-0.2-3.59,1.11-4.91v-0.01l30.09-30.09l0,0h0.01c0.92-0.92,2.14-1.38,3.34-1.38 c1.2,0,2.41,0.46,3.34,1.38L70.18,52.19L70.18,52.19L70.18,52.19z M45.48,109.11c-8.98,2.78-17.95,5.55-26.93,8.33 C-2.55,123.97-2.46,128.32,3.3,108l9.07-32v0l-0.03-0.03L67.4,20.9l33.18,33.18l-55.07,55.07L45.48,109.11L45.48,109.11z M18.03,81.66l21.79,21.79c-5.9,1.82-11.8,3.64-17.69,5.45c-13.86,4.27-13.8,7.13-10.03-6.22L18.03,81.66L18.03,81.66z"/></g></svg>
   `;
          edit.addEventListener('click', (event) => {
            event.preventDefault();
            handleEdit(idx);
          });
          actionDiv.appendChild(drag);
          actionDiv.appendChild(trash);
          actionDiv.appendChild(edit);

          child.appendChild(actionDiv);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [htmlContent, isOpen]);

  const handleDelete = (currentIndex: number) => {
    openDialog({
      title: 'Confirm Delete',
      content: (
        <div>
          <p>Are you sure you want to delete this item?</p>
          <div className="flex justify-end gap-2">
            <Button
              className="bg-primary"
              onClick={() => {
                clearDialog(); // Close the dialog
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-700"
              onClick={() => {
                setContentState((prevItems) =>
                  prevItems.filter((_, i) => i !== currentIndex)
                );
                clearDialog();
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      ),
      clearDialog: () => {},
    });
  };
  const handleEdit = (currentIndex: number) => {
    const item = contentState[currentIndex];
    if (!item) {
      console.error('Item not found at index', currentIndex);
      return;
    }

    onContent(currentIndex, item);
  };

  const dragProps = {
    onDragEnd(fromIndex: number, toIndex: number) {
      const newItems = [...contentState];
      const [item] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, item);
      setContentState(newItems);
    },
    nodeSelector: '.draggable-item',
    handleSelector: '.drag-handle',
  };

  return (
    <div className="mr-5 h-full">
      {templateData ? (
        <div className="pb-5 pt-5">
          <span className="mb-2 block text-primary">
            <strong className="mr-1">Subject:</strong>
            {formValues?.subject}
          </span>
          <div className="relative flex items-center">
            <span className="flex items-center text-primary">
              <strong className="mr-1">From:</strong>
              <div className="min-w-[250px]">
                {isCustomFrom !== 'custom' ? (
                  <span> {smtpFrom}</span>
                ) : (
                  <FloatingLabelInput
                    {...register('from')}
                    id="customFromId"
                    label="Name<email@example.com>"
                    className="bg-white placeholder:text-gray-400"
                  />
                )}
                {errors.from && isCustomFrom === 'custom' && (
                  <span className="absolute bottom-0 block text-xs text-red-500">
                    {errors.from.message}
                  </span>
                )}
              </div>
            </span>
            <div className="ml-4">
              <Select
                defaultValue={formValues.smtp}
                onValueChange={(e) => {
                  e !== 'custom' &&
                    setValue('from', '', { shouldValidate: true });
                  setCustomIsFrom(e);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={formValues.smtp}>
                      Default from SMTP
                    </SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="my-5">
            <ReactDragListView {...dragProps}>
              <div
                className="min-h-[calc(100vh-405px)] w-full bg-[#e7e7e7]"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </ReactDragListView>
          </div>
          {placeholders.includes('{{#each body}}') && (
            <div
              onClick={() => onContent()}
              className="sticky bottom-0 cursor-pointer border-2 border-dashed border-gray-400 bg-gray-100 p-4 text-center text-xl text-gray-400 hover:border-gray-600"
            >
              Add Content +
            </div>
          )}
          <div className="mt-5 flex justify-end gap-2 bg-gray-100 p-5">
            <Button onClick={() => onTestMail()}>Test Mail</Button>
            <Button onClick={() => onCopyJson()}>Build JSON</Button>
          </div>
        </div>
      ) : (
        <div className="h-full bg-gray-100 p-10">
          <div className="h-full border bg-white p-8">
            <div className="flex h-full items-center justify-center border-2 border-dashed text-center">
              <span className="block text-lg leading-9 text-gray-400">
                {!formValues.smtp || !formValues.template ? (
                  <>
                    Please select
                    {[
                      !formValues.smtp && ' SMTP',
                      !formValues.template && ' Template',
                    ]
                      .filter(Boolean)
                      .join(', ')}
                    <br />
                    Your Email template will show here
                  </>
                ) : (
                  <>Press run and show your template</>
                )}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderTemplate;
