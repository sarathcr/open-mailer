'use client'; // Ensure this file is used in a client component

import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CREATE_API_TOKEN_MUTATION,
  UPDATE_API_TOKEN_MUTATION,
} from '@/modules/api-token/gql/mutations';

import {
  APITokenFormInputs,
  apitokenSchema,
} from '@/modules/api-token/schemas/api-tokenSchemas';
import { APITokenFormProps } from '@/modules/smtp/gql/types';
import { useToken } from '@/providers/TokenContext';
import { useMutation } from '@apollo/client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

import { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const APITokenForm: FC<APITokenFormProps> = ({ values, onClickSubmit }) => {
  const router = useRouter();
  const { setToken } = useToken();

  const [createAPItoken, { loading: addLoading }] = useMutation(
    CREATE_API_TOKEN_MUTATION
  );
  const [updateAPItoken, { loading: editLoading }] = useMutation(
    UPDATE_API_TOKEN_MUTATION
  );
  const { name, status, duration } = values?.apiToken ?? {};
  const defaultValues = { name, status, duration };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<APITokenFormInputs>({
    resolver: zodResolver(apitokenSchema),
    defaultValues,
  });

  useEffect(() => {
    if (values?.apiToken) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, reset]);

  const statusOptions = [
    { id: 1, value: 'ACTIVE' },
    { id: 2, value: 'REVOKED' },
    { id: 3, value: 'DISABLED' },
  ];

  const { id } = useParams() as { id: string };

  const isEdit = !!id;

  const onSubmit: SubmitHandler<APITokenFormInputs> = async (data) => {
    const { name, duration, status, ...rest } = data;

    try {
      if (isEdit) {
        const res = await updateAPItoken({
          variables: {
            updateApiTokenInput: {
              id,
              name,
              duration: Number(duration),
              status,
            },
          },
        });
        const token = res.data.updateApiToken.token;
        setToken(token);
        onClickSubmit?.();
      } else {
        const response = await createAPItoken({
          variables: {
            createApiTokenInput: {
              name,
              duration: Number(duration),
              ...rest,
            },
          },
        });
        const tokenId = response.data.createApiToken.id;
        const token = response.data.createApiToken.token;

        if (tokenId) {
          setToken(token);
          router.push(`/dashboard/api-token/${tokenId}`);
          onClickSubmit?.();
        }
      }
    } catch (error) {
      console.error('Error submitting API Token form:', error);
    }
  };

  const durationOptions = [
    { id: 1, value: 7, label: '7 Days' },
    { id: 2, value: 30, label: '30 Days' },
    { id: 3, value: 90, label: '90 Days' },
    { id: 4, value: 0, label: 'Unlimited' },
  ];

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <FloatingLabelInput
            placeholder="Name"
            id="name"
            label="Name"
            {...register('name')}
            className={
              errors.name
                ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                : ''
            }
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive" aria-live="polite">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Controller
            name="duration"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ?? undefined}
                onValueChange={(value) => field.onChange(value as String)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {durationOptions?.map((item) => (
                      <SelectItem key={item.id} value={item.value.toString()}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.duration && (
            <p className="mt-1 text-sm text-destructive" aria-live="polite">
              {errors.duration.message}
            </p>
          )}
        </div>

        {isEdit && (
          <div className="flex flex-col gap-1.5">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={(value) => field.onChange(value as String)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {statusOptions?.map((item) => (
                        <SelectItem key={item.id} value={item.value}>
                          {item.value}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && (
              <p className="mt-1 text-sm text-destructive" aria-live="polite">
                {errors.status.message}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={addLoading || editLoading}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};
export default APITokenForm;
