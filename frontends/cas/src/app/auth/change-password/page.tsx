'use client';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD_MUTATION } from '@/modules/password/gql';
import { changePasswordInputs } from '@/modules/password/schemas';
import ChangePasswordForm from '@/forms/CreateNewPasswordForm';
import { SubmitHandler } from 'react-hook-form';
import React, { Suspense, useState } from 'react';
import { NextPage } from 'next';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const PasswordSuccess = () => {
  const router = useRouter();
  return (
    <div>
      <span className="mb-2 block text-4xl font-semibold text-green">
        Password Changed
      </span>
      <p className="mb-2">Your password has been changed successfully</p>
      <Button onClick={() => router.push('/auth/login')}>Back to Login</Button>
    </div>
  );
};

const ChangePasswordPageComponent: NextPage = () => {
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [resetpassword] = useMutation(RESET_PASSWORD_MUTATION);
  const handlePasswordChange: SubmitHandler<changePasswordInputs> = async (
    data
  ) => {
    try {
      await resetpassword({
        variables: {
          password: data.password,
          token,
        },
      });
      setSuccess(true);
    } catch (err) {
      console.error(err);
    }
  };

  return !success ? (
    <ChangePasswordForm onSubmit={handlePasswordChange} />
  ) : (
    <PasswordSuccess />
  );
};

const ChangePasswordPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordPageComponent />
    </Suspense>
  );
};

export default ChangePasswordPage;
