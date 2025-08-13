import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { FC } from 'react';
import { TableSettingsProps } from '../types';
import { FilterComponent } from '../FilterComponent';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TableOption } from '../TableOption';

export const TableSettings: FC<TableSettingsProps> = ({
  className,
  appliedFilters,
  filterOptions,
  onChangeFilter,
  options,
  selectedOptions,
  onChangeOptions,
  onClickApply,
}) => {
  const noFiltersApplied = appliedFilters.length > 0;
  return (
    <Tabs
      defaultValue="filters"
      className={`mx-auto min-h-[150px] w-full max-w-none rounded-lg border-[0.5px] border-stroke bg-white p-0 shadow-default dark:border-dark-3 dark:bg-gray-dark ${className}`}
    >
      <TabsList className="flex justify-start rounded-none border-b-2 p-0 shadow-none">
        <TabsTrigger
          value="filters"
          className={`rounded-none px-4 py-2 transition hover:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary`}
        >
          Filters
        </TabsTrigger>
        <TabsTrigger
          value="options"
          className={`rounded-none px-4 py-2 transition hover:text-black data-[state=active]:border-b-2 data-[state=active]:border-primary`}
        >
          Options
        </TabsTrigger>
      </TabsList>
      <TabsContent value="filters" className="mt-4">
        <Card>
          <CardContent className="mt-6 space-y-2">
            <FilterComponent
              appliedFilters={appliedFilters}
              filterOptions={filterOptions}
              onChange={onChangeFilter}
            />
          </CardContent>
          <CardFooter>
            {noFiltersApplied && <Button onClick={onClickApply}>Apply</Button>}
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="options">
        <Card>
          <CardContent className="mt-6 space-y-2">
            <TableOption
              options={options}
              onChange={onChangeOptions}
              selected={selectedOptions}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={onClickApply}>Apply</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
