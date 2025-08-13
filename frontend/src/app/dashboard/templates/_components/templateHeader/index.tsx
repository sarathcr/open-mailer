'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { UpdateEmailTemplate } from '@/modules/template/gql/types';
import {
  TemplateDropDownInputs,
  TemplateDropDownSchema,
} from '@/modules/template/template.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, SquarePen } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { nameFormInputs, nameSchema } from './name.schema';
interface TemplateHeaderProps {
  // eslint-disable-next-line no-unused-vars
  onSubmitFrom: (newState: UpdateEmailTemplate) => void;
  data: UpdateEmailTemplate;
}

export const TemplateHeader: React.FC<TemplateHeaderProps> = ({
  data,
  onSubmitFrom,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const {
    control,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<nameFormInputs>({
    resolver: zodResolver(nameSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: data?.name || '',
    },
  });

  const onBlurName = (value: string) => {
    if (isValid) {
      if (value.trim() !== data?.name) {
        onSubmitFrom({
          name: value.trim(),
        });
      }
    } else {
      toast({
        title: 'Error',
        description: errors?.name?.message || 'An error occurred',
        variant: 'default',
        duration: 5000,
      });
      reset({ name: data?.name || '' });
    }
    setIsEditing(false);
  };

  const onSubmit: SubmitHandler<nameFormInputs> = (formData) => {
    onBlurName(formData.name);
  };

  useEffect(() => {
    reset({
      name: data?.name || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="my-5 flex w-full flex-col items-center justify-between space-y-4 pr-4 md:flex-row md:space-x-4 md:space-y-0">
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={() => onBlurName(field.value)}
                  className="rounded border border-gray-100 bg-gray-100 px-2 py-1 text-2xl font-semibold tracking-tight"
                  autoFocus
                />
              )}
            />
          </form>
        ) : (
          <h3
            className="scroll-m-20 text-2xl font-semibold"
            onClick={handleEditToggle}
          >
            {watch('name')}
          </h3>
        )}
        <SquarePen className="cursor-pointer" onClick={handleEditToggle} />

        {errors.name && (
          <p className="mt-1 text-xs text-destructive" aria-live="polite">
            {errors.name.message}
          </p>
        )}
      </div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Settings className="relative cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="absolute end-0 w-56">
          <DropdownMenuLabel>Choose base template</DropdownMenuLabel>
          <DropdownMenuItem>
            <TemplateForm
              setDropdownOpen={setDropdownOpen}
              onSubmitFrom={onSubmitFrom}
              data={data}
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

interface TemplateFormProps {
  // eslint-disable-next-line no-unused-vars
  onSubmitFrom: (newState: UpdateEmailTemplate) => void;
  data: UpdateEmailTemplate;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TemplateForm: React.FC<TemplateFormProps> = ({
  data,
  onSubmitFrom,
  setDropdownOpen,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    control,
    getValues,
  } = useForm<TemplateDropDownInputs>({
    resolver: zodResolver(TemplateDropDownSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      selectedOption: data?.filePath ? 'custom' : 'default',
      filePath: data?.filePath || '',
    },
  });

  const onSubmit: SubmitHandler<TemplateDropDownInputs> = (formData) => {
    onSubmitFrom({
      filePath: formData.selectedOption === 'default' ? '' : formData.filePath,
    });
    setDropdownOpen(false);
  };

  const { selectedOption } = getValues();

  return (
    <form
      className="w-full"
      onSubmit={handleSubmit(onSubmit)}
      onClick={(e) => e.stopPropagation()}
    >
      <Controller
        name="selectedOption"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(value) =>
              field.onChange(value as 'default' | 'custom')
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />

      {selectedOption === 'custom' && (
        <div className="mt-4">
          <FloatingLabelInput
            id="filePath"
            label="File Path"
            {...register('filePath')}
          />
          {errors.filePath && (
            <p className="mt-1 text-xs text-destructive" aria-live="polite">
              {errors.filePath.message}
            </p>
          )}
        </div>
      )}

      <Button
        type="submit"
        className="mt-4 w-full"
        disabled={!isDirty || !isValid}
      >
        Save Changes s
      </Button>
    </form>
  );
};
