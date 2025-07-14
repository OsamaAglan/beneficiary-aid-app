import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../axiosInstance';
import {
  Container, Typography, TextField, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Card, CardContent, Box
} from '@mui/material';

const BeneficiaryGroups = () => {
  const [groups, setGroups] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const inputRef = useRef(null);

  const fetchGroups = async () => {
    try {
      const res = await axiosInstance.get('/BeneficiaryGroups/GetAll');
      setGroups(res.data.data || []);
    } catch (error) {
      console.error('خطأ أثناء تحميل البيانات:', error);
    }
  };

  const addGroup = async () => {
    if (!newName.trim()) return;

    try {
      await axiosInstance.post('/BeneficiaryGroups/Insert', {
        beneficiaryGroupId: 0,
        beneficiaryGroupName: newName,
        notes: newNotes
      });
      setNewName('');
      setNewNotes('');
      fetchGroups();
    } catch (error) {
      console.error('خطأ أثناء الإضافة:', error);
      alert('خطأ أثناء الإضافة');
    }
  };

  const updateGroup = async () => {
    if (!newName.trim() || !editingGroup) return;

    try {
      await axiosInstance.put('/BeneficiaryGroups/Update', {
        beneficiaryGroupId: editingGroup.beneficiaryGroupId,
        beneficiaryGroupName: newName,
        notes: newNotes
      });
      setNewName('');
      setNewNotes('');
      setEditingGroup(null);
      fetchGroups();
    } catch (error) {
      console.error('خطأ أثناء التحديث:', error);
      alert('خطأ أثناء التحديث');
    }
  };

  const handleEdit = (group) => {
    setNewName(group.beneficiaryGroupName);
    setNewNotes(group.notes || '');
    setEditingGroup(group);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return (
    <Container sx={{ mt: 4, direction: 'rtl' }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} color='1C7F6D' fontFamily="Cairo, sans-serif" fontWeight="bold">
            مجموعات المستفيدين
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2} flexWrap="wrap">
            <TextField
              label="اسم المجموعة"
              variant="outlined"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              inputRef={inputRef}
              sx={{ fontFamily: 'Cairo, sans-serif', flex: 1 }}
            />
            <TextField
              label="ملاحظات"
              variant="outlined"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              sx={{ fontFamily: 'Cairo, sans-serif', flex: 2 }}
            />
            <Button
              variant="contained"
              onClick={editingGroup ? updateGroup : addGroup}
              color={editingGroup ? 'secondary' : 'primary'}
              sx={{ fontFamily: 'Cairo, sans-serif', fontSize: '16px', whiteSpace: 'nowrap' }}
            >
              {editingGroup ? 'تحديث' : 'إضافة'}
            </Button>
          </Box>

          {editingGroup && (
            <Button
              variant="text"
              color="error"
              sx={{ mb: 2, fontFamily: 'Cairo, sans-serif' }}
              onClick={() => {
                setEditingGroup(null);
                setNewName('');
                setNewNotes('');
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
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>اسم المجموعة</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>ملاحظات</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>عدد المستفيدين</TableCell>
                  
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Cairo, sans-serif' }}>الإجراءات</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {groups.map((group, idx) => (
                  <TableRow
                    key={group.beneficiaryGroupId}
                    sx={{
                      backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#ffffff',
                      '&:hover': { backgroundColor: '#e0f7fa' }
                    }}
                  >
                    <TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif' }}>{idx + 1}</TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif', color: '#1C7F6D' }}>
                      {group.beneficiaryGroupName}
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                      {group.notes || '-'}
                    </TableCell>
<TableCell align="center" sx={{ fontFamily: 'Cairo, sans-serif', fontWeight: 'bold', color: '#146960' }}>
  {group.beneficiaryCount ?? 0}
</TableCell>





                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{ fontFamily: 'Cairo, sans-serif' }}
                        onClick={() => handleEdit(group)}
                      >
                        تعديل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {groups.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                      لا توجد مجموعات مستفيدين
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

export default BeneficiaryGroups;
