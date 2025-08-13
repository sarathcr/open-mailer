'use client';
import { Button } from '@/components/ui/button';
import { User } from '@/modules/user/gql/types';
import { buildUserQuery } from '@/modules/user/gql';
import { Column, Filter } from '@/customComponents/types';
import { NextPage } from 'next';
import { Edit, Eye, Settings, Trash } from 'lucide-react';
import { useQuery } from '@/modules/common/hooks';
import React, { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import useDialog from '@/hooks/useDialog';
import { UserFormInputs } from '@/modules/user/schemas';
import UserForm from '@/forms/Users/UserForm';
import DeleteForm from '@/forms/Users/DeleteForm';
import { SearchComponent } from '@/customComponents/SearchComponent';
import { TableSettings } from '@/customComponents/TablesSettings';
import { Table } from '@/customComponents/Table';

const defaultColumns: Column<User>[] = [
  {
    header: 'Name',
    format: (row: User) => `${row.firstName} ${row.lastName}`,
  },
  { header: 'Email', accessor: 'email' },
  { header: 'Employee ID', accessor: 'employeeId' },
];

const optionalColumns: Column<User>[] = [
  {
    header: 'Active',
    accessor: 'isActive',
    format: (value: boolean) => (value ? 'Yes' : 'No'),
  },
  {
    header: 'Created At',
    accessor: 'createdAt',
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    header: 'Updated At',
    accessor: 'updatedAt',
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    header: 'Deleted At',
    accessor: 'deletedAt',
    format: (value) => (value ? new Date(value).toLocaleDateString() : 'NA'),
  },
  {
    header: 'Admin',
    accessor: 'isAdmin',
    format: (value: Boolean) => (value ? 'Admin' : 'User'),
  },
];

const fieldOptions = [
  { label: 'Active', value: 'isActive' },
  { label: 'Admin', value: 'isAdmin' },
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Deleted At', value: 'deletedAt' },
];

const filterOptions: Filter[] = [
  {
    key: 'isAdmin',
    label: 'Admin',
    value: false,
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
  },
  {
    key: 'isActive',
    label: 'Active',
    value: true,
    options: [
      { label: 'Active', value: true },
      { label: 'Inactive', value: false },
    ],
  },
  {
    key: 'hasDeleted',
    label: 'Deleted',
    value: false,
    options: [
      { label: 'Deleted', value: true },
      { label: 'Not Deleted', value: false },
    ],
  },
];

const UserPageComponent = () => {
  const router = useRouter();

  const [openSettings, setOpenSettings] = useState(false);
  const {
    data,
    selectedFields,
    applyedSelectedFields,
    applyedFilters,
    setSelectedFields,
    setFilters,
    filters,
    pagination,
    setPage,
    setLimit,
    refetch,
    search,
    setSearch,
    onClickApply,
  } = useQuery(buildUserQuery);
  const { openDialog, clearDialog } = useDialog();
  const initialvalues = {
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    isAdmin: false,
    isActive: true,
  };

  const handleViewUser = (user: User) => {
    router.push(`/dashboard/user?id=${user.id}`);
  };

  const onClickSubmit = () => {
    clearDialog();
    refetch();
  };

  const onClickAddUser = () => {
    openDialog({
      title: 'Add User',
      content: (
        <UserForm values={initialvalues} onClickSubmit={onClickSubmit} />
      ),
    });
  };

  const onClickEdit = (user: UserFormInputs) => {
    openDialog({
      title: 'Edit User',
      content: <UserForm values={user} onClickSubmit={onClickSubmit} />,
    });
  };

  const onClickDelete = (user: UserFormInputs) => {
    openDialog({
      title: 'Delete User',
      content: <DeleteForm values={user} onClickSubmit={onClickSubmit} />,
    });
  };

  const toggleSettings = () => {
    setOpenSettings(!openSettings);
  };

  const columns = [
    ...defaultColumns,
    ...optionalColumns.filter((item) =>
      applyedSelectedFields.some((field) => item.accessor === field)
    ),
  ];

  const hasDeletedFalseOrMissing = !applyedFilters.some(
    (filter) => filter.key === 'hasDeleted' && filter.value !== false
  );

  const actions = [
    {
      label: 'View',
      onClick: handleViewUser,
      icon: <Eye className="h-4 w-4 text-green-600" />,
    },
    ...(hasDeletedFalseOrMissing
      ? [
          {
            label: 'Edit',
            onClick: onClickEdit,
            icon: <Edit className="h-4 w-4 text-primary" />,
          },
          {
            label: 'Delete',
            onClick: onClickDelete,
            icon: <Trash className="h-4 w-4 text-destructive" />,
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          User List
        </h3>

        <div className="flex flex-row">
          <SearchComponent value={search} onChange={setSearch} />
          <Button
            variant="outline"
            onClick={toggleSettings}
            className={`mx-4 flex items-center justify-center rounded p-2 ${openSettings && 'bg-accent text-accent-foreground'}`}
          >
            <Settings />
          </Button>
          <Button className="w-full md:w-auto" onClick={onClickAddUser}>
            Add User
          </Button>
        </div>
      </div>

      {openSettings && (
        <TableSettings
          className="mt-4"
          filterOptions={filterOptions}
          onChangeFilter={setFilters}
          appliedFilters={filters}
          options={fieldOptions}
          selectedOptions={selectedFields}
          onChangeOptions={setSelectedFields}
          onClickApply={onClickApply}
        />
      )}

      <Table
        columns={columns}
        data={data?.users?.data ?? []}
        actions={actions}
        className="my-4"
        pagination={{
          totalPages: data?.users?.totalPages ?? 0,
          currentPage: pagination.page,
          currentLimit: pagination.limit,
          onLimitChange: setLimit,
          onPageChange: setPage,
          showLimitSelector: true,
        }}
      />
    </div>
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
