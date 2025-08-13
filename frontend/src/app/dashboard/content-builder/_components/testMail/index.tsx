/* eslint-disable react-hooks/exhaustive-deps */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InputTags } from '@/components/ui/inputWithTags';
import { SEND_MAIL_MUTATION } from '@/modules/content-builder/gql/mutations';
import { useMutation } from '@apollo/client';
import { PencilLine } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TestmailFormProps } from '../types';

const TestmailForm: React.FC<TestmailFormProps> = ({
  formValues,
  setValue,
  errors,
  data,
}) => {
  const [success, setSuccess] = useState(false);
  const [formvalueChanges, setFormvalueChanges] = useState(false);
  const [formccvalueChanges, setFormccvalueChanges] = useState(false);
  const [formbccvalueChanges, setFormbccvalueChanges] = useState(false);
  const [values, setValues] = useState<string[]>(formValues.recipient);
  const [ccValues, setCcValues] = useState<string[]>(formValues.cc || []);
  const [bccValues, setBccValues] = useState<string[]>(formValues.bcc || []);
  console.log({ errors });

  const onHandleCustomRecipient = () => {
    setFormvalueChanges(true);
  };
  const onHandleCustomCc = () => {
    setFormccvalueChanges(true);
  };
  const onHandleCustomBcc = () => {
    setFormbccvalueChanges(true);
  };
  useEffect(() => {
    if (formvalueChanges) {
      setValue('recipient', values, { shouldValidate: true });
      setFormvalueChanges(false);
    }
  }, [setValue, values]);
  useEffect(() => {
    if (formccvalueChanges) {
      setValue('cc', ccValues, { shouldValidate: true });
      setFormccvalueChanges(false);
    }
  }, [setValue, ccValues]);
  useEffect(() => {
    if (formbccvalueChanges) {
      setValue('bcc', bccValues, { shouldValidate: true });
      setFormbccvalueChanges(false);
    }
  }, [setValue, bccValues]);

  const [sendMail, { loading }] = useMutation(SEND_MAIL_MUTATION, {
    context: {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MAILER_TOKEN}`,
      },
    },
  });

  const onSendTestMail = async () => {
    try {
      const {
        smtp: smtpConfigId,
        template: emailTemplateId,
        sendSeparately,
      } = formValues;

      const input = {
        smtpConfigId,
        emailTemplateId,
        sendSeparately,
        cc: ccValues.length > 0 ? ccValues : undefined,
        bcc: bccValues.length > 0 ? bccValues : undefined,
        data: {
          subject: data.subject || 'Default Subject',
          heading: data.heading || 'Default Heading',
          body: data.body || [],
        },
        recipients: formValues.sendSeparately
          ? formValues.recipient
          : [...formValues.recipient],
      };
      const response = await sendMail({ variables: { input } });

      if (response.data.sendMail) {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  return (
    <>
      {!success ? (
        <div>
          <div>
            You are sending a test mail to:
            <br />
            <div className="mt-3 flex items-center">
              {values.map((value) => (
                <Badge className="mr-2" key={value}>
                  {value}
                </Badge>
              ))}
              {!formvalueChanges && (
                <PencilLine
                  size={16}
                  className="cursor-pointer text-primary"
                  onClick={() => {
                    console.log('clicked');
                    onHandleCustomRecipient();
                  }}
                />
              )}
            </div>
          </div>
          {formvalueChanges && (
            <div className="flex">
              <InputTags
                value={values}
                onChange={setValues}
                placeholder="Enter values, comma separated..."
                className="mt-2 w-full"
              />
            </div>
          )}
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
          <div className="mt-3">
            CC:
            <div className="mt-1 flex items-center">
              {ccValues.map((cc) => (
                <Badge className="mr-2" key={cc}>
                  {cc}
                </Badge>
              ))}
              {!formccvalueChanges && (
                <PencilLine
                  size={16}
                  className="cursor-pointer text-primary"
                  onClick={() => onHandleCustomCc()}
                />
              )}
            </div>
            {formccvalueChanges && (
              <div className="flex">
                <InputTags
                  value={ccValues}
                  onChange={setCcValues}
                  placeholder="Enter CC emails..."
                  className="mt-2 w-full"
                />
              </div>
            )}
          </div>

          {errors.cc && (
            <span className="block text-xs text-red-500">
              {Array.isArray(errors.cc) ? (
                <ul className="text-xs text-red-500">
                  {errors.cc.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              ) : (
                <span className="mt-[5px] block text-xs text-red-500">
                  {errors.cc.message}
                </span>
              )}
            </span>
          )}

          <div className="mt-3">
            BCC:
            <div className="mt-1 flex items-center">
              {bccValues.map((bcc) => (
                <Badge className="mr-2" key={bcc}>
                  {bcc}
                </Badge>
              ))}
              {!formbccvalueChanges && (
                <PencilLine
                  size={16}
                  className="cursor-pointer text-primary"
                  onClick={() => onHandleCustomBcc()}
                />
              )}
            </div>
            {formbccvalueChanges && (
              <div className="flex">
                <InputTags
                  value={bccValues}
                  onChange={setBccValues}
                  placeholder="Enter BCC emails..."
                  className="mt-2 w-full"
                />
              </div>
            )}
          </div>
          {errors.bcc && (
            <span className="block text-xs text-red-500">
              {Array.isArray(errors.bcc) ? (
                <ul className="text-xs text-red-500">
                  {errors.bcc.map((error, index) => (
                    <li key={index}>{error.message}</li>
                  ))}
                </ul>
              ) : (
                <span className="mt-[5px] block text-xs text-red-500">
                  {errors.bcc.message}
                </span>
              )}
            </span>
          )}

          <Button
            className="mt-5 w-full"
            disabled={
              loading ||
              !formValues.recipient.length ||
              Object.keys(errors).length > 0 ||
              success
            }
            onClick={() => {
              onSendTestMail();
            }}
          >
            Send
          </Button>
        </div>
      ) : (
        <span className="text-lg text-green-700">Email sent successfully!</span>
      )}
    </>
  );
};

export default TestmailForm;
