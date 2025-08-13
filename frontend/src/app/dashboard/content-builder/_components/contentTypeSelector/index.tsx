// 'use client';

import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import QuillEditor from '@/customComponents/RichTextEditor/quillEditor';
import useDialog from '@/hooks/useDialog';
import {
  BodyData,
  ButtonformProps,
  ButtonGroupformProps,
  SelectContentTypeProps,
  TextFormProps,
} from '@/modules/smtp/gql/types';
import {
  buttonContentInputs,
  buttonContentSchema,
  buttonGroupContentInputs,
  buttonGroupContentSchema,
} from '@/modules/smtp/schemas/flexibleContent.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { MinusCircle, PlusCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

export const SelectContentType: React.FC<SelectContentTypeProps> = ({
  setContentState,
  currentIndex,
  item,
}) => {
  const { openDialog, clearDialog } = useDialog();

  if (item?.type === 'text') {
    openDialog({
      title: 'Edit Text Content',
      content: (
        <TextForm
          value={{ textContent: item.text || '' }}
          onSubmitText={(data) =>
            handleUpdateContent('text', { type: 'text', text: data })
          }
        />
      ),
    });
  } else if (item?.type === 'button') {
    openDialog({
      title: 'Edit Button Content',
      content: (
        <ButtonForm
          onSubmitButton={(data) =>
            handleUpdateContent('button', {
              type: 'button',
              buttonText: data.buttonText,
              buttonLink: data.buttonLink,
              align: data.buttonAlign,
            })
          }
          defaultValues={{
            buttonText: item.buttonText || '',
            buttonLink: item.buttonLink || '',
            buttonAlign: item.align as 'left' | 'center' | 'right',
          }}
        />
      ),
    });
  } else if (item?.type === 'buttons') {
    openDialog({
      title: 'Edit Button Group Content',
      content: (
        <ButtonGroup
          editData={item}
          onSubmitButtonGroup={(data) =>
            handleUpdateContent('buttons', { type: 'buttons', ...data })
          }
        />
      ),
    });
  }

  const handleUpdateContent = (
    type: 'text' | 'button' | 'buttons',
    data: BodyData
  ) => {
    setContentState((prev) => {
      const updatedContent = [...prev];

      if (type === 'text' && 'text' in data) {
        updatedContent[currentIndex] = { type: 'text', text: data.text };
      } else if (type === 'button' && 'buttonText' in data) {
        updatedContent[currentIndex] = {
          type: 'button',
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          align: data.align,
        };
      } else if (type === 'buttons' && 'buttons' in data) {
        updatedContent[currentIndex] = {
          type: 'buttons',
          buttons: data.buttons,
          align: data.align,
        };
      }

      return updatedContent;
    });
    clearDialog();
  };

  //submission of Flexible content
  const onSubmitText = (textContent: string) => {
    setContentState((prev) => [...prev, { type: 'text', text: textContent }]);
    clearDialog();
  };

  //submission of Buttton

  const onSubmitButton = (data: buttonContentInputs) => {
    setContentState((prev) => [
      ...prev,
      {
        type: 'button',
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        align: data.buttonAlign,
      },
    ]);
    clearDialog();
  };

  //   //submission of ButttongGroup

  const onSubmitButtonGroup = (data: buttonGroupContentInputs) => {
    setContentState((prev: any) => {
      return [
        ...prev,
        {
          type: 'buttons',
          buttons: data.buttons,
        },
      ];
    });

    clearDialog();
  };

  // Dialog handlers
  const addFlexibleContent = () => {
    openDialog({
      title: 'Add Text Content',
      content: (
        <TextForm
          value={{ textContent: '' }}
          onSubmitText={(data) => onSubmitText(data)}
        />
      ),
    });
  };

  const addButton = () => {
    const defaultValues = {
      buttonText: '',
      buttonLink: '',
      buttonAlign: 'center' as 'left' | 'center' | 'right',
    };

    openDialog({
      title: 'Add Button Content',
      content: (
        <ButtonForm
          onSubmitButton={(data) => onSubmitButton(data)}
          defaultValues={defaultValues}
        />
      ),
    });
  };

  const addButtonGroup = () => {
    openDialog({
      title: 'Add Button Group Content',
      content: (
        <ButtonGroup
          onSubmitButtonGroup={(data: buttonGroupContentInputs) =>
            onSubmitButtonGroup(data)
          }
        />
      ),
    });
  };

  return (
    <div className="flex gap-2">
      <Button className="flex-1" onClick={addFlexibleContent}>
        FlexibleContent
      </Button>
      <Button className="py-2e flex-1" onClick={addButton}>
        Button
      </Button>
      <Button className="py-2e flex-1" onClick={addButtonGroup}>
        Button Group
      </Button>
    </div>
  );
};

const TextForm: React.FC<
  TextFormProps & { value: { textContent: string } }
