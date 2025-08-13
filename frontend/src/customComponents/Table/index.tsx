import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaginationProps } from '../types/paginationComponent';
import { TableProps } from '../types/table';
import { PaginationComponent } from '../PaginationComponent';

type ExtendedTableProps<T> = TableProps<T> & {
  pagination?: PaginationProps;
};

export function Table<T extends Record<string, any>>({
  columns,
  data,
  actions = [],
  className,
  pagination,
}: ExtendedTableProps<T>) {
  return (
    <div className="table-wrapper">
      <ShadTable className={className}>
        {/* Render table header */}
        <TableHeader>
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index} className={col.className || ''}>
                {col.header}
              </TableHead>
            ))}
            {actions.length > 0 && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>

        {/* Render table body */}
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell
                  key={colIndex}
                  className={col.className || 'max-w-[300px]'}
                >
                  <span className="block truncate">
                    {col.accessor
                      ? col.format
                        ? col.format(row[col.accessor])
                        : row[col.accessor]
                      : col.format?.(row)}
                  </span>
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell className="flex space-x-2">
                  {actions
                    .filter(
                      (action) => !action.isVisible || action.isVisible(row)
                    )
                    .map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => action.onClick(row)}
                        aria-label={action.label}
                        className="opacity-80 transition-opacity duration-200 hover:opacity-100"
                      >
                        {action.icon}
                      </button>
                    ))}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </ShadTable>

      {/* Conditionally render PaginationComponent if pagination props are provided */}
      {pagination && (
        <div className="mt-4">
          <PaginationComponent {...pagination} />
        </div>
      )}
    </div>
  );
}
