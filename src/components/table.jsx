import React from 'react'
import PropTypes from 'prop-types'

import './table.css'

const SortIcon = ({ fill, sort }) => (
  <svg className={`sort-icon-${sort !== '' ? sort : 'none'}`} viewBox='0 0 24 24' width='24' height='24'>
    <g>
     {sort !== 'desc' && <polygon fill={fill} points='6,10,12,4,18,10' />}
     {sort !== 'asc' && <polygon fill={fill} points='6,14,18,14,12,20' />}
    </g>
  </svg>
)

const TableHeaderColumn = ({ column, onClick }) => (
  <div className='table-header-column' onClick={onClick}>
    {column.label} <SortIcon fill='white' sort={column.sort} />
  </div>
)

TableHeaderColumn.propTypes = {
  column: PropTypes.object
}

const TableHeaderRow = ({ columns = [], sortBy }) => (
  <div className='table-header-row'>
    {
      columns
        .filter(column => column.visible)
        .sort((a, b) => a.order - b.order)
        .map((column, index) => (
          <TableHeaderColumn
            key={index}
            column={column}
            onClick={() => sortBy({ column })}
          />
        ))
    }
  </div>
)

TableHeaderRow.propTypes = {
  columns: PropTypes.array
}

const TableColumn = ({ column, cell }) => (
  <div
    className={
      cell.color
        ? `table-column table-column-colored`
        : 'table-column'
    }
    style={
      cell.color
        ? {
          backgroundColor: cell.color
        }
        : undefined
    }>
    {
      column.columnRenderer
        ? column.columnRenderer({ cell, column, value: cell[column.dataKey || 'value'] || '' })
        : cell[column.dataKey || 'value'] || ''
    }
  </div>
)

TableColumn.propTypes = {
  column: PropTypes.object,
  cell: PropTypes.object
}

const TableRow = ({ cell, columns }) => (
  <div className='table-row'>
    {
      columns
        .map((column, index) => (
          <TableColumn
            key={index}
            column={column}
            cell={cell}
          />
        ))
    }
  </div>
)

TableRow.propTypes = {
  cell: PropTypes.object,
  columns: PropTypes.array
}

const Table = ({ columns = [], rows = [], sortBy }) => {
  const visibleOrderedColumns = columns
    .filter(column => column.visible)
    .sort((a, b) => a.order - b.order)

  return (
    <div className='table-container'>
      <TableHeaderRow columns={visibleOrderedColumns} sortBy={sortBy} />
      {
        rows.map((cell, index) => (
          <TableRow
            key={index}
            cell={cell}
            columns={visibleOrderedColumns}
          />
        ))
      }
    </div>
  )
}

Table.propTypes = {
  columns: PropTypes.array,
  rows: PropTypes.array
}

export default Table
