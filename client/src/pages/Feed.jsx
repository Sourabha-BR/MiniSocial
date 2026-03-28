import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Avatar, Badge, Chip, CircularProgress, Menu, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  return (
    <Box sx={{ pb: 7 }}>
      {/* Top Bar */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 2, 
        bgcolor: 'white', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Typography variant="h6" fontWeight="bold">
          Social
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Chip label={
            <Box display="flex" alignItems="center">
              <Typography variant="body2" mr={0.5}>50</Typography>
              <Box sx={{ bgcolor: '#ffb300', width: 12, height: 12, borderRadius: '50%' }} />
            </Box>
          } size="small" variant="outlined" sx={{ borderRadius: 4, height: 28 }} />
          <Chip label="₹0.00" size="small" sx={{ bgcolor: '#e8f5e9', color: '#2e7d32', borderRadius: 4, height: 28 }} />
          <Badge color="error" variant="dot">
            <NotificationsIcon color="action" />
          </Badge>
          <Avatar 
            sx={{ width: 32, height: 32, bgcolor: '#ff5722', ml: 1, cursor: 'pointer' }}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem disabled sx={{ opacity: '1 !important', color: 'black' }}>
          <Typography variant="body2" fontWeight="bold">{user?.username}</Typography>
        </MenuItem>
        <MenuItem disabled sx={{ opacity: '1 !important', color: 'gray' }}>
          <Typography variant="caption">{user?.email}</Typography>
        </MenuItem>
        <MenuItem onClick={() => { setPasswordDialogOpen(true); setAnchorEl(null); }}>Change Password</MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); setAnchorEl(null); }}>Delete Account</MenuItem>
        <MenuItem onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</MenuItem>
      </Menu>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Current Password" type="password" fullWidth variant="outlined" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <TextField margin="dense" label="New Password" type="password" fullWidth variant="outlined" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
          <Button onClick={async () => {
            try {
              await axios.put('/auth/change-password', { currentPassword, newPassword });
              alert('Password changed successfully');
              setPasswordDialogOpen(false);
              setCurrentPassword('');
              setNewPassword('');
            } catch (err) {
              alert(err.response?.data?.message || 'Error changing password');
            }
          }} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography color="error">Are you sure you want to delete your account? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={async () => {
            try {
              await axios.delete('/auth/delete-account');
              localStorage.removeItem('token');
              window.location.reload();
            } catch (err) {
              alert('Error deleting account');
            }
          }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Main Content Area */}
      <Box p={2}>
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Tabs for filters mimicking screenshot */}
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2, pb: 1, '&::-webkit-scrollbar': { display: 'none' }}}>
          <Chip label="All Post" sx={{ bgcolor: '#1a73e8', color: 'white', fontWeight: 'bold' }} />
          <Chip label="For You" variant="outlined" onClick={() => {}} />
          <Chip label="Most Liked" variant="outlined" onClick={() => {}} />
          <Chip label="Most Commented" variant="outlined" onClick={() => {}} />
        </Box>

        {/* Feed List */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : posts.length === 0 ? (
          <Typography textAlign="center" color="textSecondary" mt={4}>No posts yet. Be the first to post!</Typography>
        ) : (
          posts.map(post => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default Feed;
