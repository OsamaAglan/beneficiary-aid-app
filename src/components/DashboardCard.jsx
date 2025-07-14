// components/DashboardCard.js
import { Card, CardContent, Typography } from '@mui/material';

const DashboardCard = ({ label, value, icon, bg }) => (
  <Card sx={{
    borderRadius: 3,
    boxShadow: 2,
    bgcolor: bg,
    height: '100%',
    width: '200px'
  }}>
    <CardContent sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 1
    }}>
      {icon}
      <Typography variant="h5" fontWeight="bold">{value}</Typography>
      <Typography sx={{
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        fontFamily: 'Cairo, sans-serif'
      }}>
        {label}
      </Typography>
    </CardContent>
  </Card>
);

export default DashboardCard;
