import React, { useEffect, useState } from 'react';
import {
  TextField, Button, Container, Typography, Box, CircularProgress, Grid,
  FormControlLabel, Switch, FormControl, FormLabel, RadioGroup, Radio,
  MenuItem, Select, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';

const AddBeneficiaryPage = ({ mode }) => {
  const [formData, setFormData] = useState({
    beneficiaryId: 0,
    fullName: '',
    phoneNumber: '',
    address: '',
    beneficiaryTypeId: '',
    beneficiaryGroupId: '',
    familySize: 0,
    nationalId: '',
    gender: '',
    city: '',
    maritalStatus: '',
    notes: '',
    isActive: true,
    dateOfBirth: '',
  });

  const [beneficiaryTypes, setBeneficiaryTypes] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGroupDialogOpen, setNewGroupDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ beneficiaryGroupName: '', notes: '' });

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchBeneficiaryTypes();
    fetchGroups();
    if (mode === 'edit-case' && id) fetchBeneficiary(id);
  }, [mode, id]);

  const fetchBeneficiaryTypes = async () => {
    try {
      const res = await axiosInstance.get('/BeneficiaryTypes/GetAll');
      setBeneficiaryTypes(res.data.data || []);
    } catch (err) {
      console.error('فشل تحميل أنواع المستفيدين', err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axiosInstance.get('/BeneficiaryGroups/GetAll');
      setGroups(res.data.data || []);
    } catch (err) {
      console.error('فشل تحميل المجموعات', err);
    }
  };

  const fetchBeneficiary = async (beneficiaryId) => {
    try {
      const res = await axiosInstance.get(`/Beneficiaries/GetByID/${beneficiaryId}`);
      const data = res.data.data;

      setFormData({
        beneficiaryId: data.beneficiaryId,
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        beneficiaryTypeId: data.beneficiaryTypeId?.toString() || '',
        beneficiaryGroupId: data.beneficiaryGroupId?.toString() || '',
        familySize: data.familySize || 0,
        nationalId: data.nationalId || '',
        gender: data.gender?.toString() || '',
        city: data.city || '',
        maritalStatus: data.maritalStatus || '',
        notes: data.notes || '',
        isActive: data.isActive ?? true,
        dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
      });
    } catch (error) {
      console.error('فشل تحميل بيانات المستفيد', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.beneficiaryGroupId) {
      alert("يرجى اختيار المجموعة");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        familySize: parseInt(formData.familySize || 0),
        beneficiaryTypeId: parseInt(formData.beneficiaryTypeId || 0),
        beneficiaryGroupId: parseInt(formData.beneficiaryGroupId || 0),
        gender: parseInt(formData.gender || 0),
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
      };

      if (mode === 'new-case') {
        await axiosInstance.post('/Beneficiaries/Insert', payload);
      } else {
        await axiosInstance.put('/Beneficiaries/Update', payload);
      }

      navigate('/beneficiaries');
    } catch (error) {
      console.error('تفاصيل الخطأ:', error);
      alert('فشل في حفظ البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNewGroup = async () => {
    if (!newGroup.beneficiaryGroupName.trim()) {
      alert('يرجى إدخال اسم المجموعة');
      return;
    }

    try {
      const res = await axiosInstance.post('/BeneficiaryGroups/Insert', {
        beneficiaryGroupId: 0,
        beneficiaryGroupName: newGroup.beneficiaryGroupName,
        notes: newGroup.notes,
      });

      await fetchGroups();

      const inserted = res.data?.data;
      if (inserted?.beneficiaryGroupId) {
        setFormData(prev => ({
          ...prev,
          beneficiaryGroupId: inserted.beneficiaryGroupId.toString()
        }));
      }

      setNewGroupDialogOpen(false);
      setNewGroup({ beneficiaryGroupName: '', notes: '' });

    } catch (error) {
      alert('حدث خطأ أثناء الإضافة');
      console.error(error);
    }
  };

  const maritalStatusOptions = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];

  return (
    <Container sx={{ mt: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <Typography variant="h5" gutterBottom>
        {mode === 'new-case' ? 'إضافة مستفيد جديد' : 'تعديل بيانات المستفيد'}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField fullWidth label="الاسم الكامل" name="fullName" value={formData.fullName} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="رقم الهاتف" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="عدد أفراد الأسرة" name="familySize" type="number" value={formData.familySize} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="الرقم القومي" name="nationalId" value={formData.nationalId} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="المدينة" name="city" value={formData.city} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="تاريخ الميلاد" name="dateOfBirth" type="date" InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <FormControl>
              <RadioGroup row name="gender" value={formData.gender.toString()} onChange={handleChange}>
                <FormControlLabel value="1" control={<Radio />} label="ذكر" />
                <FormControlLabel value="2" control={<Radio />} label="أنثى" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={formData.isActive} onChange={handleChange} name="isActive" color="primary" />}
              label="نشط"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="العنوان" name="address" value={formData.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="ملاحظات" name="notes" value={formData.notes} onChange={handleChange} />
          </Grid>
        </Grid>

        <FormControl fullWidth margin="normal">
          <InputLabel id="beneficiaryType-label">نوع المستفيد</InputLabel>
          <Select
            labelId="beneficiaryType-label"
            name="beneficiaryTypeId"
            value={formData.beneficiaryTypeId}
            onChange={handleChange}
            label="نوع المستفيد"
          >
            {beneficiaryTypes.map((type) => (
              <MenuItem key={type.beneficiaryTypeId} value={type.beneficiaryTypeId.toString()}>
                {type.beneficiaryTypeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel id="maritalStatus-label">الحالة الاجتماعية</InputLabel>
          <Select
            labelId="maritalStatus-label"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            label="الحالة الاجتماعية"
          >
            {maritalStatusOptions.map((status, index) => (
              <MenuItem key={index} value={status}>{status}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* اختيار المجموعة + زر الإضافة */}
        <FormControl fullWidth margin="normal">
          <Box display="flex" alignItems="flex-end" gap={2}>
            <FormControl fullWidth>
              <InputLabel id="beneficiaryGroup-label">المجموعة</InputLabel>
              <Select
                labelId="beneficiaryGroup-label"
                name="beneficiaryGroupId"
                value={formData.beneficiaryGroupId}
                onChange={handleChange}
                label="المجموعة"
              >
                {groups.map((group) => (
                  <MenuItem key={group.beneficiaryGroupId} value={group.beneficiaryGroupId.toString()}>
                    {group.beneficiaryGroupName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              onClick={() => setNewGroupDialogOpen(true)}
              sx={{ whiteSpace: 'nowrap', height: '56px' }}
            >
              جديد
            </Button>
          </Box>
        </FormControl>

        <Box mt={3} display="flex" gap={2} justifyContent="center">
          <Button variant="contained" color="primary" type="submit" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'حفظ'}
          </Button>
          <Button variant="outlined" onClick={() => navigate('/beneficiaries')}>
            إلغاء
          </Button>
        </Box>
      </form>

      {/* نافذة إضافة مجموعة جديدة */}
      <Dialog open={newGroupDialogOpen} onClose={() => setNewGroupDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>إضافة مجموعة جديدة</DialogTitle>
        <DialogContent>
          <TextField
            label="اسم المجموعة"
            fullWidth
            value={newGroup.beneficiaryGroupName}
            onChange={(e) => setNewGroup(prev => ({ ...prev, beneficiaryGroupName: e.target.value }))}
            margin="normal"
          />
          <TextField
            label="ملاحظات"
            fullWidth
            multiline
            rows={3}
            value={newGroup.notes}
            onChange={(e) => setNewGroup(prev => ({ ...prev, notes: e.target.value }))}
            margin="normal"
          />
        </DialogContent>

        <DialogActions>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button
              onClick={() => setNewGroupDialogOpen(false)}
              color="inherit"
              startIcon={<CloseIcon />}
              sx={{ gap: '10px' }}
            >
              إلغاء
            </Button>

            <Button
              onClick={handleAddNewGroup}
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              sx={{ gap: '10px' }}
            >
              حفظ
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AddBeneficiaryPage;
