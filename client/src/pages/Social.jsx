import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Avatar, Badge, Chip, CircularProgress, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';

const Social = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error('Failed to fetch posts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const getFilteredPosts = () => {
    switch (filter) {
      case 'liked': return [...posts].sort((a, b) => b.likes.length - a.likes.length);
      case 'commented': return [...posts].sort((a, b) => b.comments.length - a.comments.length);
      case 'foryou': return posts.filter(p => p.likes.includes(user?.id) || p.comments.some(c => c.username === user?.username));
      default: return posts;
    }
  };

  const filters = [
    { key: 'all', label: 'All Post' },
    { key: 'foryou', label: 'For You' },
    { key: 'liked', label: 'Most Liked' },
    { key: 'commented', label: 'Most Commented' },
  ];

  return (
    <Box sx={{ pb: 2 }}>
      {/* Top Bar */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 2, py: 1.5,
        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Typography variant="h6" fontWeight="800" sx={{ color: 'white', letterSpacing: '-0.3px' }}>
          Social
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Badge color="error" variant="dot">
            <NotificationsIcon sx={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }} />
          </Badge>
          <Avatar
            sx={{ width: 34, height: 34, bgcolor: 'rgba(167,139,250,0.3)', border: '2px solid #a78bfa', color: '#a78bfa', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { borderRadius: 2, mt: 1, minWidth: 200, boxShadow: '0 8px 30px rgba(0,0,0,0.15)' } }}
      >
        <Box px={2} py={1.5}>
          <Typography variant="subtitle2" fontWeight="700">{user?.username}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <MenuItem divider />
        <MenuItem onClick={() => { setPasswordDialogOpen(true); setAnchorEl(null); }}>Change Password</MenuItem>
        <MenuItem sx={{ color: 'error.main' }} onClick={() => { setDeleteDialogOpen(true); setAnchorEl(null); }}>Delete Account</MenuItem>
        <MenuItem onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</MenuItem>
      </Menu>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="700">Change Password</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Current Password" type="password" fullWidth variant="outlined" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <TextField margin="dense" label="New Password" type="password" fullWidth variant="outlined" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await axios.put('/auth/change-password', { currentPassword, newPassword });
              alert('Password changed successfully');
              setPasswordDialogOpen(false);
              setCurrentPassword(''); setNewPassword('');
            } catch (err) { alert(err.response?.data?.message || 'Error changing password'); }
          }} variant="contained" sx={{ borderRadius: 2 }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle fontWeight="700">Delete Account</DialogTitle>
        <DialogContent>
          <Typography color="error">Are you sure? This action cannot be undone. All your posts will be deleted.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" sx={{ borderRadius: 2 }} onClick={async () => {
            try {
              await axios.delete('/auth/delete-account');
              localStorage.removeItem('token'); window.location.reload();
            } catch (err) { alert('Error deleting account'); }
          }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Main Content */}
      <Box p={2}>
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Filter chips */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2, pb: 0.5, '&::-webkit-scrollbar': { display: 'none' } }}>
          {filters.map(f => (
            <Chip
              key={f.key}
              label={f.label}
              onClick={() => setFilter(f.key)}
              sx={{
                fontWeight: 600, flexShrink: 0, borderRadius: 3,
                bgcolor: filter === f.key ? '#7c3aed' : 'white',
                color: filter === f.key ? 'white' : '#555',
                border: `1px solid ${filter === f.key ? '#7c3aed' : '#e0e0e0'}`,
                '&:hover': { bgcolor: filter === f.key ? '#6d28d9' : '#f5f5f5' }
              }}
            />
          ))}
        </Box>

        {/* Feed List */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}><CircularProgress sx={{ color: '#7c3aed' }} /></Box>
        ) : getFilteredPosts().length === 0 ? (
          <Typography textAlign="center" color="text.secondary" mt={4}>No posts yet. Be the first to post!</Typography>
        ) : (
          getFilteredPosts().map(post => <PostCard key={post._id} post={post} />)
        )}
      </Box>
    </Box>
  );
};

export default Social;
