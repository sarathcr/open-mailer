import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';

import { Switch } from '@/components/ui/switch';
import {
  CREATE_USER_MUTATION,
  generateUserQuery,
  UPDATE_USER_MUTATION,
} from '@/modules/user/gql';
import { GetUser, UserFormProps } from '@/modules/user/gql/types';
import { UserFormInputs, userSchema } from '@/modules/user/schemas';
import { useMutation, useQuery } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

const UserForm: FC<UserFormProps> = ({ values, onClickSubmit }) => {
  const [createUser, { loading: addLoading }] =
    useMutation(CREATE_USER_MUTATION);
  const [updateUser, { loading: editLoading }] =
    useMutation(UPDATE_USER_MUTATION);

  const fields = [
    'id',
    'firstName',
    'lastName',
    'email',
    'employeeId',
    'isActive',
    'isAdmin',
  ];

  const GET_USER_QUERY = generateUserQuery(fields);

  const { data } = useQuery<GetUser>(GET_USER_QUERY, {
    variables: { id: values.id },
    skip: !values.id,
  });

  const isEdit = !!values.id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<UserFormInputs>({
    resolver: zodResolver(userSchema),
    defaultValues: values,
  });

  // Effect to update form values when data is fetched
  useEffect(() => {
    if (isEdit && data?.user) {
      // Reset the form with the user data when it's fetched
      reset(data.user);
    }
  }, [data, isEdit, reset]);

  const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
    try {
      if (isEdit) {
        await updateUser({
          variables: {
            updateUserInput: data,
          },
        });
      } else {
        await createUser({
          variables: {
            createUserInput: data,
          },
        });
      }
      onClickSubmit?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          id="firstName"
          label="First Name"
          {...register('firstName')}
          className={
            errors.firstName
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          id="lastName"
          label="Last Name"
          {...register('lastName')}
          className={
            errors.lastName
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          type="email"
          id="email"
          label="Email"
          {...register('email')}
          className={
            errors.email
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.email && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid w-full items-center gap-1.5">
        <FloatingLabelInput
          id="employeeId"
          label="Employee ID"
          {...register('employeeId')}
          className={
            errors.employeeId
              ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
              : ''
          }
        />
        {errors.employeeId && (
          <p className="mt-1 text-sm text-destructive" aria-live="polite">
            {errors.employeeId.message}
          </p>
        )}
      </div>
      <div className="flex justify-start gap-[35px]">
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="isAdmin"
            render={({ field: { onChange, value } }) => (
              <Switch onCheckedChange={onChange} checked={value} />
            )}
          />
          <Label htmlFor="isAdmin">Is Admin</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            control={control}
            name="isActive"
            render={({ field: { onChange, value } }) => (
              <Switch onCheckedChange={onChange} checked={value} />
            )}
          />
          <Label htmlFor="isActive">Is Active</Label>
        </div>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={addLoading || editLoading || !isDirty || !isValid}
      >
        submit
      </Button>
    </form>
  );
};

export default UserForm;
