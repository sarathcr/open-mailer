import { Button } from '@/components/ui/button';
import { REMOVE_SMTP_MUTATION } from '@/modules/smtp/gql';
import { SmtpFormProps } from '@/modules/smtp/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const RemoveSmtpForm: FC<SmtpFormProps> = ({ values, onClickSubmit }) => {
  const [removeSmtp] = useMutation(REMOVE_SMTP_MUTATION);
  const onConfirm = async () => {
    try {
      if (!values.id) {
        console.error('ID is missing or undefined');
        return;
      }

      console.log({ values });

      const { data, errors } = await removeSmtp({
        variables: { id: values.id },
      });

      if (errors) {
        console.error('Error deleting SMTP:', errors);
      } else {
        console.log('SMTP deleted successfully', data);
      }

      onClickSubmit?.();
    } catch (err) {
      console.error('Error deleting SMTP:', err);
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
export default RemoveSmtpForm;
