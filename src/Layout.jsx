// Layout.js
import React, { useState } from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [open, setOpen] = useState(true);
  const drawerWidth = open ? 220 : 60;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', direction: 'rtl' }}
    
    >
      <CssBaseline />
{/* رأس الصفحة */}
      {/* <Header />*/}
      <Header />

      <Box sx={{ display: 'flex', flexGrow: 1,background:'#F4F5E7' }}>
        {/* الشريط الجانبي */}
        <Sidebar open={open} setOpen={setOpen} />

        {/* المحتوى الرئيسي */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginRight: `${drawerWidth}px`,
            marginTop: '64px', // ارتفاع AppBar
            transition: 'margin 0.3s'
          }}
        >
          <Outlet />
        </Box>
      </Box>

      {/* تذييل الصفحة */}
      <Footer />
    </Box>
  );
};

export default Layout;
