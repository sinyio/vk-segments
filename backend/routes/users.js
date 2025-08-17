const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAllUsers);
router.get('/:userId/segments', usersController.getUserSegments);
router.post('/:userId/segments/:segmentId', usersController.addUserToSegment);
router.delete('/:userId/segments/:segmentId', usersController.removeUserFromSegment);

module.exports = router;
