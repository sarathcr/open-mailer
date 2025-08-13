import { Button } from '@/components/ui/button';
import { REMOVE_API_TOKEN_MUTATION } from '@/modules/api-token/gql/mutations';

import { APITokenFormPropsinput } from '@/modules/smtp/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const RemoveAPITokenForm: FC<APITokenFormPropsinput> = ({
  values,
  onClickSubmit,
}) => {
  const [removeAPItoken] = useMutation(REMOVE_API_TOKEN_MUTATION);
  const onConfirm = async () => {
    try {
      if (!values?.id) {
        console.error('ID is missing or undefined');
        return;
      }

      const { data, errors } = await removeAPItoken({
        variables: { id: values?.id },
      });

      if (errors) {
        console.error('Error deleting APIToken:', errors);
      } else {
        console.log('APIToken deleted successfully', data);
      }

      onClickSubmit?.();
    } catch (err) {
      console.error('Error deleting APIToken:', err);
    }
  };

  return (
    <>
      <p>Are you sure you want to delete this API Token?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};
export default RemoveAPITokenForm;
