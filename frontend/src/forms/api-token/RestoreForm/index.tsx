import { Button } from '@/components/ui/button';
import { RESTORE_API_TOKEN_MUTATION } from '@/modules/api-token/gql/mutations';
import { APITokenFormPropsinput } from '@/modules/smtp/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const RestoreForm: FC<APITokenFormPropsinput> = ({ values, onClickSubmit }) => {
  const [restoreAPItoken] = useMutation(RESTORE_API_TOKEN_MUTATION);
  const onConfirm = async () => {
    try {
      await restoreAPItoken({
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
      <p>Are you sure you want to Restore this APIToken?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};
export default RestoreForm;
