const express = require('express');
const router = express.Router();
const { generateResumeFeedback } = require('../../ai-integration/gemini.service');

// Smoke-test route: client sends resumeText + jobDescription
router.post('/:profileId', async (req, res) => {
  try {
    const { jobDescription, resumeText } = req.body || {};
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'resumeText and jobDescription are required.' });
    }
    const feedback = await generateResumeFeedback(resumeText, jobDescription);
    res.status(200).json(feedback);
  } catch (error) {
    console.error('feedback route error:', error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
});

module.exports = router;
