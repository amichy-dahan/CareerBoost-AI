const express = require('express');
const router = express.Router();
const { authenticate } = require('../middellwares/authenticate');
const { list, getOne, create, update, remove } = require('../controller/ApplicationController');
const Application = require('../models/Application');

// All application routes require auth
router.use(authenticate);

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

// Debug aggregation: counts per status for current user
router.get('/debug/statusCounts/me', async (req, res) => {
	try {
		const userId = req.user.id;
		const pipeline = [
			{ $match: { userId } },
			{ $group: { _id: '$status', count: { $sum: 1 } } },
			{ $sort: { count: -1 } }
		];
		const agg = await Application.aggregate(pipeline);
		res.json({ counts: agg.reduce((acc, r) => { acc[r._id || 'Unknown'] = r.count; return acc; }, {}) });
	} catch (e) {
		console.error('Status count debug error', e);
		res.status(500).json({ error: e.message });
	}
});

module.exports = router;
