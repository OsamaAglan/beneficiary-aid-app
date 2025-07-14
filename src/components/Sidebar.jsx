// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Drawer, List, ListItemIcon, ListItemText, Tooltip,
  Collapse, Divider, Box, useMediaQuery, Typography, ListItemButton
} from '@mui/material';
import {
  Home, ExpandLess, ExpandMore, Category, Description,
  VolunteerActivism, AddCircleOutline, ExitToApp,
  InsertDriveFile, AttachFile
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Sidebar = ({ open, setOpen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const [expanded, setExpanded] = useState({
    beneficiaries: true,
    assistances: true,
    documents: true,
  });

  useEffect(() => {
    setOpen(!isMobile);
    if (isMobile) {
      setExpanded({
        beneficiaries: true,
        assistances: true,
        documents: true,
      });
    }
  }, [isMobile, setOpen]);

  const toggleGroup = (group) =>
    setExpanded((prev) => ({ ...prev, [group]: !prev[group] }));

  const drawerWidth = open ? 240 : 60;

  const menuGroups = [
    {
      title: 'الرئيسية',
      items: [
        { text: 'الــرئــيسـيــــة', icon: <Home />, path: '/' }
      ]
    },
    {
      title: 'المستفيدون',
      key: 'beneficiaries',
      items: [
        { text: 'الـمـستفيدون', icon: <VolunteerActivism />, path: '/Beneficiaries' },
        { text: 'المجموعات', icon: <Category />, path: '/BeneficiaryGroups' },
        { text: 'نوع الحالة', icon: <Category />, path: '/BeneficiaryTypes' },
        { text: 'حالة جديدة', icon: <AddCircleOutline />, path: '/beneficiaries/new-case' },
      ]
    },
    {
      title: 'المساعدات',
      key: 'assistances',
      items: [
        { text: 'المـسـاعـدات', icon: <Category />, path: '/Assistances' },
        { text: 'نوع المساعده', icon: <Category />, path: '/AssistanceTypes' },
        { text: 'مساعدات جماعية', icon: <AddCircleOutline />, path: '/assistances/bulk' },
      ]
    },
    {
      title: 'الوثائق',
      key: 'documents',
      items: [
        { text: 'أنواع الوثائق', icon: <Description />, path: '/DocumentTypes' },
        { text: 'وثائق مطلوبه', icon: <InsertDriveFile />, path: '/RequiredDocuments' },
        { text: 'رفع الوثائق', icon: <AttachFile />, path: '/DocumentsPage' },
      ]
    },
  ];

  const logoutItem = { text: 'تسجيل الخروج', icon: <ExitToApp />, path: '/logout' };

  return (
    <Drawer
      variant="permanent"
      anchor="right"
      PaperProps={{
        style: {
          width: drawerWidth,
          transition: 'all 0.2s',
          overflowY: 'auto',
          minHeight: '100vh',
          direction: 'rtl',
          backgroundColor: '#1C7F6D',
          color: '#fff',
          fontFamily: 'Cairo, sans-serif',
          borderLeft: 'none',
          borderRight: '1px solid #146960',
        },
      }}
    >
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <img src="/logo-white.png" alt="رحمة" style={{ width: 150, height: 150 }} />
      </Box>

      <Divider sx={{ borderColor: '#ffffff33' }} />

      <List>
        {menuGroups.map((group, idx) => (
          <Box key={idx}>
            {group.key && open && (
              <Box
                onClick={() => toggleGroup(group.key)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 1,
                  cursor: 'pointer',
                  bgcolor: '#146960',
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 17,
                    color: '#FFD700',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {group.title}
                </Typography>
                {expanded[group.key] ? (
                  <ExpandLess sx={{ color: '#FFD700' }} />
                ) : (
                  <ExpandMore sx={{ color: '#FFD700' }} />
                )}
              </Box>
            )}

            <Collapse in={!group.key || expanded[group.key]} timeout="auto" unmountOnExit>
              {group.items.map((item) => (
                <Tooltip key={item.text} title={!open ? item.text : ''} placement="left">
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={location.pathname === item.path}
                    sx={{
                      justifyContent: open ? 'flex-start' : 'center',
                      flexDirection: 'revert-layer',
                      px: 4,
                      py: 1.5,
                      color: location.pathname === item.path ? '#d0f0f0' : '#fff',
                      fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                      '&:hover': {
                        backgroundColor: '#146960',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        ml: open ? 1.5 : 0,
                        color: 'inherit',
                        backgroundColor: '#ffffff33',
                        p: 1,
                        borderRadius: 1,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={
                          <Typography
                            sx={{
                              fontSize: 16,
                              fontWeight: 'bold',
                              fontFamily: 'Cairo, sans-serif',
                              color: location.pathname === item.path ? '#d0f0f0' : '#fff',
                            }}
                          >
                            {item.text}
                          </Typography>
                        }
                        sx={{ whiteSpace: 'nowrap', mr: 1 }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              ))}
            </Collapse>

            {/* Divider between groups */}
            <Divider sx={{ borderColor: '#ffffff22', mx: 2, my: 1 }} />
          </Box>
        ))}
      </List>

      <List>
        <Tooltip title={!open ? logoutItem.text : ''} placement="left">
          <ListItemButton
            component={Link}
            to={logoutItem.path}
            selected={location.pathname === logoutItem.path}
            sx={{
              justifyContent: open ? 'flex-start' : 'center',
              flexDirection: 'revert-layer',
              px: 4,
              py: 1.5,
              color: location.pathname === logoutItem.path ? '#d0f0f0' : '#fff',
              fontWeight: location.pathname === logoutItem.path ? 'bold' : 'normal',
              '&:hover': {
                backgroundColor: '#146960',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                ml: open ? 1.5 : 0,
                color: 'inherit',
                backgroundColor: '#ffffff33',
                p: 1,
                borderRadius: 1,
              }}
            >
              {logoutItem.icon}
            </ListItemIcon>
            {open && (
              <ListItemText
                primary={
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      fontFamily: 'Cairo, sans-serif',
                      color: location.pathname === logoutItem.path ? '#d0f0f0' : '#fff',
                    }}
                  >
                    {logoutItem.text}
                  </Typography>
                }
                sx={{ whiteSpace: 'nowrap', mr: 1 }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </List>
    </Drawer>
  );
};

export default Sidebar;
