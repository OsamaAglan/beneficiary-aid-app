import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, FormControlLabel, Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || '');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const success = await login(username, password, companyId, rememberMe);
    if (success) {
      navigate('/');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  const showOrgCodeField = !localStorage.getItem('companyId');

  return (
    <Box
      sx={{
        height: '100vh',
        background: 'linear-gradient(to right, #f2f4f7, #e0eafc)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        direction: 'rtl',
        fontFamily: 'Cairo, sans-serif',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          width: 380,
          maxWidth: '90%',
          borderRadius: 4,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          backgroundColor: '#ffffff',
        }}
      >
        <Typography variant="h5" mb={3} textAlign="center" fontWeight="bold" color="primary">
          تسجيل الدخول
        </Typography>

        <form onSubmit={handleSubmit}>
          {showOrgCodeField && (
            <TextField
              label="رمز الشركة"
              fullWidth
              margin="normal"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
            />
          )}

          <TextField
            label="اسم المستخدم"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="كلمة المرور"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            }
            label="تذكرني"
            sx={{ mt: 1 }}
          />

          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.2, fontWeight: 'bold', fontSize: 16 }}
          >
            دخول
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
