import { Button } from '@/components/ui/button';
import { SOFT_DELETE_USER_MUTATION } from '@/modules/user/gql';
import { SoftDeleteUser, UserFormProps } from '@/modules/user/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const DeleteForm: FC<UserFormProps> = ({ values, onClickSubmit }) => {
  const [softDeleteUser] = useMutation<SoftDeleteUser>(
    SOFT_DELETE_USER_MUTATION
  );
  const onConfirm = async () => {
    try {
      await softDeleteUser({
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
      <p>Are you sure you want to delete this user?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};

export default DeleteForm;
