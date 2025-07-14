// src/theme/theme.js
import { createTheme } from '@mui/material/styles';
import { arSD } from '@mui/material/locale';

const theme = createTheme(
  {
    direction: 'rtl',
    palette: {
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
    typography: {
      fontFamily: 'Cairo, sans-serif',
    },
  },
  arSD
);

export default theme;
