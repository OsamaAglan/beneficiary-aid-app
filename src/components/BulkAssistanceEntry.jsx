import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, MenuItem, Button, Box
} from '@mui/material';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';

const BulkAssistances = () => {
  const navigate = useNavigate();
  const [boxPosition, setBoxPosition] = useState({ x: 20, y: 90 });

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [assistanceTypes, setAssistanceTypes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filterText, setFilterText] = useState('');
  const [assistanceData, setAssistanceData] = useState({});
  const [shared, setShared] = useState({
    assistanceTypeId: '',
    assistanceDate: new Date().toISOString().slice(0, 10),
    deliveredBy: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('boxPosition');
    if (saved) {
      setBoxPosition(JSON.parse(saved));
    }

    // تحميل أنواع المساعدات والمجموعات فقط مرة واحدة
    axiosInstance.get('/AssistanceTypes/GetAll').then(res => {
      setAssistanceTypes(res.data.data || []);
    });

    axiosInstance.get('/BeneficiaryGroups/GetAll').then(res => {
      setGroups(res.data.data || []);
    });
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const res = await axiosInstance.get('/Beneficiaries/GetAll');
      setBeneficiaries(res.data.data || []);
    } catch (err) {
      alert('فشل تحميل المستفيدين');
    }
  };

  const handleDragStop = (e, data) => {
    const position = { x: data.x, y: data.y };
    setBoxPosition(position);
    localStorage.setItem('boxPosition', JSON.stringify(position));
  };

  const handleInputChange = (id, field, value) => {
    setAssistanceData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!shared.assistanceTypeId || !shared.assistanceDate) {
      return alert('يرجى اختيار نوع المساعدة والتاريخ أولاً');
    }

    const payload = filtered
      .filter(b => parseFloat(assistanceData[b.beneficiaryId]?.amount) > 0)
      .map(b => ({
        beneficiaryId: b.beneficiaryId,
        assistanceTypeId: shared.assistanceTypeId,
        amount: parseFloat(assistanceData[b.beneficiaryId]?.amount),
        assistanceDate: shared.assistanceDate,
        deliveredBy: shared.deliveredBy || '',
        notes: assistanceData[b.beneficiaryId]?.notes || '',
        description: assistanceData[b.beneficiaryId]?.description || ''
      }));

    if (payload.length === 0) {
      return alert('لم يتم إدخال أي مبالغ للمستفيدين');
    }

    try {
      await axiosInstance.post('/Assistances/BulkInsert', payload);
      alert('تم الحفظ بنجاح');
      navigate('/assistances');
    } catch (err) {
      alert('فشل الحفظ');
    }
  };

  const filtered = beneficiaries.filter(b =>
    (b.fullName?.toLowerCase().includes(filterText.toLowerCase()) ||
      b.nationalId?.includes(filterText)) &&
    (!selectedGroup || b.beneficiaryGroupName === selectedGroup)
  );

  const groupedBeneficiaries = filtered.reduce((acc, b) => {
    const group = b.beneficiaryGroupName || 'بدون مجموعة';
    if (!acc[group]) acc[group] = [];
    acc[group].push(b);
    return acc;
  }, {});

  const filledCount = filtered.filter(b =>
    parseFloat(assistanceData[b.beneficiaryId]?.amount) > 0
  ).length;

  const totalAmount = filtered.reduce((sum, b) => {
    const val = parseFloat(assistanceData[b.beneficiaryId]?.amount);
    return sum + (isNaN(val) ? 0 : val);
  }, 0);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <Draggable position={boxPosition} onStop={handleDragStop}>
        <Box
          sx={{
            position: 'fixed',
            zIndex: 1000,
            bgcolor: '#fff',
            color: '#1976d2',
            border: '1px solid #1976d2',
            borderRadius: 2,
            px: 2,
            py: 1,
            boxShadow: 3,
            cursor: 'move',
            minWidth: '200px',
            textAlign: 'center'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            المجموع: {totalAmount.toLocaleString()}
          </Typography>
          {filledCount > 0 && (
            <Button variant="contained" color="primary" size="small" onClick={handleSubmit} sx={{ mt: 1 }}>
              حفظ ({filledCount}) مساعدات
            </Button>
          )}
        </Box>
      </Draggable>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
        <Typography variant="h5" fontFamily="Cairo, sans-serif">
          تسجيل مساعدات جماعية
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="بحث بالاسم أو الرقم القومي"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            size="small"
            inputProps={{ dir: 'rtl' }}
          />
          <Button variant="outlined" size="small" onClick={() => navigate('/assistances')}>
            رجوع
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <TextField
          label="نوع المساعدة"
          select
          value={shared.assistanceTypeId}
          onChange={e => setShared(prev => ({ ...prev, assistanceTypeId: e.target.value }))}
          sx={{ width: 200 }}
          size="small"
        >
          {assistanceTypes.map(t => (
            <MenuItem key={t.assistanceTypeId} value={t.assistanceTypeId}>
              {t.assistanceTypeName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="المجموعة"
          select
          value={selectedGroup}
          onChange={e => setSelectedGroup(e.target.value)}
          sx={{ width: 200 }}
          size="small"
        >
          <MenuItem value="">كل المجموعات</MenuItem>
          {groups.map((g) => (
            <MenuItem key={g.beneficiaryGroupId} value={g.beneficiaryGroupName}>
              {g.beneficiaryGroupName}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="تاريخ المساعدة"
          type="date"
          value={shared.assistanceDate}
          onChange={e => setShared(prev => ({ ...prev, assistanceDate: e.target.value }))}
          sx={{ width: 180 }}
          InputLabelProps={{ shrink: true }}
          size="small"
        />

        <TextField
          label="بواسطة"
          value={shared.deliveredBy}
          onChange={e => setShared(prev => ({ ...prev, deliveredBy: e.target.value }))}
          sx={{ width: 200 }}
          size="small"
        />

        <Button variant="contained" color="primary" onClick={fetchBeneficiaries}>
          تحميل المستفيدين
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#1C7F6D' }}>
            <TableRow>
              <TableCell align="center" sx={{ color: 'white' }}>الاسم</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>الرقم القومي</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>المبلغ</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>ملاحظات</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Object.entries(groupedBeneficiaries).map(([groupName, groupMembers]) => (
              <React.Fragment key={groupName}>
                <TableRow sx={{ backgroundColor: '#e0f2f1' }}>
                  <TableCell colSpan={4} sx={{ fontWeight: 'bold', color: '#1C7F6D' }}>
                    📌 {groupName} ({groupMembers.length})
                  </TableCell>
                </TableRow>

                {groupMembers.map(b => (
                  <TableRow key={b.beneficiaryId}>
                    <TableCell align="center">{b.fullName}</TableCell>
                    <TableCell align="center">{b.nationalId}</TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        value={assistanceData[b.beneficiaryId]?.amount || ''}
                        onChange={e =>
                          handleInputChange(b.beneficiaryId, 'amount', e.target.value)
                        }
                        fullWidth
                        size="small"
                        inputProps={{ dir: 'rtl', min: 0 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={assistanceData[b.beneficiaryId]?.notes || ''}
                        onChange={e =>
                          handleInputChange(b.beneficiaryId, 'notes', e.target.value)
                        }
                        fullWidth
                        size="small"
                        inputProps={{ dir: 'rtl' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default BulkAssistances;
