import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '../axiosInstance';
import {
  Container, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, MenuItem, Select,
  FormControl, InputLabel, OutlinedInput, Checkbox, ListItemText,
  Grid, TextField, Snackbar, Alert, Card, CardContent, Box
} from '@mui/material';

const RequiredDocuments = () => {
  const [types, setTypes] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    axiosInstance.get('/BeneficiaryTypes/GetAll').then(res => setTypes(res.data.data || []));
    axiosInstance.get('/DocumentTypes/GetAll').then(res => setDocuments(res.data.data || []));
    axiosInstance.get('/RequiredDocuments/GetAll').then(res => setRequiredDocs(res.data.data || []));
  }, []);

  const getNameById = (list, id, label) => list.find(item => item[Object.keys(item)[0]] === id)?.[label] || 'غير معروف';

  const addRequiredDocument = async () => {
    if (!selectedType || selectedDocs.length === 0) return;

    const existing = requiredDocs.filter(d =>
      d.beneficiaryTypeId === selectedType &&
      selectedDocs.includes(d.documentTypeId)
    ).map(d => d.documentTypeId);

    const newDocs = selectedDocs.filter(docId => !existing.includes(docId));
    if (newDocs.length === 0) {
      alert('كل الوثائق المحددة مرتبطة بالفعل بهذا النوع.');
      return;
    }

    try {
      await Promise.all(newDocs.map(docId =>
        axiosInstance.post('/RequiredDocuments/Insert', {
          id: 0,
          beneficiaryTypeId: selectedType,
          documentTypeId: docId
        })
      ));
      setSelectedType('');
      setSelectedDocs([]);
      setShowAll(true);
      axiosInstance.get('/RequiredDocuments/GetAll').then(res => setRequiredDocs(res.data.data || []));
      setSnackbarMessage(`تمت إضافة ${newDocs.length} وثيقة جديدة بنجاح`);
      setSnackbarOpen(true);
    } catch (error) {
      alert('حدث خطأ أثناء إضافة الوثائق المطلوبة');
    }
  };

  const deleteRequiredDocument = async (id) => {
    try {
      await axiosInstance.delete(`/RequiredDocuments/Delete?id=${id}`);
      axiosInstance.get('/RequiredDocuments/GetAll').then(res => setRequiredDocs(res.data.data || []));
    } catch {
      alert('حدث خطأ أثناء حذف الوثيقة المطلوبة');
    }
  };

  const filteredDocs = useMemo(() => {
    return (showAll || selectedType ? requiredDocs : []).filter(doc => {
      const typeName = getNameById(types, doc.beneficiaryTypeId, 'beneficiaryTypeName');
      const docName = getNameById(documents, doc.documentTypeId, 'documentName');
      return (typeName + docName).toLowerCase().includes(searchTerm.toLowerCase());
    }).filter(doc => showAll || doc.beneficiaryTypeId === selectedType);
  }, [requiredDocs, showAll, selectedType, searchTerm, types, documents]);

  return (
    <Container sx={{ mt: 4, direction: 'rtl', fontFamily: 'Cairo, sans-serif' }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={3} color="#1C7F6D" fontWeight="bold">
            الوثائق المطلوبة لكل نوع مستفيد
          </Typography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>نوع المستفيد</InputLabel>
                <Select
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setShowAll(false); }}
                  label="نوع المستفيد"
                >
                  {types.map(type => (
                    <MenuItem key={type.beneficiaryTypeId} value={type.beneficiaryTypeId}>
                      {type.beneficiaryTypeName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="outlined"
                color="secondary"
                onClick={() => { setShowAll(true); setSelectedType(''); }}
                sx={{ height: '56px' }}
              >
                إظهار الكل
              </Button>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="بحث"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>الوثائق المطلوبة</InputLabel>
            <Select
              multiple
              value={selectedDocs}
              onChange={(e) => setSelectedDocs(e.target.value)}
              input={<OutlinedInput label="الوثائق المطلوبة" />}
              renderValue={(selected) => selected.map(id => documents.find(doc => doc.documentTypeId === id)?.documentName).join(', ')}
            >
              {documents.map(doc => (
                <MenuItem key={doc.documentTypeId} value={doc.documentTypeId}>
                  <Checkbox checked={selectedDocs.includes(doc.documentTypeId)} />
                  <ListItemText primary={doc.documentName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" onClick={addRequiredDocument}>
            إضافة
          </Button>

          {(selectedType || showAll) && (
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#146960' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>#</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>نوع المستفيد</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>نوع الوثيقة</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredDocs.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      sx={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#ffffff', '&:hover': { backgroundColor: '#e0f7fa' } }}
                    >
                      <TableCell align="center">{idx + 1}</TableCell>
                      <TableCell align="center">{getNameById(types, row.beneficiaryTypeId, 'beneficiaryTypeName')}</TableCell>
                      <TableCell align="center">{getNameById(documents, row.documentTypeId, 'documentName')}</TableCell>
                      <TableCell align="center">
                        <Button color="error" onClick={() => deleteRequiredDocument(row.id)}>
                          حذف
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RequiredDocuments;
