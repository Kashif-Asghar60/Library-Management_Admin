import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

// Table column headers based on the borrowing history data structure
const historyHeadCells = [
  { id: 'id', label: 'Record ID' },
  { id: 'book_name', label: 'Book Name' },
  { id: 'student_name', label: 'Student Name' },
  { id: 'borrowed_at', label: 'Borrowed At' },
  { id: 'due_date', label: 'Due Date' },
  { id: 'returned_at', label: 'Returned At' },
  { id: 'duration', label: 'Duration' },
];

function BorrowHistoryTableHead() {
  return (
    <TableHead>
      <TableRow>
        {historyHeadCells.map((headCell) => (
          <TableCell key={headCell.id} align="left">
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const BorrowHistoryTable = ({ borrowHistory }) => {
  return (
    <Box>
      <TableContainer>
        <Table aria-labelledby="tableTitle">
          <BorrowHistoryTableHead />
          <TableBody>
            {borrowHistory.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.book_name}</TableCell>
                <TableCell>{record.student.name}</TableCell>
                <TableCell>{new Date(record.borrowed_at).toLocaleString()}</TableCell>
                <TableCell>{new Date(record.due_date).toLocaleString()}</TableCell>
                <TableCell>{record.returned_at ? new Date(record.returned_at).toLocaleString() : 'Not Returned'}</TableCell>
                <TableCell>{record.duration} days</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

BorrowHistoryTable.propTypes = {
  borrowHistory: PropTypes.array.isRequired,
};

export default BorrowHistoryTable;
