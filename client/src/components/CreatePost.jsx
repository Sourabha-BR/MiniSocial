import React, { useState, useContext, useRef } from 'react';
import { Box, Avatar, InputBase, IconButton, Button, Paper, CircularProgress, Typography } from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import CampaignIcon from '@mui/icons-material/Campaign';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import { AuthContext } from '../context/AuthContext';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useContext(AuthContext);
  const [textContent, setTextContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!textContent.trim() && !imageUrl.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post('/posts', { textContent, imageUrl });
      onPostCreated(res.data);
      setTextContent('');
      setImageUrl('');
      setShowEmojiPicker(false);
    } catch (err) {
      console.error(err);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmojiClick = (emojiData) => {
    setTextContent(prev => prev + emojiData.emoji);
  };

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">Create Post</Typography>
        <Box sx={{ bgcolor: '#1a73e8', color: 'white', px: 2, py: 0.5, borderRadius: 4, fontSize: '0.875rem' }}>All Posts</Box>
      </Box>
      <Box display="flex" alignItems="flex-start" mb={2}>
        <Avatar sx={{ bgcolor: '#ffb300', mr: 2 }}>{user?.username?.charAt(0).toUpperCase()}</Avatar>
        <Box flex={1}>
          <InputBase
            placeholder="What's on your mind?"
            fullWidth
            multiline
            minRows={2}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            sx={{ fontSize: '1rem', mb: 1 }}
          />
          {imageUrl && (
            <Box position="relative" display="inline-block" mb={2}>
              <img src={imageUrl} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, objectFit: 'cover' }} />
              <IconButton 
                size="small" 
                onClick={() => setImageUrl('')} 
                sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          {!imageUrl && (
            <InputBase
              placeholder="Image URL (optional)"
              fullWidth
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              sx={{ fontSize: '0.875rem', color: '#666', mb: 1 }}
            />
          )}
          {showEmojiPicker && (
            <Box sx={{ position: 'absolute', zIndex: 10, mt: 1 }}>
              <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
            </Box>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" pt={1} borderTop="1px solid #f0f0f0">
        <Box display="flex" gap={1}>
          <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
          <IconButton color="primary" size="small" onClick={() => fileInputRef.current.click()}><CameraAltIcon /></IconButton>
          <IconButton color="primary" size="small" onClick={() => setShowEmojiPicker(!showEmojiPicker)}><InsertEmoticonIcon /></IconButton>
          <IconButton color="primary" size="small"><FormatAlignLeftIcon /></IconButton>
          <Button startIcon={<CampaignIcon />} size="small" onClick={() => alert('Promote post option clicked!')} sx={{ color: '#1a73e8', textTransform: 'none', fontWeight: 'bold' }}>Promote</Button>
        </Box>
        <Button
          variant="contained"
          disabled={loading || (!textContent.trim() && !imageUrl.trim())}
          onClick={handleSubmit}
          sx={{
            borderRadius: 5,
            bgcolor: '#e0e0e0',
            color: '#757575',
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            '&:not(:disabled)': {
              bgcolor: '#1a73e8',
              color: 'white',
            }
          }}
          endIcon={loading ? <CircularProgress size={16} /> : <SendIcon />}
        >
          Post
        </Button>
      </Box>
    </Paper>
  );
};

export default CreatePost;
