'use client';

import { Button } from '@/components/ui/button';
import { SearchComponent } from '@/customComponents/SearchComponent';
import { Table } from '@/customComponents/Table';
import { TableSettings } from '@/customComponents/TablesSettings';
import { Filter } from '@/customComponents/types';
import APITokenForm from '@/forms/api-token/APITokenForm';
import RemoveAPITokenForm from '@/forms/api-token/RemoveForm';
import RestoreForm from '@/forms/api-token/RestoreForm';
import DeleteAPITokenForm from '@/forms/api-token/SoftdeleteForm';

import useDialog from '@/hooks/useDialog';
import { apitokenQuery } from '@/modules/api-token/gql/queries';
import { APITokenInputs } from '@/modules/api-token/schemas/api-tokenSchemas';
import { useBuildQuery } from '@/modules/common/hooks';

import { Column } from '@/types/table';

import { ArchiveRestore, Edit, Settings, Trash } from 'lucide-react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';

const duration = {
  '7': '7 Days',
  '30': '30 Days',
  '90': '90 Days',
  '0': 'Unlimited',
};

const defaultColumns: Column<APITokenInputs>[] = [
  { header: 'Name', accessor: 'name' },
  { header: 'Status', accessor: 'status' },
  {
    header: 'Duration',
    accessor: 'duration',
    format: (value: number) =>
      duration[value as unknown as keyof typeof duration],
  },
];
const optionalColumns: Column<APITokenInputs>[] = [
  {
    header: 'Created At',
    accessor: 'createdAt',
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    header: 'Expired At',
    accessor: 'expireAt',
    format: (value) => new Date(value).toLocaleDateString(),
  },
  {
    header: 'Deleted At',
    accessor: 'deletedAt',
    format: (value) => (value ? new Date(value).toLocaleDateString() : 'NA'),
  },
];
const fieldOptions = [
  { label: 'Created At', value: 'createdAt' },
  { label: 'Expired At', value: 'expireAt' },
  { label: 'Deleted At', value: 'deletedAt' },
];
const filterOptions: Filter[] = [
  {
    key: 'deleted',
    label: 'Deleted',
    value: false,
    options: [
      { label: 'Deleted', value: true },
      { label: 'Not Deleted', value: false },
    ],
  },
];

const ApiTokenPageComponent = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const {
    data: apitoken,
    selectedFields,
    setSelectedFields,
    applyedSelectedFields,
    applyedFilters,
    setFilters,
    filters,
    pagination,
    setPage,
    setLimit,
    refetch,
    search,
    setSearch,
    onClickApply,
  } = useBuildQuery(apitokenQuery);
  const router = useRouter();

  const { openDialog, clearDialog } = useDialog();
  const initialvalues = {
    apiToken: {
      id: '',
      name: '',
      duration: '',
    },
  };

  const onClickSubmit = () => {
    clearDialog();
    refetch();
  };
  const onClickAddAPIToken = () => {
    openDialog({
      title: 'Add API Token',
      content: (
        <APITokenForm values={initialvalues} onClickSubmit={onClickSubmit} />
      ),
    });
  };

  const onClickEdit = (apitoken: APITokenInputs) => {
    const apitokenid = apitoken.id;
    router.push(`/dashboard/api-token/${apitokenid}`);
  };
  const onClickRestoreApitoken = (apitoken: APITokenInputs) => {
    openDialog({
      title: 'Restore API Token',
      content: <RestoreForm values={apitoken} onClickSubmit={onClickSubmit} />,
    });
  };
  const onClickDelete = (apitoken: APITokenInputs) => {
    const id = apitoken.id;
    if (!id) {
      console.error('ID is missing in the API token object!');
      return;
    }
    openDialog({
      title: 'Delete API Token',
      content: (
        <DeleteAPITokenForm values={apitoken} onClickSubmit={onClickSubmit} />
      ),
    });
  };

  const onClickRemoveAPIToken = (apitoken: APITokenInputs) => {
    openDialog({
      title: 'Remove Template',
      content: (
        <RemoveAPITokenForm values={apitoken} onClickSubmit={onClickSubmit} />
      ),
    });
  };

  const columns = [
    ...defaultColumns,
    ...optionalColumns.filter((item) =>
      applyedSelectedFields.some((field) => item.accessor === field)
    ),
  ];
  const toggleSettings = () => {
    setOpenSettings(!openSettings);
  };
  const hasDeletedFalseOrMissing = !applyedFilters.some(
    (filter) => filter.key === 'deleted' && filter.value !== false
  );

  const actions = [
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
      : [
          {
            label: 'Restore',
            onClick: onClickRestoreApitoken,
            icon: <ArchiveRestore className="h-4 w-4 text-primary" />,
          },
          {
            label: 'Delete',
            onClick: onClickRemoveAPIToken,
            icon: <Trash className="h-4 w-4 text-destructive" />,
          },
        ]),
  ];
  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          API Tokens
        </h3>
        <div className="gap flex flex-row gap-2">
          <SearchComponent value={search} onChange={setSearch} />
          <Button
            variant="outline"
            onClick={toggleSettings}
            className={`mx-4 flex items-center justify-center rounded p-2 ${openSettings && 'bg-accent text-accent-foreground'}`}
          >
            <Settings />
          </Button>
          <Button className="w-full md:w-auto" onClick={onClickAddAPIToken}>
            Create New API token
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
        data={apitoken?.apiTokens.data ?? []}
        actions={actions}
        className="my-4"
        pagination={{
          totalPages: apitoken?.apiTokens?.totalPages ?? 0,
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

const ApiTokenPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApiTokenPageComponent />
    </Suspense>
  );
};

export default ApiTokenPage;
