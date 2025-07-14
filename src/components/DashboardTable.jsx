import {
  Card, CardContent, Typography, Table, TableBody,
  TableContainer, TableHead, TableRow, Paper, Button, Box, Menu, MenuItem
} from '@mui/material';
import TableCell from '@mui/material/TableCell';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { addArabicFont } from './arabicFont'; // تأكد من وجود الملف

const DashboardTable = ({
  title,
  rows,
  headers,
  rowRenderer,
  showRowNumbers = true,
  exportFileName = 'data',
  getExportRow
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [visibleCount, setVisibleCount] = useState(50);

  const handleMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 50);
  };

  const exportToExcel = () => {
    const data = rows.map((row, index) => {
      const base = showRowNumbers ? { '#': index + 1 } : {};
      return {
        ...base,
        ...headers.reduce((acc, header, i) => {
          acc[header] = typeof row[i] === 'string' || typeof row[i] === 'number'
            ? row[i]
            : '';
          return acc;
        }, {})
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, `${exportFileName}.xlsx`);
  };

const exportToPDF = () => {
    const doc = new jsPDF();
    addArabicFont(doc);
    doc.setFont('Amiri');

    const tableColumn = showRowNumbers ? ['#', ...headers] : headers;
    const tableRows = rows.map((row, i) => {
      const exportRow = getExportRow ? getExportRow(row, i) : [];
      return showRowNumbers ? [i + 1, ...exportRow] : exportRow;
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    styles: { font: 'Amiri', fontSize: 12, halign: 'right' },
    didDrawPage: () => {
      doc.setFontSize(14);
      doc.text(title || 'تقرير', 105, 10, { align: 'center' });
    }
  });

  doc.save(`${exportFileName}.pdf`);
};

  const exportToCSV = () => {
    const headersRow = showRowNumbers ? ['#', ...headers] : headers;
    const rowsData = rows.map((row, i) => {
      const cells = React.Children.toArray(rowRenderer(row, i));
      const values = cells.map(cell => {
        const content = cell?.props?.children;
        return (typeof content === 'string' || typeof content === 'number') ? content : '';
      });
      return showRowNumbers ? [i + 1, ...values] : values;
    });

    const csvContent = headersRow.join(',') + '\n' + rowsData.map(r => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${exportFileName}.csv`);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontFamily="Cairo, sans-serif" fontWeight="bold">
            {title}
          </Typography>

          <Box>
            <Button
              variant="outlined"
              size="small"
              sx={{ fontFamily: 'Cairo, sans-serif', color: '#1C7F6D' }}
              onClick={handleMenuClick}
            >
              تصدير
            </Button>
            <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleMenuClose(); exportToExcel(); }}>Excel</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); exportToPDF(); }}>PDF</MenuItem>
              <MenuItem onClick={() => { handleMenuClose(); exportToCSV(); }}>CSV</MenuItem>
            </Menu>
          </Box>
        </Box>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#146960' }}>
                {showRowNumbers && (
                  <TableCell sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                    fontFamily: 'Cairo, sans-serif'
                  }}>
                    #
                  </TableCell>
                )}
                {headers.map((header, i) => (
                  <TableCell key={i} sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 15,
                    textAlign: 'center',
                    fontFamily: 'Cairo, sans-serif'
                  }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, visibleCount).map((row, i) => (
                <TableRow
                  key={i}
                  sx={{
                    backgroundColor: i % 2 === 0 ? '#f5f5f5' : '#ffffff',
                    '&:hover': { backgroundColor: '#e0f7fa', cursor: 'pointer' }
                  }}
                >
                  {showRowNumbers && (
                    <TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                      {i + 1}
                    </TableCell>
                  )}
                  {rowRenderer(row, i)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {visibleCount < rows.length && (
          <Box textAlign="center" mt={2}>
            <Button
              variant="outlined"
              size="small"
              onClick={handleLoadMore}
              sx={{ fontFamily: 'Cairo, sans-serif', color: '#1C7F6D' }}
            >
              عرض المزيد
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTable;
