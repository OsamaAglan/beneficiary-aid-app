// components/Header.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  AppBar, Toolbar, Typography, Box, InputBase,
  IconButton, Tooltip, Badge, Avatar, Menu, MenuItem, useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { username, organization, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleEditProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };
  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        
        background: '#1C7F6D',
        zIndex: 1201,
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', direction: 'rtl', flexWrap: 'wrap' }}>
        {/* جهة اليمين: اسم المؤسسة */}
        {!isMobile && (
          <Box sx={{ minWidth: 160 }}>
            <Typography
              variant="body1"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap'
              }}
            >
              {organization}
            </Typography>
          </Box>
        )}

        {/* منتصف الهيدر: عنوان التطبيق */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: isMobile ? '1rem' : '1.4rem',
            color: 'white',
            fontFamily: 'inherit',
            textAlign: 'center',
            flexGrow: 1
          }}
        >
          <span role="img" aria-label="mosque">🕌</span> نظام إدارة المساعدات
        </Typography>

        {/* جهة اليسار: البحث والإعدادات */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'nowrap' }}>
          {!isMobile && (
            <Box sx={{
              backgroundColor: '#ffffff33',
              px: 1.2,
              py: 0.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              width: 200
            }}>
              <SearchIcon sx={{ mr: 1, color: 'white' }} />
              <InputBase placeholder="بحث..." fullWidth sx={{ color: 'white' }} />
            </Box>
          )}

          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {username && (
            <>
              <Tooltip title="إعدادات المستخدم">
                <Box
                  onClick={handleMenuOpen}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    backgroundColor: 'white',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: '999px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#222', fontWeight: 'bold' }}>
                    {username}
                  </Typography>
                  <Avatar alt={username} src="/user.jpg" sx={{ width: 32, height: 32 }} />
                </Box>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{username} - {organization}</Typography>
                </MenuItem>
                <MenuItem onClick={handleEditProfile}>تعديل البيانات</MenuItem>
                <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
