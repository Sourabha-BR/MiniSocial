import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Typography, Box, Link as MuiLink, InputAdornment, IconButton, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      bgcolor: 'rgba(255,255,255,0.05)',
      color: 'white',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
      '&.Mui-focused fieldset': { borderColor: '#a78bfa' },
    },
    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#a78bfa' },
    '& .MuiInputAdornment-root .MuiSvgIcon-root': { color: 'rgba(255,255,255,0.4)' },
  };

  return (
    <div className="auth-container">
      <Box sx={{
        width: '100%', p: 4,
        background: 'linear-gradient(145deg, rgba(20,20,50,0.95), rgba(40,30,80,0.95))',
        backdropFilter: 'blur(20px)',
        borderRadius: { xs: 0, sm: 4 },
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        minHeight: { xs: '100vh', sm: 'auto' },
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        {/* Logo */}
        <Box textAlign="center" mb={4}>
          <Box sx={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(124,58,237,0.5)'
          }}>
            <PeopleAltIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: 'white', letterSpacing: '-0.5px' }}>
            MiniSocial
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mt: 0.5 }}>
            Welcome back! Sign in to continue
          </Typography>
        </Box>

        <Box component="form" onSubmit={onSubmit}>
          <TextField
            fullWidth label="Email Address" variant="outlined" margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required autoComplete="email" sx={inputSx}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon /></InputAdornment> }}
          />
          <TextField
            fullWidth label="Password" type={showPassword ? 'text' : 'password'}
            variant="outlined" margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required sx={inputSx}
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockIcon /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} sx={{ color: 'rgba(255,255,255,0.4)' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Button
            type="submit" fullWidth variant="contained" size="large" disabled={loading}
            sx={{
              mt: 3, mb: 2, py: 1.5, borderRadius: 3, textTransform: 'none',
              fontWeight: 700, fontSize: '1rem',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              boxShadow: '0 8px 20px rgba(124,58,237,0.4)',
              '&:hover': { background: 'linear-gradient(135deg, #6d28d9, #4338ca)', boxShadow: '0 12px 28px rgba(124,58,237,0.5)' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          <Typography align="center" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            Don't have an account?{' '}
            <MuiLink component={Link} to="/signup" sx={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign Up
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Login;
