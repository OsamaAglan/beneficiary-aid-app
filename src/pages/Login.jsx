import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, organization } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState(localStorage.getItem('companyId') || '');
  const [rememberMe, setRememberMe] = useState(true); // مفعّل افتراضيًا
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
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 10, direction: 'rtl' }}>
      <Typography variant="h6" gutterBottom>تسجيل الدخول</Typography>

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
        />

        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          دخول
        </Button>
      </form>
    </Paper>
  );
};

export default Login;
