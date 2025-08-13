'use client'; // Ensure this file is used in a client component
import { CustomGraphQLError } from '@/apollo/types/common';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/ui/floatingLabelInput';
import { PasswordInput } from '@/components/ui/passwordInput';
import { LOGIN_MUTATION } from '@/modules/auth/gql';
import { LoginFormInputs, loginSchema } from '@/modules/auth/schemas';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

const ChangePasswordComponent = () => {
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onError: (error) => {
      const validationError = error?.graphQLErrors[0] as CustomGraphQLError;
      if (validationError?.field) {
        setError(validationError.field, { message: validationError.message });
      }
    },
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (formData) => {
    const origin = searchParams.get('origin');
    try {
      const response = await login({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
      if (response.data.login.success) {
        if (origin && origin.startsWith('http')) {
          window.location.href = decodeURIComponent(origin);
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h2 className="mb-6 text-4xl font-semibold">Login</h2>
      <p className="mb-6 text-base font-normal text-muted-foreground">
        Login to access your account
      </p>
      <form className="flex flex-col gap-y-6" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <PasswordInput
            id="password"
            label="password"
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
        <Button type="submit" disabled={loading} className="w-full max-w-sm">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>
        <div className="flex justify-center gap-x-1">
          <p className="text-sm font-normal">
            {"Can't remember your password?"}
          </p>
          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-destructive"
          >
            Forgot Password
          </Link>
        </div>
      </form>
    </>
  );
};

const LoginPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordComponent />
    </Suspense>
  );
};

export default LoginPage;
