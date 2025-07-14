import React, { useEffect, useState } from 'react';
import {
  Button, Container, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Accordion, AccordionSummary,
  AccordionDetails, Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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

  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        const res = await axiosInstance.get('/Beneficiaries/GetAll');
        setBeneficiaries(res.data.data || []);
      } catch (error) {
        console.error('خطأ في تحميل المستفيدين', error);
      }
    };
    fetchBeneficiaries();
  }, []);

  const handleAdd = () => navigate('/beneficiaries/new-case');
  const handleEdit = (b) => navigate(`/beneficiaries/edit-case/${b.beneficiaryId}`);
  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await axiosInstance.delete(`/Beneficiaries/Delete/${id}`);
      setBeneficiaries(prev => prev.filter(b => b.beneficiaryId !== id));
    } catch (error) {
      alert('فشل الحذف');
    }
  };

  const handleShowDetails = (b) => {
    setDetailsBeneficiary(b);
    setOpenDetailsDialog(true);
  };

  const filtered = beneficiaries.filter(b => b.isActive === !showInactive);

  // ✅ تجميع حسب اسم المجموعة
  const groupedBeneficiaries = filtered.reduce((acc, b) => {
    const group = b.beneficiaryGroupName || 'بدون مجموعة';
    if (!acc[group]) acc[group] = [];
    acc[group].push(b);
    return acc;
  }, {});

  const renderBeneficiaryDetails = (b) => {
    if (!b) return null;
    return Object.entries(b)
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
    <Container sx={{ mt: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <Typography variant="h4" gutterBottom color="#1C7F6D" fontFamily="Cairo, sans-serif">
        قائمة المستفيدين
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ fontFamily: 'Cairo, sans-serif', ml: 1 }}>
          جديد
        </Button>
        <Button variant="outlined" onClick={() => setShowInactive(!showInactive)} sx={{ fontFamily: 'Cairo, sans-serif' }}>
          {showInactive ? 'نشط' : 'غير نشط'}
        </Button>
      </Box>

      <Box sx={{ width: '100%' }}>
        {Object.entries(groupedBeneficiaries).map(([groupName, groupMembers]) => (
          <Accordion key={groupName} sx={{ mb: 2, backgroundColor: '#E0F7FA' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography
                sx={{
                  fontFamily: 'Cairo, sans-serif',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  color: '#00796B'
                }}
              >
                📌 {groupName} ({groupMembers.length})
              </Typography>
            </AccordionSummary>

            <AccordionDetails>
              {groupMembers.map((b) => (
                <Accordion key={b.beneficiaryId} sx={{ mb: 1 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ fontFamily: 'Cairo, sans-serif', fontWeight: 'bold' }}>
                      {b.fullName}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {b.phoneNumber && <Typography>📞 الهاتف: {b.phoneNumber}</Typography>}
                    {b.address && <Typography>🏠 العنوان: {b.address}</Typography>}
                    {b.beneficiaryTypeName && <Typography>📂 النوع: {b.beneficiaryTypeName}</Typography>}
                    {b.nationalId && <Typography>🆔 الرقم القومي: {b.nationalId}</Typography>}
                    {b.city && <Typography>🏙️ المدينة: {b.city}</Typography>}
                    {b.familySize > 0 && <Typography>👥 عدد أفراد الأسرة: {b.familySize}</Typography>}
                    {b.maritalStatus && <Typography>💍 الحالة الاجتماعية: {b.maritalStatus}</Typography>}
                    {b.notes && <Typography>📝 ملاحظات: {b.notes}</Typography>}

                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<VisibilityIcon />} onClick={() => handleShowDetails(b)}>
                        تفاصيل
                      </Button>
                      <Button size="small" color="primary" startIcon={<EditIcon />} onClick={() => handleEdit(b)}>
                        تعديل
                      </Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(b.beneficiaryId)}>
                        حذف
                      </Button>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* ✅ Dialog لعرض التفاصيل */}
      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>تفاصيل المستفيد</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ fontFamily: 'Cairo, sans-serif' }}>
            {renderBeneficiaryDetails(detailsBeneficiary)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>إغلاق</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Beneficiaries;
