import React, { useEffect, useState } from 'react';
import {
  Container, TextField, Button, MenuItem, Typography,
  Box, Stack, Select, InputLabel, FormControl
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const AssistanceForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    assistanceId: 0,
    beneficiaryId: '',
    assistanceTypeId: '',
    amount: '',
    assistanceDate: '',
    description: '',
    deliveredBy: '',
    notes: ''
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [beneficiaryRes, typesRes] = await Promise.all([
          axiosInstance.get('/Beneficiaries/GetAll'),
          axiosInstance.get('/AssistanceTypes/GetAll')
        ]);

        setBeneficiaries(beneficiaryRes.data.data || []);
        setTypes(typesRes.data.data || []);
      } catch (err) {
        alert('فشل تحميل البيانات الأساسية');
      }
    };

    const fetchAssistanceData = async () => {
      if (!isEditMode) return;

      try {
        const res = await axiosInstance.get(`/Assistances/GetById/${id}`);
        const data = res.data.data;

        if (!data) {
          alert('لم يتم العثور على بيانات هذه المساعدة');
          navigate('/assistances');
          return;
        }

        setForm({
          assistanceId: data.assistanceId,
          beneficiaryId: data.beneficiaryId || '',
          assistanceTypeId: data.assistanceTypeId || '',
          amount: data.amount || '',
          assistanceDate: data.assistanceDate?.slice(0, 10) || '',
          description: data.description || '',
          deliveredBy: data.deliveredBy || '',
          notes: data.notes || ''
        });
      } catch (err) {
        alert('فشل تحميل بيانات المساعدة');
      }
    };

   const initialize = async () => {
  setLoading(true);
  await fetchAll();

  if (isEditMode) {
    await fetchAssistanceData();
  } else {
    // في حالة الإضافة فقط، عيّن التاريخ لتاريخ اليوم
    const today = new Date().toISOString().slice(0, 10);
    setForm(prev => ({ ...prev, assistanceDate: today }));
  }

  setLoading(false);
};


    initialize();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isEditMode ? '/Assistances/Update' : '/Assistances/Insert';
      await axiosInstance[isEditMode ? 'put' : 'post'](url, form);
      navigate('/assistances');
    } catch (err) {
      alert('حدث خطأ أثناء حفظ البيانات');
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" textAlign="center">جارٍ تحميل البيانات...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <Typography variant="h5" mb={3} fontWeight="bold" color="primary">
        {isEditMode ? 'تعديل المساعدة' : 'إضافة مساعدة جديدة'}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>المستفيد</InputLabel>
            <Select
              name="beneficiaryId"
              value={form.beneficiaryId}
              onChange={handleChange}
              label="المستفيد"
              required
            >
              {beneficiaries.map(b => (
                <MenuItem key={b.beneficiaryId} value={b.beneficiaryId}>
                  {b.fullName || b.beneficiaryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>نوع المساعدة</InputLabel>
            <Select
              name="assistanceTypeId"
              value={form.assistanceTypeId}
              onChange={handleChange}
              label="نوع المساعدة"
              required
            >
              {types.map(t => (
                <MenuItem key={t.assistanceTypeId} value={t.assistanceTypeId}>
                  {t.assistanceTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="amount"
            label="المبلغ"
            fullWidth
            value={form.amount}
            onChange={handleChange}
            required
          />

          <TextField
            name="assistanceDate"
            type="date"
            label="التاريخ"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={form.assistanceDate}
            onChange={handleChange}
            required
          />

        
          <TextField name="deliveredBy" label="بواسطة" fullWidth value={form.deliveredBy} onChange={handleChange} />
          <TextField name="notes" label="ملاحظات" fullWidth multiline rows={2} value={form.notes} onChange={handleChange} />

          <Box textAlign="left" mt={2}>
            <Button variant="contained" type="submit" color="primary" sx={{ px: 4 }}>
              {isEditMode ? 'تحديث' : 'إضافة'}
            </Button>
            <Button sx={{ ml: 2 }} variant="text" onClick={() => navigate('/assistances')}>إلغاء</Button>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default AssistanceForm;
