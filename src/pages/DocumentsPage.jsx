import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';
import {
  Card, CardContent, CardHeader, Button,
  FormControl, InputLabel, Select, MenuItem,
  Snackbar, Alert, CircularProgress, Box, Typography
} from '@mui/material';
import DashboardTable from '../components/DashboardTable';
import TableCell from '@mui/material/TableCell';

const DocumentsPage = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [documents, setDocuments] = useState([]);
  const [fileInputs, setFileInputs] = useState({});
  const [loadingUpload, setLoadingUpload] = useState({});
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
   const [allUploadedSnackbarOpen, setAllUploadedSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  useEffect(() => {
    if (selectedBeneficiary) fetchDocuments();
  }, [selectedBeneficiary]);

  const fetchBeneficiaries = async () => {
    try {
      const res = await axiosInstance.get('/Beneficiaries/GetIncomplete');
      setBeneficiaries(res.data.data || []);
    } catch (err) {
      console.error('حدث خطأ أثناء تحميل المستفيدين', err);
    }
  };

  const fetchDocuments = async () => {
    setDocLoading(true);
    try {
      const res = await axiosInstance.get(`/Documents/GetByBeneficiaryID/${selectedBeneficiary}`);
      const fetchedDocs = res.data.data || [];
      setDocuments(fetchedDocs);

      // إزالة الملفات التي تم رفعها من fileInputs
      const remainingInputs = {};
      fetchedDocs.forEach(d => {
        if (!d.filePath && fileInputs[d.documentTypeId]) {
          remainingInputs[d.documentTypeId] = fileInputs[d.documentTypeId];
        }
      });
      setFileInputs(remainingInputs);
    } catch (err) {
      console.error('حدث خطأ أثناء تحميل الوثائق', err);
    }
    setDocLoading(false);
  };

  const checkIfAllUploaded = async () => {
    const updatedDocs = await axiosInstance.get(`/Documents/GetByBeneficiaryID/${selectedBeneficiary}`);
    const unUploaded = (updatedDocs.data.data || []).filter(d => !d.filePath);
   if (unUploaded.length === 0) {
  await fetchBeneficiaries();
  setSelectedBeneficiary('');
  setDocuments([]);
  setAllUploadedSnackbarOpen(true); // ✅ إظهار التنبيه الجديد
}

  };

  const handleFileChange = (documentTypeId, file) => {
    setFileInputs(prev => ({ ...prev, [documentTypeId]: file }));
  };

  const handleUpload = async (documentTypeId) => {
    const file = fileInputs[documentTypeId];
    if (!file) return alert('الرجاء اختيار ملف');
    if (file.size > 25 * 1024 * 1024) return alert('الملف أكبر من الحد المسموح (25 ميجا)');

    const formData = new FormData();
    formData.append('beneficiaryId', selectedBeneficiary);
    formData.append('documentTypeId', documentTypeId);
    formData.append('File', file);

    setLoadingUpload(prev => ({ ...prev, [documentTypeId]: { loading: true, progress: 0 } }));

    try {
      await axiosInstance.post('/Documents/Insert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setLoadingUpload(prev => ({
            ...prev,
            [documentTypeId]: { loading: true, progress: percent }
          }));
        }
      });

      await fetchDocuments();
      setSuccessSnackbarOpen(true);
      await checkIfAllUploaded();
    } catch (err) {
      console.error(err);
      alert('فشل في رفع الملف');
    } finally {
      setLoadingUpload(prev => ({ ...prev, [documentTypeId]: { loading: false, progress: 0 } }));
    }
  };

  const handleUploadAll = async () => {
    const entries = Object.entries(fileInputs);
    if (entries.length === 0) {
      alert('لم يتم اختيار أي ملفات');
      return;
    }

 
    for (const [documentTypeId, file] of entries) {
      if (!file) continue;

      if (file.size > 25 * 1024 * 1024) {
        alert(`الملف ${file.name} أكبر من الحجم المسموح (25 ميجا)`);
        continue;
      }

      const formData = new FormData();
      formData.append('beneficiaryId', selectedBeneficiary);
      formData.append('documentTypeId', documentTypeId);
      formData.append('File', file);

      setLoadingUpload(prev => ({
        ...prev,
        [documentTypeId]: { loading: true, progress: 0 }
      }));

      try {
        await axiosInstance.post('/Documents/Insert', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setLoadingUpload(prev => ({
              ...prev,
              [documentTypeId]: { loading: true, progress: percent }
            }));
          }
        });
      } catch (err) {
        console.error(`فشل رفع الوثيقة ${documentTypeId}`, err);
        alert('فشل في رفع أحد الملفات');
      } finally {
        setLoadingUpload(prev => ({
          ...prev,
          [documentTypeId]: { loading: false, progress: 0 }
        }));
      }
    }

    await fetchDocuments();
    setSuccessSnackbarOpen(true);
    await checkIfAllUploaded();
  };

  const handleSnackbarClose = () => setSuccessSnackbarOpen(false);

  const rowRenderer = (doc) => (
    <>
      <TableCell align="center">{doc.documentName}</TableCell>
      <TableCell align="center">
        {doc.filePath
          ? `تم الرفع (${new Date(doc.uploadedAt).toLocaleDateString()})`
          : 'لم يتم الرفع'}
      </TableCell>
      <TableCell align="center">
        {!doc.filePath && (
          <>
            <input
              type="file"
              onChange={(e) => handleFileChange(doc.documentTypeId, e.target.files[0])}
              style={{ marginBottom: '0.5rem' }}
            /><br />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleUpload(doc.documentTypeId)}
              disabled={
                !fileInputs[doc.documentTypeId] ||
                (loadingUpload[doc.documentTypeId]?.loading ?? false)
              }
              startIcon={
                loadingUpload[doc.documentTypeId]?.loading && (
                  <CircularProgress
                    size={20}
                    variant="determinate"
                    value={loadingUpload[doc.documentTypeId]?.progress || 0}
                    color="inherit"
                  />
                )
              }
            >
              {loadingUpload[doc.documentTypeId]?.loading
                ? `${loadingUpload[doc.documentTypeId]?.progress || 0}%`
                : 'رفع'}
            </Button>
          </>
        )}
      </TableCell>
      <TableCell align="center">
        {doc.filePath ? (
          <a href={doc.filePath} target="_blank" rel="noopener noreferrer">عرض</a>
        ) : "-"}
      </TableCell>
    </>
  );

  return (
    <div dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', padding: '1rem' }}>
      <Card sx={{ boxShadow: 3, mb: 3 }}>
        <CardHeader title="رفع الوثائق المطلوبة" sx={{ textAlign: 'right', fontWeight: 'bold' }} />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>اختر المستفيد</InputLabel>
            <Select
              value={selectedBeneficiary}
              onChange={(e) => setSelectedBeneficiary(e.target.value)}
              label="اختر المستفيد"
            >
              {beneficiaries.map(b => (
                <MenuItem key={b.beneficiaryId} value={b.beneficiaryId}>
                  {b.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {docLoading ? (
        <Typography textAlign="center" color="gray">جارٍ تحميل الوثائق...</Typography>
      ) : documents.length > 0 ? (
        <>
          <DashboardTable
            title="الوثائق المرفوعة"
            headers={['نوع الوثيقة', 'الحالة', 'الإجراء', 'معاينة']}
            rows={documents}
            rowRenderer={rowRenderer}
          />
          <Box textAlign="left" mb={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleUploadAll}
              disabled={Object.keys(fileInputs).length === 0}
            >
              رفع كل الملفات
            </Button>
          </Box>
        </>
      ) : selectedBeneficiary && (
        <Typography textAlign="center" color="gray">
          لا توجد وثائق مطلوبة لهذا المستفيد.
        </Typography>
      )}

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          تم رفع الملف بنجاح
        </Alert>
      </Snackbar>
      <Snackbar
  open={allUploadedSnackbarOpen}
  autoHideDuration={5000}
  onClose={() => setAllUploadedSnackbarOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
>
  <Alert severity="success" onClose={() => setAllUploadedSnackbarOpen(false)} sx={{ width: '100%' }}>
    تم رفع جميع الوثائق بنجاح وتم تحديث القائمة.
  </Alert>
</Snackbar>

    </div>
  );
};

export default DocumentsPage;
