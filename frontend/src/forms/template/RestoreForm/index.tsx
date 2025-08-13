import { Button } from '@/components/ui/button';
import { RESTORE_TEMPLATE_MUTATION } from '@/modules/template/gql/mutation';
import {
  RestoreTemplate,
  TemplateFormProps,
} from '@/modules/template/gql/types';

import { useMutation } from '@apollo/client';
import { FC } from 'react';

const RestoreForm: FC<TemplateFormProps> = ({ values, onClickSubmit }) => {
  const [restoreTemplate] = useMutation<RestoreTemplate>(
    RESTORE_TEMPLATE_MUTATION
  );
  const onConfirm = async () => {
    try {
      await restoreTemplate({
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

export default RestoreForm;
