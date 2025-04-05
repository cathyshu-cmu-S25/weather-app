// routes/youtube.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Get YouTube videos related to location weather
router.get('/:location', async (req, res) => {
  try {
    const { location } = req.params;
    
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: 'YouTube API key not configured' });
    }
    
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${location} weather`,
        type: 'video',
        maxResults: 5,
        key: process.env.YOUTUBE_API_KEY
      }
    });
    
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt
    }));
    
    res.json(videos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    res.status(500).json({ error: 'Failed to fetch YouTube videos' });
  }
});

module.exports = router;