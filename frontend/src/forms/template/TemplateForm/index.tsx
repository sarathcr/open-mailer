import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import { CREATE_TEMPLATE_MUTATION } from '@/modules/template/gql/mutation';
import { TemplateFormProps } from '@/modules/template/gql/types';
import {
  templateFormInputs,
  templateSchema,
} from '@/modules/template/template.schema';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const TemplateForm: FC<TemplateFormProps> = ({ values, onClickSubmit }) => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<templateFormInputs>({
    resolver: zodResolver(templateSchema),
    defaultValues: values,
  });

  const selectedTemplate = watch('templateType', 'default');
  const router = useRouter();

  const [createTemplate, { loading }] = useMutation(CREATE_TEMPLATE_MUTATION);

  const onSubmit: SubmitHandler<templateFormInputs> = async (data) => {
    try {
      const { name, filePath } = data;
      const response = await createTemplate({
        variables: {
          createEmailTemplateInput: {
            name,
            filePath,
          },
        },
      });

      const templateId = response.data.createEmailTemplate.id;

      router.push(`/dashboard/templates/${templateId}`);

      onClickSubmit?.();
    } catch (error) {
      alert('Failed to create template. Please try again.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center gap-y-6 p-6"
    >
      <h2 className="text-lg font-semibold text-indigo-900">
        Choose base template
      </h2>

      <div className="flex gap-10">
        <label className="text-center">
          <input
            type="radio"
            value="default"
            {...register('templateType', { required: true })}
            className="hidden"
            checked={selectedTemplate === 'default'}
          />
          <div
            className={`items-center space-y-2 rounded-3xl border-2 hover:border-indigo-900 ${
              selectedTemplate === 'default' && 'border-blue-500'
            }`}
          >
            <Image
              src="/images/template/default.png"
              alt="Default Template"
              className="h-28 w-28 rounded-3xl object-cover"
              width={200}
              height={200}
            />
          </div>
          <p className="font-medium">Default</p>
        </label>

        <label className="text-center">
          <input
            type="radio"
            value="custom"
            {...register('templateType', { required: true })}
            className="hidden"
            checked={selectedTemplate === 'custom'}
          />
          <div
            className={`items-center space-y-2 rounded-3xl border-2 hover:border-indigo-900 ${
              selectedTemplate === 'custom' && 'border-blue-500'
            }`}
          >
            <Image
              src="/images/template/custom.png"
              alt="Custom Template"
              className="h-28 w-28 rounded-3xl object-cover"
              width={200}
              height={200}
            />
          </div>
          <p className="font-medium">Custom</p>
        </label>
      </div>

      <div className="flex w-[300px] flex-col gap-2">
        <FloatingLabelInput
          id="name"
          label="Name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="w-full rounded-md border p-[10px] text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.name?.message && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      {selectedTemplate === 'custom' && (
        <div className="flex w-[300px] flex-col gap-2">
          <FloatingLabelInput
            id="filepath"
            label="Custom template URL"
            type="text"
            {...register('filePath', {
              required: 'File path is required for custom templates',
              pattern: {
                value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                message: 'File path must be a valid URL',
              },
            })}
            className="w-full rounded-md border p-[10px] text-gray-700 outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.filePath?.message && (
            <p className="text-xs text-red-500">{errors.filePath.message}</p>
          )}
        </div>
      )}

      <Button type="submit">
        {' '}
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Create Template'
        )}
      </Button>
    </form>
  );
};

export default TemplateForm;
