import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DraftExperiment, Experiment } from '@/api-types';
import { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const getColumnSortedIcon = (sorted?: string) => {
  if (sorted) {
    if (sorted === 'asc') {
      return <ArrowUp />;
    } else {
      return <ArrowDown />;
    }
  } else {
    return <ArrowUpDown />;
  }
};

export const useColumns = (isDraft: boolean) => {
  const { t } = useTranslation();
  return useMemo<ColumnDef<Experiment | DraftExperiment>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('name')}
            {getColumnSortedIcon(column.getIsSorted() || undefined)}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-[15px]">{row.getValue('name')}</div>
        ),
      },
      {
        accessorKey: 'description',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('description')}
            {getColumnSortedIcon(column.getIsSorted() || undefined)}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-[15px]">{row.getValue('description')}</div>
        ),
      },
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('date')}
            {getColumnSortedIcon(column.getIsSorted() || undefined)}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="px-[15px]">{row.getValue('date')}</div>
        ),
      },
      {
        id: 'actions',
        enableHiding: false,
        header: () => <span>{t('action')}</span>,
        cell: ({ row }) => {
          const data = row.original;
          return (
            <Button variant="ghost" asChild>
              <Link
                to={
                  isDraft
                    ? '/create/draft-experiment/$id'
                    : '/dashboard/experiment/$id'
                }
                params={{ id: data.id! }}
              >
                {isDraft ? t('edit') : t('view')}
              </Link>
            </Button>
          );
        },
      },
    ],
    [isDraft, t]
  );
};

interface ExperimentsTableProps {
  data: Experiment[] | DraftExperiment[];
  isDraft?: boolean;
  onClickRefresh: () => void;
  isRefetching: boolean;
}
export const ExperimentsTable = ({
  data,
  isDraft,
  onClickRefresh,
  isRefetching,
}: ExperimentsTableProps) => {
  const { t } = useTranslation();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [filterBy, setFilterBy] = useState<string>('');
  const columns = useColumns(isDraft ? true : false);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-4">
          <Input
            placeholder={t('filter-term')}
            value={
              filterBy === ''
                ? ''
                : (table.getColumn(filterBy)?.getFilterValue() as string)
            }
            onChange={(event) =>
              filterBy === ''
                ? null
                : table.getColumn(filterBy)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {filterBy ? (
                  <span className="capitalize">{filterBy}</span>
                ) : (
                  t('filter-by')
                )}{' '}
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuItem
                      key={column.id}
                      className="capitalize"
                      onClick={() => setFilterBy(column.id)}
                    >
                      {column.id}
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t('columns')} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {isRefetching ? (
            <Button disabled>
              <Loader2 className="animate-spin" />
            </Button>
          ) : (
            <Button onClick={() => onClickRefresh()}>{t('refresh')}</Button>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('no-results')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    </div>
  );
};
