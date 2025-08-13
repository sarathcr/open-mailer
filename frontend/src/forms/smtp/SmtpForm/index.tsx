import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/passwordInput';
import { Switch } from '@/components/ui/switch';
import { CREATE_SMTP_MUTATION, UPDATE_SMTP_MUTATION } from '@/modules/smtp/gql';
import { SmtpFormProps } from '@/modules/smtp/gql/types';
import { SmtpFormInputs, smtpSchema } from '@/modules/smtp/schemas';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';

import { FC } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const SmtpForm: FC<SmtpFormProps> = ({ values, onClickSubmit }) => {
  const [createSmtp, { loading: addLoading, error: createError }] =
    useMutation(CREATE_SMTP_MUTATION);
  const [updateSmtp, { loading: editLoading, error: updateError }] =
    useMutation(UPDATE_SMTP_MUTATION);
  const isEdit = !!values.id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SmtpFormInputs>({
    resolver: zodResolver(smtpSchema),
    defaultValues: { ...values, port: values.port + '' },
  });

  const onSubmit: SubmitHandler<SmtpFormInputs> = async (data) => {
    const { id, port, ...rest } = data;
    const parsedPort = port ? parseInt(port) : null;
    if (isEdit) {
      await updateSmtp({
        variables: {
          id,
          updateSmtpConfigInput: { ...rest, port: parsedPort },
        },
      });
    } else {
      await createSmtp({
        variables: {
          createSmtpConfigInput: { ...rest, port: parsedPort },
        },
      });
    }
    onClickSubmit?.();
  };

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid w-full items-center gap-1.5">
          <FloatingLabelInput
            placeholder="Name<email@example.com>"
            id="from"
            label="FromName"
            {...register('from')}
            className={
              errors.from
                ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                : ''
            }
          />
          {errors.from && (
            <p className="mt-1 text-sm text-destructive" aria-live="polite">
              {errors.from.message}
            </p>
          )}
        </div>
        <div className="grid w-full items-center gap-1.5">
          <FloatingLabelInput
            id="username"
            label="username"
            {...register('username')}
            className={
              errors.username
                ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                : ''
            }
          />
          {errors.username && (
            <p className="mt-1 text-sm text-destructive" aria-live="polite">
              {errors.username.message}
            </p>
          )}
        </div>
        <div className="grid w-full items-center gap-1.5">
          <PasswordInput
            id="password"
            label="Password"
            {...register('password')}
            className={
              errors.password
                ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                : ''
            }
          />
          {(errors.password && (
            <p className="mt-1 text-sm text-destructive" aria-live="polite">
              {errors.password.message}
            </p>
          )) ||
            ((createError || updateError) && (
              <p className="mt-1 text-sm text-destructive" aria-live="polite">
                SMTP verification failed: Invalid username or password
              </p>
            ))}
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value={'1'}>
            <AccordionTrigger className="pb-0">
              Advanced settings
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-[10px]">
              <div className="mt-[5px] grid w-full items-center gap-1.5 pt-[5px]">
                <FloatingLabelInput
                  id="port"
                  label="Port"
                  type="number"
                  {...register('port')}
                  className={
                    errors.port
                      ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                      : ''
                  }
                />

                {errors.port && (
                  <p
                    className="mt-1 text-sm text-destructive"
                    aria-live="polite"
                  >
                    {errors.port.message}
                  </p>
                )}
              </div>

              <div className="grid w-full items-center gap-1.5">
                <FloatingLabelInput
                  id="host"
                  label="Host"
                  {...register('host')}
                  className={
                    errors.host
                      ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                      : ''
                  }
                />
                {errors.host && (
                  <p
                    className="mt-1 text-sm text-destructive"
                    aria-live="polite"
                  >
                    {errors.host.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    defaultValue={false}
                    name="secure"
                    render={({ field: { onChange, value } }) => (
                      <Switch onCheckedChange={onChange} checked={value} />
                    )}
                  />
                  <Label htmlFor="isSecure">Is Secure</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    control={control}
                    defaultValue={false}
                    name="isBackUp"
                    render={({ field: { onChange, value } }) => (
                      <Switch onCheckedChange={onChange} checked={value} />
                    )}
                  />
                  <Label htmlFor="isBackUp">Is BackUp</Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button
          type="submit"
          className="w-full"
          disabled={addLoading || editLoading}
        >
          submit
        </Button>
      </form>
    </>
  );
};
export default SmtpForm;
