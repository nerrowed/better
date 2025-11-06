// src/components/tables/simple-data-table.tsx

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Check } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onView?: (data: TData) => void;
  onEdit?: (data: TData) => void;
  onDelete?: (data: TData) => void;
  onCheck?: (data: TData) => void;
}

export function SimpleDataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onCheck,
}: DataTableProps<TData, TValue>) {
  const hasActions = onView || onEdit || onDelete || onCheck;

  const actionColumn: ColumnDef<TData>[] = hasActions
    ? [
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => {
            const rowData = row.original;
            return (
              <div className="flex space-x-2">
                {onCheck && (
                  <Button
                    className="cursor-pointer"
                    variant="secondary"
                    size="icon"
                    onClick={() => onCheck(rowData)}
                    aria-label="Check"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                {onView && (
                  <Button
                    className="cursor-pointer"
                    variant="secondary"
                    size="icon"
                    onClick={() => onView(rowData)}
                    aria-label="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    className="cursor-pointer"
                    variant="secondary"
                    size="icon"
                    onClick={() => onEdit(rowData)}
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    className="cursor-pointer"
                    variant="secondary"
                    size="icon"
                    onClick={() => onDelete(rowData)}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>
            );
          },
          enableHiding: false,
        },
      ]
    : [];

  const allColumns = [...columns, ...actionColumn] as ColumnDef<
    TData,
    TValue
  >[];

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="font-semibold bg-secondary"
                  >
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={allColumns.length} className="py-20 relative">
                <Spinner className="absolute m-auto inset-0" />
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={allColumns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
