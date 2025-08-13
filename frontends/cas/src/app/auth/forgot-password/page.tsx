'use client';
import { Button } from '@/components/ui/button';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import {
  ForgotPasswordFormInputs,
  forgotPasswordSchema,
} from '@/modules/password/_schemas';
import { FORGOT_PASSWORD_MUTATION } from '@/modules/password/gql';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ResetPasswordEmailSent = () => {
  const router = useRouter();
  return (
    <div>
      <span className="mb-2 block text-4xl font-semibold text-blue-600">
        Check Your Email
      </span>
      <p className="mb-2">
        A password reset link has been sent to your email. Please check your
        inbox and follow the instructions to reset your password.
      </p>
      <p className="text-sm text-gray-500">
        If you don’t see the email, check your spam folder or request a new one.
      </p>
      <Button className="mt-4" onClick={() => router.push('/auth/login')}>
        Back to Login
      </Button>
    </div>
  );
};

const ForgetPasswordPage: NextPage = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormInputs>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const [generateToken, { loading }] = useMutation(FORGOT_PASSWORD_MUTATION);

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    try {
      const result = await generateToken({
        variables: {
          email: data.email,
        },
      });

      if (result?.data?.generatePasswordResetToken?.success) {
        setShowSuccess(true);
      }
    } catch (err) {
      console.error('Error sending reset email', err);
    }
  };

  return (
    <>
      {showSuccess ? (
        <ResetPasswordEmailSent />
      ) : (
        <>
          <div className="flex flex-col">
            <div className="mb-6 flex items-center">
              <Link href="/auth/login" className="flex items-center">
                <ChevronLeft href="/auth/login" className="-ml-1.5 h-6 w-6" />
                <span className="text-sm font-medium">Back to login</span>
              </Link>
            </div>
            <h2 className="mb-6 text-4xl font-semibold">
              Forgot your password?
            </h2>
            <p className="mb-6 text-base font-normal text-muted-foreground">
              Don’t worry, happens to all of us. Enter your email below to
              recover your password.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-y-6"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FloatingLabelInput
                type="email"
                id="email"
                label="email"
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
            <Button
              type="submit"
              className="w-full max-w-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </>
      )}
    </>
  );
};

export default ForgetPasswordPage;
