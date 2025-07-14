// components/Footer.js
import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        background: 'linear-gradient(to left, #004e92, #000428)',
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Cairo, sans-serif',
        direction: 'rtl'
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        <Link href="#" underline="hover" sx={{ color: '#fff', mx: 1 }}>
          حول النظام
        </Link>
        |
        <Link href="#" underline="hover" sx={{ color: '#fff', mx: 1 }}>
          اتصل بنا
        </Link>
        |
        <Link href="#" underline="hover" sx={{ color: '#fff', mx: 1 }}>
          سياسة الخصوصية
        </Link>
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.8 }}>
        جميع الحقوق محفوظة © {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default Footer;
