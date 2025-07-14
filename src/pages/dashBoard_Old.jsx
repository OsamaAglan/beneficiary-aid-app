import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Skeleton, useMediaQuery
} from '@mui/material';
import {
  AssignmentTurnedIn, Warning, Category, People
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axiosInstance';
import TableCell from '@mui/material/TableCell';

import DashboardCard from '../components/DashboardCard';
import DashboardTable from '../components/DashboardTable';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [stats, setStats] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [cases, setCases] = useState([]);

  const bgColors = ['#D0DED4', '#F0E6D2', '#E1F5FE', '#FFE0B2'];

  useEffect(() => {
    axiosInstance.get('/Dashboard/BeneficiaryByType')
      .then(res => res.data.success && setStats(res.data.data))
      .catch(console.error);

    axiosInstance.get('/Dashboard/BeneficiaryByState')
      .then(res => setBeneficiaries(res.data.data || []))
      .catch(console.error);

    axiosInstance.get('/Dashboard/AssistancesType')
      .then(res => setCases(res.data.data || []))
      .catch(console.error);
  }, []);

  // تحويل بيانات المستفيدين لتناسب الجدول
  const beneficiaryRows = beneficiaries.map(b => [
    b.caseName,
    new Date(b.date).toLocaleDateString(),
    b.status
  ]);

  // تحويل بيانات الحالات والتبرعات
  const caseRows = cases.map(c => [
    c.caseName,
    new Date(c.date).toLocaleDateString(),
    c.sender
  ]);

  // تنسيق خلايا الجدول
  const renderCells = (row, idx) => (
    <>
      <TableCell align="center" sx={{ fontSize: 14, color: '#146960', fontFamily: 'Cairo, sans-serif' }}>{row[0]}</TableCell>
      <TableCell align="center" sx={{ fontSize: 14 }}>{row[1]}</TableCell>
      <TableCell align="center" sx={{
        fontSize: 14,
        fontWeight: 'bold',
        color:
          row[2] === 'نشطة' ? 'green' :
          row[2] === 'موقوفة' ? 'red' :
          '#555'
      }}>
        {row[2]}
      </TableCell>
    </>
  );

  return (
    <Box sx={{ p: 3, direction: 'rtl', background: '#F4F5E7' }}>
      <Grid container justifyContent="space-between" bgcolor="#fff" p={2} borderRadius={4} spacing={2}>
        {stats ? (
          [
            { label: 'الطلبات', value: stats[0].requests, icon: <AssignmentTurnedIn sx={{ fontSize: 60, color: '#146960' }} /> },
            { label: 'الحالات', value: stats[0].cases, icon: <Warning sx={{ fontSize: 60, color: '#146960' }} /> },
            { label: 'المستفيدون', value: stats[0].beneficiaries, icon: <Category sx={{ fontSize: 60, color: '#146960' }} /> },
            { label: 'التبرعات', value: stats[0].donations, icon: <People sx={{ fontSize: 60, color: '#146960' }} /> }
          ].map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <DashboardCard {...card} bg={bgColors[i % bgColors.length]} />
            </Grid>
          ))
        ) : (
          [1, 2, 3, 4].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))
        )}
      </Grid>

      {/* الجداول */}
      <Grid container spacing={3} mt={3} bgcolor="whitesmoke" p={2} borderRadius={4} justifyContent="space-between">
        <Grid item xs={12} md={6} width="48%">
          <DashboardTable
            title="المستفيدون"
            headers={['اسم الحالة', 'التاريخ', 'الحالة']}
            rows={beneficiaryRows}
            rowRenderer={renderCells}
            getExportRow={(row) => [row[0], row[1], row[2]]}
            exportFileName="المستفيدون"
          />
        </Grid>

        <Grid item xs={12} md={6} width="48%">
          <DashboardTable
            title="الحالات والتبرعات"
            headers={['اسم الحالة', 'التاريخ', 'الراسل']}
            rows={caseRows}
            rowRenderer={(row) => (
              <>
                <TableCell align="center" sx={{ fontSize: 14, color: '#146960', fontFamily: 'Cairo, sans-serif' }}>{row[0]}</TableCell>
                <TableCell align="center" sx={{ fontSize: 14 }}>{row[1]}</TableCell>
                <TableCell align="center" sx={{ fontSize: 14 }}>{row[2]}</TableCell>
              </>
            )}
              getExportRow={(row) => [row[0], row[1], row[2]]}
            exportFileName="الحالات والتبرعات"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
