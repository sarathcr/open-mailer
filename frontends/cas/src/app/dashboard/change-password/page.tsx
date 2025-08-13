'use client';

import { useMutation } from '@apollo/client';
import { CHANGE_PASSWORD_MUTATION } from '@/modules/password/gql';
import { changePasswordInputs } from '@/modules/password/schemas';
import { SubmitHandler } from 'react-hook-form';
import ChangePasswordForm from '@/forms/CreateNewPasswordForm';
import React, { useState } from 'react';
import { NextPage } from 'next';

const ChangePassword: NextPage = () => {
  const [ChangePassword] = useMutation(CHANGE_PASSWORD_MUTATION);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handlePasswordChange: SubmitHandler<changePasswordInputs> = async (
    data
  ) => {
    try {
      await ChangePassword({
        variables: {
          password: data.password,
        },
      });
      setSuccessMessage('Password changed successfully');
    } catch (err) {
      console.error(err);
      setSuccessMessage('Failed to change password');
    }
  };

  return (
    <div>
      <ChangePasswordForm
        onSubmit={handlePasswordChange}
        message={successMessage}
      />
    </div>
  );
};

export default ChangePassword;
