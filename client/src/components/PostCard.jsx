import React, { useState, useContext } from 'react';
import { Card, Box, Avatar, Typography, IconButton, Button, TextField, Collapse, Divider, Chip } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

// Color palette for avatars
const avatarColors = ['#7c3aed', '#db2777', '#0891b2', '#059669', '#d97706', '#dc2626'];
const getColor = (name) => avatarColors[name?.charCodeAt(0) % avatarColors.length] || '#7c3aed';

const PostCard = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const hasLiked = likes.includes(user?.id);
  const avatarColor = getColor(post.author.username);

  const handleLike = async () => {
    const originalLikes = [...likes];
    if (hasLiked) {
      setLikes(likes.filter(id => id !== user.id));
    } else {
      setLikes([user.id, ...likes]);
    }
    try {
      const res = await axios.put(`/posts/${post._id}/like`);
      setLikes(res.data);
    } catch (err) {
      console.error('Like failed', err);
      setLikes(originalLikes);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(`/posts/${post._id}/comment`, { text: newComment });
      setComments(res.data);
      setNewComment('');
    } catch (err) {
      console.error('Comment failed', err);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <Card sx={{
      mb: 2, borderRadius: 3,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)',
      overflow: 'hidden',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }
    }}>
      <Box p={2}>
        {/* Author Row */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{
              bgcolor: avatarColor, width: 42, height: 42,
              fontWeight: 700, fontSize: '1rem',
              boxShadow: `0 4px 10px ${avatarColor}44`
            }}>
              {post.author.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight="700" sx={{ lineHeight: 1.2 }}>
                {post.author.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formattedDate}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined" size="small"
            startIcon={<PersonAddIcon sx={{ fontSize: '0.9rem' }} />}
            sx={{
              borderRadius: 3, textTransform: 'none', fontWeight: 600,
              borderColor: '#7c3aed', color: '#7c3aed', fontSize: '0.75rem',
              py: 0.5, px: 1.5,
              '&:hover': { bgcolor: '#7c3aed11', borderColor: '#6d28d9' }
            }}
          >
            Follow
          </Button>
        </Box>

        {/* Text Content */}
        {post.textContent && (
          <Typography variant="body1" sx={{ mb: 1.5, lineHeight: 1.6, color: '#1a1a2e' }}>
            {post.textContent}
          </Typography>
        )}

        {/* Image */}
        {post.imageUrl && (
          <Box sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', mb: 1.5, bgcolor: '#f0f0f0' }}>
            <img src={post.imageUrl} alt="Post" style={{ width: '100%', display: 'block', maxHeight: 300, objectFit: 'cover' }} />
          </Box>
        )}
      </Box>

      <Divider />

      {/* Action Bar */}
      <Box display="flex" justifyContent="space-around" px={1} py={0.5}>
        <Button
          startIcon={hasLiked ? <FavoriteIcon sx={{ color: '#ec4899' }} /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          sx={{
            color: hasLiked ? '#ec4899' : '#757575',
            textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
            borderRadius: 2, transition: 'all 0.2s',
            '&:hover': { bgcolor: '#ec489911' }
          }}
        >
          {likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
        </Button>
        <Button
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => setShowComments(!showComments)}
          sx={{ color: '#757575', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderRadius: 2, '&:hover': { bgcolor: '#7c3aed11', color: '#7c3aed' } }}
        >
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </Button>
        <Button
          startIcon={<ShareIcon />}
          onClick={() => navigator.share ? navigator.share({ title: post.textContent, url: window.location.href }) : alert('Link copied!')}
          sx={{ color: '#757575', textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', borderRadius: 2, '&:hover': { bgcolor: '#0891b211', color: '#0891b2' } }}
        >
          Share
        </Button>
      </Box>

      {/* Comment Section */}
      <Collapse in={showComments}>
        <Box p={2} pt={1} sx={{ bgcolor: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
          <Box component="form" onSubmit={handleComment} display="flex" gap={1} mb={1.5}>
            <TextField
              size="small" fullWidth placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' }
              }}
            />
            <IconButton type="submit" disabled={!newComment.trim()} sx={{ bgcolor: '#7c3aed', color: 'white', width: 38, height: 38, borderRadius: 2, '&:hover': { bgcolor: '#6d28d9' }, '&:disabled': { bgcolor: '#e0e0e0' } }}>
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
          {comments.map((c, i) => (
            <Box key={i} display="flex" gap={1} mb={1} alignItems="flex-start">
              <Avatar sx={{ width: 28, height: 28, bgcolor: getColor(c.username), fontSize: '0.7rem', fontWeight: 700 }}>
                {c.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ bgcolor: 'white', px: 1.5, py: 0.75, borderRadius: 2, flex: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                <Typography variant="caption" fontWeight="700" color="primary">{c.username} </Typography>
                <Typography variant="body2" component="span">{c.text}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Card>
  );
};

export default PostCard;
