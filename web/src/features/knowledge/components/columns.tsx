import { ColumnDef } from '@tanstack/react-table'
// import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/dataTable/data-table-column-header'
// import { labels, priorities, statuses } from '../data/data'
import { DocumentItem } from '../data/schema'

// import { DataTableColumnHeader } from './data-table-column-header'
// import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<DocumentItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Task' />
  //   ),
  //   cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'wordCount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='WordCount' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('wordCount')}</div>
    ),
  },
  {
    accessorKey: 'tokens',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tokens' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('wordCount')}</div>
    ),
  },
  {
    accessorKey: 'doc_metadata',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Metadata' />
    ),
    cell: ({ row }) => (
      <div className='w-[80px]'>{row.getValue('doc_metadata')}</div>
    ),
  },
  {
    accessorKey: 'mode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Mode' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('mode')}</div>,
  },
]
