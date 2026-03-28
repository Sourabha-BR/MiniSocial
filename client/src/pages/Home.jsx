import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Avatar, Chip, Paper, CircularProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublicIcon from '@mui/icons-material/Public';
import ArticleIcon from '@mui/icons-material/Article';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StatCard = ({ icon, label, value, color, loading }) => (
  <Paper sx={{
    p: 1.5, borderRadius: 3, flex: 1, textAlign: 'center',
    background: `linear-gradient(135deg, ${color}20, ${color}08)`,
    border: `1px solid ${color}30`,
    boxShadow: 'none', minWidth: 0
  }}>
    <Box sx={{ color, mb: 0.25, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
    {loading
      ? <CircularProgress size={16} sx={{ color, my: 0.5 }} />
      : <Typography variant="subtitle1" fontWeight="700" sx={{ color, lineHeight: 1.2 }}>{value}</Typography>
    }
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.65rem', display: 'block' }}>{label}</Typography>
  </Paper>
);

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ posts: 0, likesReceived: 0, likesGiven: 0, comments: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/auth/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const emoji = hour < 12 ? '☀️' : hour < 17 ? '👋' : '🌙';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f4f6fb', pb: 4 }}>
      {/* Header Banner */}
      <Box sx={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        p: 3, pt: 5, pb: 7, position: 'relative', overflow: 'hidden'
      }}>
        <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', top: 20, right: 20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: -20, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box sx={{ flex: 1, minWidth: 0, mr: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)', mb: 0.5, fontWeight: 500 }}>
              {greeting} {emoji}
            </Typography>
            <Typography variant="h5" fontWeight="800" sx={{ color: 'white', letterSpacing: '-0.5px', mb: 0.25 }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)', wordBreak: 'break-all' }}>
              {user?.email}
            </Typography>
          </Box>
          <Avatar sx={{
            width: 52, height: 52, flexShrink: 0,
            bgcolor: 'rgba(167,139,250,0.25)',
            border: '2px solid rgba(167,139,250,0.7)',
            fontSize: '1.4rem', fontWeight: 800, color: '#c4b5fd',
          }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      {/* Stats Cards - overlapping banner */}
      <Box sx={{ px: 2, mt: -4, position: 'relative', zIndex: 2, mb: 2.5 }}>
        <Box display="flex" gap={1}>
          <StatCard icon={<ArticleIcon sx={{ fontSize: '1.2rem' }} />} label="My Posts" value={stats.posts} color="#7c3aed" loading={loadingStats} />
          <StatCard icon={<FavoriteIcon sx={{ fontSize: '1.2rem' }} />} label="Likes Got" value={stats.likesReceived} color="#ec4899" loading={loadingStats} />
          <StatCard icon={<ThumbUpIcon sx={{ fontSize: '1.2rem' }} />} label="Likes Given" value={stats.likesGiven} color="#0891b2" loading={loadingStats} />
          <StatCard icon={<ChatBubbleIcon sx={{ fontSize: '1.2rem' }} />} label="Comments" value={stats.comments} color="#059669" loading={loadingStats} />
        </Box>
      </Box>

      {/* Explore Social CTA */}
      <Box sx={{ px: 2, mb: 2.5 }}>
        <Paper onClick={() => navigate('/social')} sx={{
          p: 2.5, borderRadius: 3, cursor: 'pointer',
          background: 'linear-gradient(135deg, #7c3aed0d, #4f46e50d)',
          border: '1px solid #7c3aed25',
          display: 'flex', alignItems: 'center', gap: 2,
          transition: 'all 0.2s',
          '&:hover': { transform: 'scale(1.01)', boxShadow: '0 8px 24px rgba(124,58,237,0.15)' }
        }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(124,58,237,0.4)'
          }}>
            <PublicIcon sx={{ color: 'white' }} />
          </Box>
          <Box flex={1}>
            <Typography fontWeight="700" sx={{ color: '#1e1b4b' }}>Explore Social Feed</Typography>
            <Typography variant="caption" color="text.secondary">See what others are sharing today</Typography>
          </Box>
          <Typography sx={{ color: '#7c3aed', fontWeight: 700, fontSize: '1.2rem' }}>→</Typography>
        </Paper>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ px: 2 }}>
        <Typography variant="overline" fontWeight="700" color="text.secondary" sx={{ letterSpacing: 1.5, fontSize: '0.65rem', display: 'block', mb: 1 }}>
          Quick Actions
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          {[
            { label: 'Create Post', onClick: () => navigate('/social') },
            { label: 'My Profile', onClick: () => navigate('/social') },
            { label: 'Trending', onClick: () => navigate('/social') },
            { label: 'Discover', onClick: () => navigate('/social') },
          ].map(({ label, onClick }) => (
            <Chip
              key={label}
              label={label}
              onClick={onClick}
              sx={{
                bgcolor: 'white', color: '#4f46e5', fontWeight: 600, borderRadius: 2,
                border: '1px solid #e0e0ff', boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                '&:hover': { bgcolor: '#ede9fe' }
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
