import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import {
  Container, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Card, CardContent, Box
} from '@mui/material';

const AssistanceTypes = () => {
  const [types, setTypes] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingType, setEditingType] = useState(null);
  const inputRef = useRef(null);

  const fetchTypes = async () => {
    try {
      const res = await axiosInstance.get('/AssistanceTypes/GetAll');
      setTypes(res.data.data || []);
    } catch (error) {
      console.error('خطأ أثناء تحميل البيانات:', error);
    }
  };

  const addType = async () => {
    if (!newName.trim()) return;

    try {
      await axiosInstance.post('/AssistanceTypes/Insert', {
        assistanceTypeId: 0,
        assistanceTypeName: newName
      });
      setNewName('');
      fetchTypes();
    } catch (error) {
      console.error('خطأ أثناء الإضافة:', error);
      alert('خطأ أثناء الإضافة');
    }
  };

  const updateType = async () => {
    if (!newName.trim() || !editingType) return;

    try {
      await axiosInstance.put('/AssistanceTypes/Update', {
        assistanceTypeId: editingType.assistanceTypeId,
        assistanceTypeName: newName
      });
      setNewName('');
      setEditingType(null);
      fetchTypes();
    } catch (error) {
      console.error('خطأ أثناء التحديث:', error);
      alert('خطأ أثناء التحديث');
    }
  };

  const handleEdit = (type) => {
    setNewName(type.assistanceTypeName);
    setEditingType(type);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  return (
    <Container sx={{ mt: 4, direction: 'rtl' }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} color='1C7F6D' fontFamily="Cairo, sans-serif" fontWeight="bold">
            أنواع المساعدات
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <TextField
              label="نوع المساعدة"
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              inputRef={inputRef}
              fullWidth
              sx={{ fontFamily: 'Cairo, sans-serif' }}
            />
            <Button
              variant="contained"
              onClick={editingType ? updateType : addType}
              color={editingType ? 'secondary' : 'primary'}
              sx={{ fontFamily: 'Cairo, sans-serif', fontSize: '16px', whiteSpace: 'nowrap' }}
            >
              {editingType ? 'تحديث' : 'إضافة'}
            </Button>
          </Box>

          {editingType && (
            <Button
              variant="text"
              color="error"
              sx={{ mb: 2, fontFamily: 'Cairo, sans-serif' }}
              onClick={() => {
                setEditingType(null);
                setNewName('');
              }}
            >
              إلغاء التعديل
            </Button>
          )}

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#146960' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>#</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>الاسم</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {types.map((type, idx) => (
                  <TableRow
                    key={type.assistanceTypeId}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      '&:hover': { backgroundColor: '#e0f7fa' }
                    }}
                  >
                    <TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif' }}>{idx + 1}</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif', color: '#1C7F6D' }}>
                      {type.assistanceTypeName}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{ fontFamily: 'Cairo, sans-serif' }}
                        onClick={() => handleEdit(type)}
                      >
                        تعديل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {types.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                      لا توجد أنواع مساعدة
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AssistanceTypes;
