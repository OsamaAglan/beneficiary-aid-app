import React, { useEffect, useState } from 'react';
import {
  Box, Grid, Typography, Skeleton, useMediaQuery, Button, Alert
} from '@mui/material';
import {
  People, MonetizationOn, PendingActions, AccountBalanceWallet
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axiosInstance';
import DashboardCard from '../components/DashboardCard';
import DashboardTable from '../components/DashboardTable';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import TableCell from '@mui/material/TableCell';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, benRes, typesRes] = await Promise.all([
          axiosInstance.get('/Dashboard/GeneralStats'),
          axiosInstance.get('/Dashboard/BeneficiaryByState'),
          axiosInstance.get('/Dashboard/AssistancesType')
        ]);

        setStats(statsRes.data.data || {});
        setBeneficiaries(benRes.data.data || []);
        setTypes(typesRes.data.data || []);
      } catch (err) {
        console.error('فشل تحميل بيانات لوحة التحكم');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3, direction: 'rtl', fontFamily: 'Cairo, sans-serif', backgroundColor: '#f9f9f9' }}>
      <Typography variant="h5" fontWeight="bold" color="primary" mb={3}>
        لوحة التحكم
      </Typography>

      <Grid container spacing={2} mb={3}>
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={100} />
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard label="إجمالي المستفيدين" value={stats.totalBeneficiaries} icon={<People />} bg="#D0F0C0" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard label="مساعدات هذا الشهر" value={stats.monthlyAssistances} icon={<MonetizationOn />} bg="#FCE4EC" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard label="طلبات معلقة" value={stats.pendingRequests} icon={<PendingActions />} bg="#FFF3CD" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard label="إجمالي المنصرف" value={`${stats.totalAmount} `} icon={<AccountBalanceWallet />} bg="#E0F7FA" />
            </Grid>
          </>
        )}
      </Grid>

      {/* الرسوم البيانية */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} color="primary">توزيع المساعدات حسب النوع</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={types.map(t => ({ name: t.assistancesType, value: t.assistancesCount }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {types.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 3 }}>
            <Typography variant="h6" mb={2} color="primary">تنبيهات هامة</Typography>
            <Alert severity="warning" sx={{ mb: 1 }}>يوجد {stats?.pendingRequests || 0} طلبات مساعدة غير مكتملة</Alert>
            <Alert severity="info">بعض المستفيدين لم يستكملوا بياناتهم</Alert>
          </Box>
        </Grid>
      </Grid>

      {/* الروابط السريعة */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/assistances/new')}>
            + إضافة مساعدة
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="outlined" color="secondary" onClick={() => navigate('/Beneficiaries')}>
            📋 المستفيدين
          </Button>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button fullWidth variant="outlined" onClick={() => navigate('/Reports')}>
            📊 عرض التقارير
          </Button>
        </Grid>
      </Grid>

      {/* جدول المستفيدين */}
      <Grid container>
        <Grid item xs={12}>
          <DashboardTable
            title="آخر المستفيدين المضافين"
            headers={['اسم الحالة', 'التاريخ', 'الحالة']}
            rows={beneficiaries.map(b => [
              b.caseName,
              new Date(b.date).toLocaleDateString(),
              b.status
            ])}
            rowRenderer={(row) => (
              <>
                <TableCell align="center" sx={{ fontSize: 14 }}>{row[0]}</TableCell>
                <TableCell align="center" sx={{ fontSize: 14 }}>{row[1]}</TableCell>
                <TableCell align="center" sx={{ fontSize: 14, fontWeight: 'bold', color: row[2] === 'نشطة' ? 'green' : 'red' }}>
                  {row[2]}
                </TableCell>
              </>
            )}
            getExportRow={(row) => [row[0], row[1], row[2]]}
            exportFileName="آخر المستفيدين"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
