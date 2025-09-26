const express = require('express');
const router = express.Router();
const { authenticate } = require('../middellwares/authenticate');
const { list, getOne, create, update, remove } = require('../controller/ApplicationController');

// All application routes require auth
router.use(authenticate);

router.get('/', list);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

module.exports = router;
