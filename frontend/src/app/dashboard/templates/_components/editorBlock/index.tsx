import { Button } from '@/components/ui/button';
import QuillEditor from '@/customComponents/RichTextEditor/quillEditor';
import { UpdateEmailTemplate } from '@/modules/template/gql/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { editorSchema } from './editor.schema';

export type EditorBlockState = {
  footerContent: string;
};
type FormValues = {
  footerContent: string;
};

type EditorBlockProps = {
  // eslint-disable-next-line no-unused-vars
  onSubmitFrom: (newState: EditorBlockState) => void;
  data: UpdateEmailTemplate;
  showEnableSwitch?: boolean;
};

export const EditorBlock: React.FC<EditorBlockProps> = ({
  onSubmitFrom,
  data,
}) => {
  const [editorKey, setEditorKey] = useState(0);
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(editorSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      footerContent: data.footerContent || '',
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    onSubmitFrom({
      footerContent: formData.footerContent,
    });
  };

  useEffect(() => {
    reset({
      footerContent: data.footerContent || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onReset = () => {
    reset({
      footerContent: '',
    });
    setEditorKey((prev) => prev + 1);
    onSubmitFrom({
      footerContent: '',
    });
  };

  return (
    <form
      key={editorKey} // for resetting the form
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => onReset()}
    >
      <Controller
        control={control}
        name="footerContent"
        render={({ field }) => (
          <QuillEditor value={field.value || ''} onChange={field.onChange} />
        )}
      />
      {errors.footerContent && (
        <p className="mt-1 text-xs text-destructive" aria-live="polite">
          {errors.footerContent.message}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant={'outline'} type="reset" className="mb-3">
          Reset <RotateCcw />
        </Button>
        <Button type="submit" className="mb-3">
          Add <Plus />
        </Button>
      </div>
    </form>
  );
};

export default EditorBlock;
