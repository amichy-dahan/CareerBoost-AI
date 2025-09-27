const express = require('express');
const router = express.Router();
const { authenticate } = require('../middellwares/authenticate');
const User = require('../models/User');

// All progress routes require auth


// GET current user's score + completed actions
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('careerScore completedPriorityActions');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ careerScore: user.careerScore || 0, completedPriorityActions: user.completedPriorityActions || [] });
  } catch (e) {
    console.error('[Progress][GET] error', e);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST complete an action (idempotent). Body: { actionId:string, points:number }
router.post('/complete', async (req, res) => {
  try {
    const { actionId, points } = req.body || {};
    if (!actionId || typeof points !== 'number') {
      return res.status(400).json({ error: 'Invalid payload' });
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.completedPriorityActions.includes(actionId)) {
      user.careerScore += points;
      user.completedPriorityActions.push(actionId);
      await user.save();
    }

    res.json({ careerScore: user.careerScore, completedPriorityActions: user.completedPriorityActions });
  } catch (e) {
    console.error('[Progress][POST complete] error', e);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

module.exports = router;
