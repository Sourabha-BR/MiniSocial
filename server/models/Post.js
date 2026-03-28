const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  textContent: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{ // Array of User IDs
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    username: String,
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
