import { Button } from '@/components/ui/button';
import { REMOVE_TEMPLATE_MUTATION } from '@/modules/template/gql/mutation';
import {
  RemoveEmailTemplate,
  TemplateFormProps,
} from '@/modules/template/gql/types';

import { useMutation } from '@apollo/client';
import { FC } from 'react';

const RemoveForm: FC<TemplateFormProps> = ({ values, onClickSubmit }) => {
  const [removeEmailTemplate] = useMutation<RemoveEmailTemplate>(
    REMOVE_TEMPLATE_MUTATION
  );
  const onConfirm = async () => {
    try {
      await removeEmailTemplate({
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

export default RemoveForm;
