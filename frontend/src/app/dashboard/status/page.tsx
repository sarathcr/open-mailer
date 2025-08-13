'use client';

import { Button } from '@/components/ui/button';
import { SearchComponent } from '@/customComponents/SearchComponent';
import { Table } from '@/customComponents/Table';
import { TableSettings } from '@/customComponents/TablesSettings';
import { Column, Filter } from '@/customComponents/types';
import useDialog from '@/hooks/useDialog';
import { useBuildQuery } from '@/modules/common/hooks';
import {
  buildFindAllStatusesQuery,
  GET_MAIL_COUNTS,
} from '@/modules/statuses/gql/queries';
import { Statuses } from '@/modules/statuses/gql/types';
import { RotateCcw, Settings } from 'lucide-react';
import React, { Suspense, useState } from 'react';
import RetryEmailsForm from './(forms)/RetryEmailsForm';
import { useQuery } from '@apollo/client';
import { SmtpData } from '@/modules/smtp/gql/types';
import { FIND_ALL_SMTP_QUERY } from '@/modules/smtp/gql';
import { MailStatsCard } from '@/customComponents/MailStatsCard';
import { RetryAllEmailsForm } from './(forms)/RetryAllEmailsForm';
import { NextPage } from 'next';

const defaultColumns: Column<Statuses>[] = [
  {
    header: 'App Name',
    accessor: 'apiToken',
    format: (value) => value?.name ?? 'NA',
  },
  {
    header: 'From',
    accessor: 'smtpConfig',
    format: (value) => value?.from ?? 'NA',
  },
  {
    header: 'Template Name',
    accessor: 'emailTemplate',
    format: (value) => value?.name ?? 'NA',
  },
  { header: 'Recipients', accessor: 'recipients' },
  { header: 'Status', accessor: 'status' },
  { header: 'Retries', accessor: 'retries' },
  {
    header: 'Error Message',
    accessor: 'errorMessage',
    format: (value) =>
      value ? (
        <div
          className="max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap"
          title={value}
        >
          {value}
        </div>
      ) : (
        'NA'
      ),
  },
];

const optionalColumns: Column<Statuses>[] = [
  {
    header: 'Data',
    accessor: 'data',
    format: (value) =>
      value ? (
        <div
          className="max-w-[200px] overflow-hidden truncate text-ellipsis whitespace-nowrap"
          title={value}
        >
          {value}
        </div>
      ) : (
        'NA'
      ),
  },
  {
    header: 'Max Retries',
    accessor: 'maxRetries',
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
];

const fieldOptions = [
  { label: 'Data', value: 'data' },
  { label: 'Max Retries', value: 'maxRetries' },
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Deleted At', value: 'deletedAt' },
];
const filterOptions: Filter[] = [
  {
    key: 'status',
    label: 'Status',
    value: '',
    options: [
      { label: 'SUCCESS', value: 'SUCCESS' },
      { label: 'PENDING', value: 'PENDING' },
      { label: 'FAILED', value: 'FAILED' },
    ],
  },
];
function StatusPageComponent() {
  const { openDialog, clearDialog } = useDialog();
  const { data: smtpData } = useQuery<SmtpData>(FIND_ALL_SMTP_QUERY, {
    variables: { filter: { isBackUp: true } },
  });
  const { data: mailCountsData } = useQuery(GET_MAIL_COUNTS);
  const {
    data: statuses,
    selectedFields,
    applyedSelectedFields,
    setSelectedFields,
    setFilters,
    filters,
    onClickApply,
    pagination,
    setPage,
    setLimit,
    search,
    setSearch,
  } = useBuildQuery(buildFindAllStatusesQuery);
  const [openSettings, setOpenSettings] = useState(false);

  const columns = [
    ...defaultColumns,
    ...optionalColumns.filter((item) =>
      applyedSelectedFields.some((field) => item.accessor === field)
    ),
  ];
  const toggleSettings = () => {
    setOpenSettings(!openSettings);
  };

  const onRestore = (status: Statuses) => {
    openDialog({
      title: 'Restore Template',
      content: (
        <RetryEmailsForm
          defaultValues={{ id: status.id }}
          smtpData={smtpData?.findAllSmtp?.data ?? []}
          onCompleted={clearDialog}
        />
      ),
    });
  };

  const onResend = () => {
    openDialog({
      title: 'Retry mails',
      content: <RetryAllEmailsForm />,
    });
  };

  const actions = [
    {
      label: 'Restore',
      onClick: onRestore,
      icon: <RotateCcw className="h-4 w-4 text-primary" />,
      isVisible: (row: Statuses) => row.status === 'FAILED',
    },
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <h3 className="text-2xl font-semibold tracking-tight">Mail Status</h3>

      <div className="mt-6 flex w-full flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {mailCountsData && (
          <div className="flex flex-1 flex-wrap items-center gap-6">
            <MailStatsCard
              title="Total"
              value={mailCountsData.getMailCounts.total}
              color="text-blue-400"
            />
            <MailStatsCard
              title="Success"
              value={mailCountsData.getMailCounts.success}
              color="text-green-400"
            />
            <MailStatsCard
              title="Failed"
              value={mailCountsData.getMailCounts.failed}
              color="text-red-400"
              onRetry={onResend}
            />
          </div>
        )}
        <div className="flex items-center gap-3">
          <SearchComponent value={search} onChange={setSearch} />
          <Button
            variant="outline"
            onClick={toggleSettings}
            className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
              openSettings ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <Settings />
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
        actions={actions}
        className="my-6"
        data={statuses?.statuses?.data ?? []}
        pagination={{
          totalPages: statuses?.statuses?.totalPages ?? 0,
          currentPage: pagination.page,
          currentLimit: pagination.limit,
          onLimitChange: setLimit,
          onPageChange: setPage,
          showLimitSelector: true,
        }}
      />
    </div>
  );
}

const StatusPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StatusPageComponent />
    </Suspense>
  );
};

export default StatusPage;
