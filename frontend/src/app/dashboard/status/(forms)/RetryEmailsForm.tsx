import { useMutation } from '@apollo/client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RETRY_FAILED_EMAIL_MUTATION } from '../_gql';
import { RetryEmail, retryEmailSchema } from './email.schema';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SmtpFormInputs } from '@/modules/smtp/schemas';

type RetryEmailsFormProps = {
  defaultValues: RetryEmail;
  smtpData: SmtpFormInputs[];
  onCompleted: () => void;
};

const RetryEmailsForm = ({
  defaultValues,
  smtpData,
  onCompleted,
}: RetryEmailsFormProps) => {
  const [retryEmails, { loading }] = useMutation(RETRY_FAILED_EMAIL_MUTATION);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(retryEmailSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (formData: RetryEmail) => {
    try {
      await retryEmails({
        variables: {
          id: formData.id,
          smtpConfigId: formData.smtpConfigId || '',
        },
      });
      onCompleted();
    } catch (err) {
      console.error('Error retrying email:', err);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full items-center gap-1.5">
        <Controller
          name="smtpConfigId"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value) =>
                field.onChange(value as 'default' | 'custom')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="SMTP Config ID" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {smtpData.map((item: any) => (
                    <SelectItem key={item.id} value={item?.id}>
                      {item.from}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.smtpConfigId && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.smtpConfigId.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Retrying Email...' : 'Retry Email'}
      </Button>
    </form>
  );
};

export default RetryEmailsForm;
