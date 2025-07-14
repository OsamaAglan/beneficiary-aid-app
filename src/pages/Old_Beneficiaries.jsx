import React, { useEffect, useState } from 'react';
import {
  Button, Container, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Card, CardContent, Box
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';

const Beneficiaries = () => {
  const navigate = useNavigate();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [detailsBeneficiary, setDetailsBeneficiary] = useState(null);

  const fetchBeneficiaries = async () => {
    try {
      const res = await axiosInstance.get('/Beneficiaries/GetAll');
      setBeneficiaries(res.data.data || []);
    } catch (error) {
      console.error('خطأ في تحميل المستفيدين', error);
    }
  };

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const handleAdd = () => navigate('/beneficiaries/new-case');

  const handleEdit = (beneficiary) => navigate(`/beneficiaries/edit-case/${beneficiary.beneficiaryId}`);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await axiosInstance.delete(`/Beneficiaries/Delete/${id}`);
      fetchBeneficiaries();
    } catch (error) {
      alert('فشل الحذف');
    }
  };

  const handleShowDetails = (beneficiary) => {
    setDetailsBeneficiary(beneficiary);
    setOpenDetailsDialog(true);
  };

  const filtered = beneficiaries.filter(b => b.isActive === !showInactive);

  const renderBeneficiaryDetails = (beneficiary) => {
    if (!beneficiary) return null;
    return Object.entries(beneficiary)
      .filter(([_, value]) => value !== null && value !== '')
      .map(([key, value]) => (
        <Box key={key} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ textTransform: 'capitalize' }}>
            {key.replace(/([A-Z])/g, ' $1')}
          </Typography>
          <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
            {String(value)}
          </Typography>
        </Box>
      ));
  };

  return (
    <Container sx={{ mt: 4, direction: 'rtl' }}>
      <Typography variant="h4" gutterBottom fontFamily='Cairo, sans-serif' color='#1C7F6D'>
        قائمة المستفيدين
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ fontFamily: 'Cairo, sans-serif', ml: 1 }}>
          جديد
        </Button>
        <Button variant="outlined" onClick={() => setShowInactive(!showInactive)}>
          {showInactive ? 'نشط' : 'غير نشط'}
        </Button>
      </Box>

      <Box
        sx={{
          position: 'relative',
          minHeight: 300,
          width: '100%',
          maxWidth: '100%',
          overflowX: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {filtered.map((b, index) => {
          const bgColor = b.isActive ? '#E8F5E9' : '#F5F5F5';
          const angle = Math.floor(Math.random() * 13) - 6;

          return (
            <Card
              key={b.beneficiaryId}
              sx={{
                position: 'relative',
                width: { xs: '100%', sm: 250, md: 220 },
                minHeight: 80,
                maxHeight: 300,
                overflow: 'hidden',
                backgroundColor: bgColor,
                transition: 'all 0.3s ease',
                transform: `rotate(${angle}deg)`,
                zIndex: index,
                cursor: 'pointer',
                boxShadow: 2,
                '&:hover': {
                  transform: `translateY(-15px) scale(1.05) rotate(0deg)`,
                  zIndex: 1000,
                  boxShadow: 6
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" fontFamily="Cairo, sans-serif" gutterBottom>
                  {b.fullName}
                </Typography>

                <Box sx={{ transition: 'opacity 0.3s ease', opacity: 0, '&:hover': { opacity: 1 } }}>
                  {b.phoneNumber && (
                    <Typography variant="body2" fontFamily="Cairo, sans-serif" color="textSecondary">
                      الهاتف: {b.phoneNumber}
                    </Typography>
                  )}
                  {b.address && (
                    <Typography variant="body2" fontFamily="Cairo, sans-serif" color="textSecondary">
                      العنوان: {b.address}
                    </Typography>
                  )}
                  {b.beneficiaryTypeName && (
                    <Typography variant="body2" fontFamily="Cairo, sans-serif" color="textSecondary">
                      النوع: {b.beneficiaryTypeName}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Button
                      size="small"
                      startIcon={<VisibilityIcon />}
                      sx={{ fontFamily: 'Cairo, sans-serif', px: 1 }}
                      onClick={() => handleShowDetails(b)}
                    >
                      تفاصيل
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<EditIcon />}
                      sx={{ fontFamily: 'Cairo, sans-serif', px: 1 }}
                      onClick={() => handleEdit(b)}
                    >
                      تعديل
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ fontFamily: 'Cairo, sans-serif', px: 1 }}
                      onClick={() => handleDelete(b.beneficiaryId)}
                    >
                      حذف
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>تفاصيل المستفيد</DialogTitle>
        <DialogContent dividers>
          <Card variant="outlined" sx={{ p: 2 }}>
            <CardContent>
              {renderBeneficiaryDetails(detailsBeneficiary)}
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Beneficiaries;
