'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table } from '@/customComponents/Table';
import useDialog from '@/hooks/useDialog';
import { ArchiveRestore, Edit, Settings, Trash } from 'lucide-react';
import TemplateForm from '@/forms/template/TemplateForm';
import DeleteForm from '@/forms/template/DeleteForm';
import { buildfindAllEmailTemplatesQuery } from '@/modules/template/gql/queries';
import { useBuildQuery } from '@/modules/common/hooks';
import { SearchComponent } from '@/customComponents/SearchComponent';
import { TableSettings } from '@/customComponents/TablesSettings';
import { Column, Filter } from '@/customComponents/types';
import {
  ExtendedTemplateFormInputs,
  templateFormInputs,
} from '@/modules/template/template.schema';
import RestoreForm from '@/forms/template/RestoreForm';
import RemoveForm from '@/forms/template/RemoveForm';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';

const defaultColumns: Column<templateFormInputs>[] = [
  {
    header: 'Id',
    accessor: 'id',
  },
  { header: 'Name', accessor: 'name' },
  { header: 'File Path', accessor: 'filePath' },
];

const optionalColumns: Column<ExtendedTemplateFormInputs>[] = [
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
  { label: 'Created At', value: 'createdAt' },
  { label: 'Updated At', value: 'updatedAt' },
  { label: 'Deleted At', value: 'deletedAt' },
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
];

function TemplatesPageComponent() {
  const router = useRouter();
  const { openDialog, clearDialog } = useDialog();
  const [openSettings, setOpenSettings] = useState(false);

  const {
    data: template,
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
  } = useBuildQuery(buildfindAllEmailTemplatesQuery);

  const initialvalues: templateFormInputs = {
    id: '',
    name: '',
    filePath: '',
    templateType: 'default',
  };

  const onClickAddTemplate = () => {
    openDialog({
      title: 'Create Template',
      content: (
        <TemplateForm values={initialvalues} onClickSubmit={onClickSubmit} />
      ),
    });
  };

  const onClickSubmit = async () => {
    clearDialog();
    refetch();
  };

  const onClickEditTemplate = (template: any) => {
    const templateId = template.id;

    router.push(`/dashboard/templates/${templateId}`);
  };

  const onClickDeleteTemplate = (template: templateFormInputs) => {
    openDialog({
      title: 'Delete Template',
      content: <DeleteForm values={template} onClickSubmit={onClickSubmit} />,
    });
  };
  const onClickRestoreTemplate = (template: templateFormInputs) => {
    openDialog({
      title: 'Restore Template',
      content: <RestoreForm values={template} onClickSubmit={onClickSubmit} />,
    });
  };
  const onClickRemoveTemplate = (template: templateFormInputs) => {
    openDialog({
      title: 'Remove Template',
      content: <RemoveForm values={template} onClickSubmit={onClickSubmit} />,
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
            onClick: onClickEditTemplate,
            icon: <Edit className="h-4 w-4 text-primary" />,
          },
          {
            label: 'Delete',
            onClick: onClickDeleteTemplate,
            icon: <Trash className="h-4 w-4 text-destructive" />,
          },
        ]
      : [
          {
            label: 'View',
            onClick: onClickRestoreTemplate,
            icon: <ArchiveRestore className="h-4 w-4 text-green-600" />,
          },
          {
            label: 'Delete',
            onClick: onClickRemoveTemplate,
            icon: <Trash className="h-4 w-4 text-destructive" />,
          },
        ]),
  ];

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Template List
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
          <Button className="w-full md:w-auto" onClick={onClickAddTemplate}>
            Add Template
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
        data={template?.findAllEmailTemplates?.data ?? []}
        actions={actions}
        className="my-4"
        pagination={{
          totalPages: template?.findAllEmailTemplates?.totalPages ?? 0,
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

const TemplatesPage: NextPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TemplatesPageComponent />
    </Suspense>
  );
};

export default TemplatesPage;
