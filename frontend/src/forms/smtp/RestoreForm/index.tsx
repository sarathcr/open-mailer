import { Button } from '@/components/ui/button';
import { RESTORE_SMTP_MUTATION } from '@/modules/smtp/gql';
import { SmtpFormProps } from '@/modules/smtp/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const RestoreForm: FC<SmtpFormProps> = ({ values, onClickSubmit }) => {
  const [restoreSmtp] = useMutation(RESTORE_SMTP_MUTATION);
  const onConfirm = async () => {
    try {
      await restoreSmtp({
        variables: {
          id: values.id,
        },
      });
      onClickSubmit?.();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <p>Are you sure you want to delete this smtp?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};
export default RestoreForm;
