'use client';
import { useQuery } from '@apollo/client';
import { DropdownItem } from '@/customComponents/types';
import { NextPage } from 'next';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GetUser, User } from '@/modules/user/gql/types';
import { GET_USER_QUERY } from '@/modules/user/gql';
import { History } from '@/customComponents/History';
import { Profile } from '@/customComponents/Profile';

const UserPageComponent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const { data: userdata } = useQuery<GetUser>(GET_USER_QUERY, {
    variables: { id },
  });
  const dropdownItems: DropdownItem[] = [
    {
      label: 'Edit',
      action: () => {
        console.log('edit');
      },
    },
    {
      label: 'Delete',
      action: () => {
        console.log('delete');
      },
    },
  ];
  const user = userdata?.user ?? ({} as User);

  const { firstName, lastName, email, employeeId, histories } = user;

  return (
    <>
      <div className="mx-auto max-w-[472px]">
        <Profile
          name={`${firstName} ${lastName}`}
          email={email}
          emp_id={employeeId}
          dropdownItems={dropdownItems}
        />
      </div>
      <div className="mx-auto max-w-[472px]">
        <History histories={histories} />
      </div>
    </>
  );
};

const UserPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserPageComponent />
    </Suspense>
  );
};

export default UserPage;
