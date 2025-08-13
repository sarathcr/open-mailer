import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PasswordInput } from '@/components/ui/passwordInput';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  changePasswordInputs,
  changePasswordSchema,
} from '@/modules/password/schemas';
import React from 'react';

interface ChangePasswordFormProps {
  onSubmit: SubmitHandler<changePasswordInputs>;
  message?: string;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  message,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<changePasswordInputs>({
    resolver: zodResolver(changePasswordSchema),
  });

  return (
    <>
      <div className="mx-auto w-full max-w-sm">
        <h2 className="mb-6 text-4xl font-semibold">Create New Password</h2>
        <p className="mb-6 max-w-sm text-base font-normal text-muted-foreground">
          The password must be at least 8 characters long and include at least
          one uppercase letter, one lowercase letter, a number, and a special
          character.
        </p>
        <form
          className="flex flex-col gap-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <PasswordInput
              id="password"
              label="New Password"
              {...register('password')}
              className={
                errors.password
                  ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                  : ''
              }
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive" aria-live="polite">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <PasswordInput
              id="confirmPassword"
              label="Confirm Password"
              {...register('confirmPassword')}
              className={
                errors.confirmPassword
                  ? 'border-destructive focus:border-destructive focus-visible:border-destructive'
                  : ''
              }
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-destructive" aria-live="polite">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full max-w-sm">
            Submit
          </Button>
          {message && (
            <p className="text-right text-xs">
              <i>{message}</i>
            </p>
          )}
        </form>
      </div>
    </>
  );
};

export default ChangePasswordForm;
