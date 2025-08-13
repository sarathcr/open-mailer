'use client';

import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { Plus, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { logoBlockSchema } from './logoBlock.schema';

export type LogoBlockFormValues = {
  imageUrl: string;
  linkUrl: string;
  bg: string;
};

type LogoBlockProps = {
  // eslint-disable-next-line no-unused-vars
  onSubmitFrom: (newState: LogoBlockFormValues) => void; // Directly passing FormState
  data: LogoBlockFormValues; // api data, not form data
  showEnableSwitch?: boolean;
  blockName: string;
};

export const LogoBlock: React.FC<LogoBlockProps> = ({
  onSubmitFrom,
  data,
  showEnableSwitch = false,
  blockName,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LogoBlockFormValues>({
    resolver: zodResolver(logoBlockSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      imageUrl: data.imageUrl || '',
      linkUrl: data.linkUrl || '',
      bg: data.bg || '',
    },
  });
  useEffect(() => {
    reset({
      imageUrl: data.imageUrl || '',
      linkUrl: data.linkUrl || '',
      bg: data.bg || '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const [isEnable, setIsEnable] = useState(false);
  const onSubmit: SubmitHandler<LogoBlockFormValues> = async (formData) => {
    onSubmitFrom({
      imageUrl: formData.imageUrl,
      linkUrl: formData.linkUrl,
      bg: formData.bg,
    });
  };
  const onReset = () => {
    reset({
      imageUrl: '',
      linkUrl: '',
      bg: '',
    });
    onSubmitFrom({
      imageUrl: '',
      linkUrl: '',
      bg: '',
    });
  };

  function onClickEnableSwitch(checked: boolean) {
    if (!checked) {
      onSubmitFrom({
        imageUrl: '',
        linkUrl: '',
        bg: '',
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onReset={() => onReset()}>
      {showEnableSwitch && (
        <div className="flex items-center justify-between pt-2">
          <Label htmlFor="isEnable">Enable Block</Label>
          <Switch
            checked={isEnable}
            onCheckedChange={(checked) => {
              onClickEnableSwitch(checked);
              setIsEnable(checked);
            }}
          />
        </div>
      )}
      {(!showEnableSwitch || isEnable) && (
        <>
          <div className="grid w-full items-center gap-1.5 pt-4">
            <FloatingLabelInput
              id="imageUrl"
              label="Logo url"
              className="bg-white placeholder:text-gray-400 focus:border-primary"
              {...register('imageUrl', {
                required: 'Logo URL is required',
              })}
            />
            {errors.imageUrl && (
              <p className="mt-1 text-xs text-destructive" aria-live="polite">
                {errors.imageUrl.message}
              </p>
            )}
          </div>

          <div className="grid w-full items-center gap-1.5 pt-4">
            <FloatingLabelInput
              id="linkUrl"
              label="Logo Link"
              className="bg-white placeholder:text-gray-400 focus:border-primary"
              {...register('linkUrl', {
                required: 'Logo Link is required',
              })}
            />
            {errors.linkUrl && (
              <p className="mt-1 text-xs text-destructive" aria-live="polite">
                {errors.linkUrl.message}
              </p>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5 pt-4">
            <div className="flex items-center gap-2">
              <FloatingLabelInput
                id="bg"
                label="Background Color"
                className="bg-white placeholder:text-gray-400 focus:border-primary"
                {...register('bg', {
                  required: 'Background color is required',
                })}
                readOnly
                onClick={() =>
                  document.getElementById(`${blockName}Picker`)?.click()
                }
              />

              <input
                id={`${blockName}Picker`}
                type="color"
                value={watch('bg')}
                {...register('bg', {
                  required: 'Logo URL is required',
                })}
                className="h-8 w-8 rounded border"
              />
              {errors.bg && (
                <p className="mt-1 text-xs text-destructive" aria-live="polite">
                  {errors.bg.message}
                </p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant={'outline'} type="reset" className="mb-3">
              Reset <RotateCcw />
            </Button>
            <Button type="submit" className="mb-3">
              Add <Plus />
            </Button>
          </div>
        </>
      )}
    </form>
  );
};

export default LogoBlock;
