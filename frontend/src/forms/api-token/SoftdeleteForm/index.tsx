import { Button } from '@/components/ui/button';
import { SOFT_DELETE_API_TOKEN_MUTATION } from '@/modules/api-token/gql/mutations';
import { APITokenFormPropsinput } from '@/modules/smtp/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const DeleteAPITokenForm: FC<APITokenFormPropsinput> = ({
  values,
  onClickSubmit,
}) => {
  const [softDeleteApiToken] = useMutation(SOFT_DELETE_API_TOKEN_MUTATION);
  const onConfirm = async () => {
    try {
      const response = await softDeleteApiToken({
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
      <p>Are you sure you want to delete this API Token?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};
export default DeleteAPITokenForm;
