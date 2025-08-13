'use client';
import { Profile } from '@/customComponents/Profile';
import { useProfile } from '@/hooks/useProfile';

import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

const ProfilePage: NextPage = () => {
  const {
    profileData: { firstName, lastName, email, employeeId },
    loading,
  } = useProfile();
  const router = useRouter();
  const dropdownItems = [
    {
      label: 'Change password',
      action: () => {
        router.push('/dashboard/change-password');
      },
    },
  ];
  return (
    <div className="mx-auto max-w-[472px] p-4 md:p-6 2xl:p-10">
      <Profile
        email={email}
        name={`${firstName} ${lastName}`}
        emp_id={employeeId}
        loading={loading}
        dropdownItems={dropdownItems}
      />
    </div>
  );
};

export default ProfilePage;