> = ({ onSubmitText, value }) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid, isDirty },
  } = useForm({
    mode: 'all',
    defaultValues: value,
  });
  const [editorError, setEditorError] = useState<string | null>(null);

  // Reset form values whenever `value` changes
  useEffect(() => {
    reset(value);
  }, [value, reset]);

  return (
    <form
      onSubmit={handleSubmit((data) => {
        if (!editorError) {
          onSubmitText(data.textContent);
        }
      })}
    >
      <Controller
        name="textContent"
        control={control}
        render={({ field }) => (
          <QuillEditor
            {...field}
            value={field.value ?? ''}
            onChange={(value) => field.onChange(value)}
            onError={setEditorError}
          />
        )}
      />
      {editorError && (
        <p className="mt-1 text-sm text-destructive" aria-live="polite">
          {editorError}
        </p>
      )}
      <Button
        type="submit"
        className="mt-2 w-full"
        disabled={!isValid || !isDirty}
      >
        Save
      </Button>
    </form>
  );
};

//ButtonForm Component
const ButtonForm: React.FC<ButtonformProps> = ({
  onSubmitButton,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<buttonContentInputs>({
    mode: 'all',
    defaultValues,
    resolver: zodResolver(buttonContentSchema),
  });

  return (
    <form onSubmit={handleSubmit((data) => onSubmitButton(data))}>
      <div className="w-full p-2">
        <FloatingLabelInput
          id="buttonText"
          label="Button Text"
          {...register('buttonText')}
        />
        {errors.buttonText && (
          <span className="mt-[5px] block text-xs text-red-500">
            {errors.buttonText.message}
          </span>
        )}
      </div>

      <div className="w-full items-center p-2">
        <FloatingLabelInput
          id="buttonLink"
          label="Button Link"
          {...register('buttonLink')}
        />
        {errors.buttonLink && (
          <span className="mt-[5px] block text-xs text-red-500">
            {errors.buttonLink.message}
          </span>
        )}
      </div>

      <div className="w-full items-center p-2">
        <FloatingLabelInput
          id="buttonAlign"
          label="Button Align"
          {...register('buttonAlign')}
        />
        {errors.buttonAlign && (
          <span className="mt-[5px] block text-xs text-red-500">
            {errors.buttonAlign.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        className="mt-2 w-full"
        disabled={!isDirty || !isValid}
      >
        Save
      </Button>
    </form>
  );
};

const ButtonGroup: React.FC<ButtonGroupformProps> = ({
  onSubmitButtonGroup,
  editData,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<buttonGroupContentInputs>({
    mode: 'all',
    resolver: zodResolver(buttonGroupContentSchema),
    defaultValues: {
      buttons: [{ text: '', link: '' }],
      align: 'center',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'buttons',
  });

  useEffect(() => {
    reset({
      buttons: editData?.buttons,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);
  const onSubmit = (data: buttonGroupContentInputs) => {
    onSubmitButtonGroup(data);
  };

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data))}
      className="h-[400px] overflow-y-auto overflow-x-hidden rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
    >
      <div
        className="flex cursor-pointer justify-end pb-2"
        onClick={() =>
          append({
            text: '',
            link: '',
          })
        }
      >
        <PlusCircle
          size={16}
          aria-label="Add new button group"
          className="text-blue-500 hover:text-blue-600"
        >
          {''}
        </PlusCircle>
        <span className="ml-2 cursor-pointer text-xs font-medium text-blue-500 hover:text-blue-600">
          Add Group
        </span>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="mb-5">
          <span className="text-xs font-bold text-gray-7">{`Button Group ${index + 1}`}</span>
          <div
            key={field.id}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-gray-100 p-3 shadow-sm"
          >
            <div className="w-full items-center">
              <FloatingLabelInput
                id={`text-${index}`}
                label="Button Group Text"
                {...register(`buttons.${index}.text`)}
              />
              {errors?.buttons?.[index]?.text && (
                <span className="mt-[5px] block text-xs text-red-500">
                  {' '}
                  {errors?.buttons?.[index]?.text?.message}
                </span>
              )}
            </div>

            <div className="w-full pt-4">
              <FloatingLabelInput
                id={`link-${index}`}
                label="Button Group Link"
                {...register(`buttons.${index}.link`)}
                className="rounded-md border-gray-300"
              />
              {errors?.buttons?.[index]?.link && (
                <span className="mt-[5px] block text-xs text-red-500">
                  {' '}
                  {errors?.buttons?.[index]?.link?.message}
                </span>
              )}
            </div>

            {index !== 0 && (
              <div
                className="mt-2 flex justify-end"
                onClick={() => remove(index)}
              >
                <MinusCircle
                  size={16}
                  aria-label="Add new button group"
                  className="text-blue-500 hover:text-blue-600"
                >
                  {''}
                </MinusCircle>
                <span className="ml-2 cursor-pointer text-xs font-medium text-blue-500 hover:text-blue-600">
                  Remove Group
                </span>
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mt-5 w-full">
        <FloatingLabelInput
          id="buttonGroupAlign"
          label="Button Group Align"
          {...register('align')}
          className="rounded-md border-gray-300"
        />
        {errors.align && (
          <span className="mt-[5px] block text-xs text-red-500">
            {errors.align.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isDirty || !isValid}
        className="mt-5 w-full rounded-lg bg-blue-500 py-2 text-white shadow-md hover:bg-blue-600"
      >
        Save All
      </Button>
    </form>
  );
};
