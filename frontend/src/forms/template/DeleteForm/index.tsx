import { Button } from '@/components/ui/button';
import { SOFT_DELETE_TEMPLATE_MUTATION } from '@/modules/template/gql/mutation';
import {
  SoftDeleteTemplate,
  TemplateFormProps,
} from '@/modules/template/gql/types';
import { useMutation } from '@apollo/client';
import { FC } from 'react';

const DeleteForm: FC<TemplateFormProps> = ({ values, onClickSubmit }) => {
  const [softDeleteTemplate] = useMutation<SoftDeleteTemplate>(
    SOFT_DELETE_TEMPLATE_MUTATION
  );
  const onConfirm = async () => {
    try {
      await softDeleteTemplate({
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
      <p>Are you sure you want to delete this template?</p>
      <div className="flex">
        <Button className="ms-auto" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </>
  );
};

export default DeleteForm;
