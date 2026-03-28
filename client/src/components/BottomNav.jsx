import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getPathValue = () => {
    switch (location.pathname) {
      case '/': return 0;
      case '/social': return 1;
      default: return 0;
    }
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 500, zIndex: 10 }} elevation={4}>
      <BottomNavigation
        showLabels
        value={getPathValue()}
        onChange={(event, newValue) => {
          switch (newValue) {
            case 0: navigate('/'); break;
            case 1: navigate('/social'); break;
          }
        }}
        sx={{
          background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255, 255, 255, 0.5)',
            transition: 'all 0.2s',
          },
          '& .Mui-selected': {
            color: '#a78bfa !important',
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'Inter, sans-serif',
            fontWeight: 500,
          },
          '& .Mui-selected .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
          }
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction
          label="Social"
          icon={
            <Box
              sx={{
                bgcolor: getPathValue() === 1 ? '#7c3aed' : 'rgba(255,255,255,0.15)',
                color: '#fff',
                borderRadius: '50%',
                p: 0.75,
                mb: 0.5,
                boxShadow: getPathValue() === 1 ? '0 4px 14px rgba(124,58,237,0.6)' : 'none',
                transform: 'translateY(-12px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s',
              }}
            >
              <PublicIcon />
            </Box>
          }
          sx={{
            '& .MuiBottomNavigationAction-label': {
              transform: 'translateY(-8px)',
            }
          }}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
