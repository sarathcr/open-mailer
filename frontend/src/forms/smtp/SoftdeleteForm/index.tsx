import { Button } from '@/components/ui/button';
import { SOFT_DELETE_SMTP_MUTATION } from '@/modules/smtp/gql';
import { SmtpFormProps } from '@/modules/smtp/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const DeleteSmtpForm: FC<SmtpFormProps> = ({ values, onClickSubmit }) => {
  const [softdeleteSmtp] = useMutation(SOFT_DELETE_SMTP_MUTATION);
  const onConfirm = async () => {
    try {
      const response = await softdeleteSmtp({
        variables: {
          id: values.id, // Ensure `values.id` is defined and valid
        },
      });
      console.log('Response:', response);
      onClickSubmit?.();
    } catch (err) {
      console.error('Error:', err);
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
export default DeleteSmtpForm;
