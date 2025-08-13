'use client';

import { Button } from '@/components/ui/button';
import { SearchComponent } from '@/customComponents/SearchComponent';
import { Table } from '@/customComponents/Table';
import { TableSettings } from '@/customComponents/TablesSettings';
import { Filter } from '@/customComponents/types';
import RestoreForm from '@/forms/smtp/RestoreForm';
import SmtpForm from '@/forms/smtp/SmtpForm';
import DeleteSmtpForm from '@/forms/smtp/SoftdeleteForm';
import useDialog from '@/hooks/useDialog';
import { useBuildQuery } from '@/modules/common/hooks';
import { buildfindAllSmtpQuery } from '@/modules/smtp/gql';
import { SmtpFormInputs } from '@/modules/smtp/schemas';
import { Column } from '@/types/table';
import { ArchiveRestore, Edit, Settings, Trash } from 'lucide-react';
import { NextPage } from 'next';
import { Suspense, useState } from 'react';

const defaultColumns: Column<SmtpFormInputs>[] = [
  { header: 'UserName', accessor: 'username' },
  { header: 'From Name', accessor: 'from' },
  {
    header: 'Port',
    accessor: 'port',
    format: (value: number) => String(value),
  },
  { header: 'Host', accessor: 'host' },
  {
    header: 'Is Secure',
    accessor: 'secure',
    format: (value: boolean) => (value ? 'Yes' : 'No'),
  },
];
const optionalColumns: Column<SmtpFormInputs>[] = [
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

  { header: 'Is Backup', accessor: 'isBackUp' },
];
const fieldOptions = [
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Deleted At', value: 'deletedAt' },
  { label: 'Is Backup', value: 'isBackUp' },
];
const filterOptions: Filter[] = [
  {
    key: 'hasDeleted',
    label: 'Deleted',
    value: false,
    options: [
      { label: 'Deleted', value: true },
      { label: 'Not Deleted', value: false },
    ],
  },
  {
    key: 'isBackUp',
    label: 'Is Backup',
    value: false,
    options: [
      { label: 'Is Backup', value: true },
      { label: 'Is Default', value: false },
    ],
  },
];

const SmtpPageComponent = () => {
  const [openSettings, setOpenSettings] = useState(false);
  const {
    data: smtp,
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
  } = useBuildQuery(buildfindAllSmtpQuery);

  const { openDialog, clearDialog } = useDialog();
  const initialvalues = {
    id: '',
    username: '',
    password: '',
    from: '',
    host: '',
    port: null,
    secure: false,
    isBackUp: false,
  };

  const onClickSubmit = () => {
    clearDialog();
    refetch();
  };
  const onClickAddSmtp = () => {
    openDialog({
      title: 'Add Smtp',
      content: (
        <SmtpForm values={initialvalues} onClickSubmit={onClickSubmit} />
      ),
    });
  };
  const onClickEdit = (smtp: SmtpFormInputs) => {
    openDialog({
      title: 'Edit SMTP',
      content: <SmtpForm values={smtp} onClickSubmit={onClickSubmit} />,
    });
  };
  const onClickRestoreSmtp = (template: SmtpFormInputs) => {
    openDialog({
      title: 'Restore Template',
      content: <RestoreForm values={template} onClickSubmit={onClickSubmit} />,
    });
  };
  const onClickDelete = (smtp: SmtpFormInputs) => {
    const id = smtp.id;
    if (!id) {
      console.error('ID is missing in the SMTP object!');
      return;
    }
    openDialog({
      title: 'Delete SMTP',
      content: <DeleteSmtpForm values={smtp} onClickSubmit={onClickSubmit} />,
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
    (filter) => filter.key === 'hasDeleted' && filter.value !== false
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
            onClick: onClickRestoreSmtp,
            icon: <ArchiveRestore className="h-4 w-4 text-primary" />,
          },
        ]),
  ];
  return (
    <div className="max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          SMTP LIST
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
          <Button className="w-full md:w-auto" onClick={onClickAddSmtp}>
            Add Smtp
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
        data={smtp?.findAllSmtp?.data ?? []}
        actions={actions}
        className="my-4"
        pagination={{
          totalPages: smtp?.findAllSmtp?.totalPages ?? 0,
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

const SmtpPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SmtpPageComponent />
    </Suspense>
  );
};

export default SmtpPage;
