import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Typography, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, TableSortLabel
} from '@mui/material';
import axiosInstance from '../axiosInstance';

const Assistances = () => {
  const navigate = useNavigate();
  const [assistances, setAssistances] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [errorAssistances, setErrorAssistances] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });

  const fetchAll = async () => {
    try {
      const res = await axiosInstance.get('/Assistances/GetAll');
      setAssistances(res.data.data || []);
    } catch (err) {
      setErrorAssistances('فشل تحميل المساعدات');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedAssistances = [...assistances].filter((a) =>
    a.beneficiaryName?.toLowerCase().includes(searchText.toLowerCase()) ||
    a.assistanceTypeName?.toLowerCase().includes(searchText.toLowerCase()) ||
    a.deliveredBy?.toLowerCase().includes(searchText.toLowerCase()) ||
    a.notes?.toLowerCase().includes(searchText.toLowerCase())
  ).sort((a, b) => {
    const { key, direction } = sortConfig;
    if (!key) return 0;

    const aVal = a[key] ?? '';
    const bVal = b[key] ?? '';

    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Container maxWidth="md" sx={{ mt: 5, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <Box sx={{ textAlign: 'left', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/assistances/new')}
          sx={{ ml: 1, fontFamily: 'Cairo, sans-serif' }}
        >
          إضافة مساعدة جديدة
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/assistances/bulk')}
          sx={{ ml: 1, fontFamily: 'Cairo, sans-serif' }}
        >
          تسجيل مساعدات جماعية
        </Button>
      </Box>

      <TextField
        label="بحث..."
        fullWidth
        variant="outlined"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{ mb: 2 }}
      />

      {errorAssistances && <Typography color="error">{errorAssistances}</Typography>}

      <TableContainer  component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1C7F6D' }}>
            <TableRow>
              <TableCell align="center" sx={{ color: 'white' }}>#</TableCell>

              <TableCell align="center" sx={{ color: 'white' }}>
                <TableSortLabel
                  active={sortConfig.key === 'beneficiaryName'}
                  direction={sortConfig.key === 'beneficiaryName' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('beneficiaryName')}
                  sx={{ color: 'white', fontFamily:"Cairo, sans-serif"}}
                >
                  المستفيد
                </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ color: 'white' }}>
                <TableSortLabel
                  active={sortConfig.key === 'assistanceTypeName'}
                  direction={sortConfig.key === 'assistanceTypeName' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('assistanceTypeName')}
                  sx={{ color: 'white' , fontFamily:"Cairo, sans-serif"}}
                >
                  النوع
                </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ color: 'white' }}>
                <TableSortLabel
                  active={sortConfig.key === 'amount'}
                  direction={sortConfig.key === 'amount' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('amount')}
                  sx={{ color: 'white' , fontFamily:"Cairo, sans-serif"}}
                >
                  المبلغ
                </TableSortLabel>
              </TableCell>

              <TableCell align="center" sx={{ color: 'white' }}>
                <TableSortLabel
                  active={sortConfig.key === 'assistanceDate'}
                  direction={sortConfig.key === 'assistanceDate' ? sortConfig.direction : 'asc'}
                  onClick={() => handleSort('assistanceDate')}
                  sx={{ color: 'white', fontFamily:"Cairo, sans-serif" }}
                >
                  التاريخ
                </TableSortLabel>
              </TableCell>

             
              <TableCell align="center" sx={{ color: 'white', fontFamily:"Cairo, sans-serif" }}>بواسطة</TableCell>
              <TableCell align="center" sx={{ color: 'white' , fontFamily:"Cairo, sans-serif"}}>ملاحظات</TableCell>
              <TableCell align="center" sx={{ color: 'white' , fontFamily:"Cairo, sans-serif"}}>إجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAssistances.map((a, idx) => (
              <TableRow key={a.assistanceId}>
                <TableCell align="center">{idx + 1}</TableCell>
                <TableCell style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">{a.beneficiaryName}</TableCell>
                <TableCell  style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">{a.assistanceTypeName}</TableCell>
                <TableCell  style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">{a.amount}</TableCell>
                <TableCell  style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">{a.assistanceDate?.split('T')[0]}</TableCell>
              
                <TableCell  style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">{a.deliveredBy}</TableCell>
                <TableCell  style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">{a.notes}</TableCell>
                <TableCell  style={{color:"#1C7F6D",  fontFamily:"Cairo, sans-serif"}} align="center">
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/assistances/edit/${a.assistanceId}`)}
                    

                  >
                    تعديل
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {sortedAssistances.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">لا توجد نتائج مطابقة</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Assistances;
