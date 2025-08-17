const express = require('express');
const router = express.Router();
const segmentsController = require('../controllers/segmentsController');

router.get('/', segmentsController.getAllSegments);
router.post('/', segmentsController.createSegment);
router.put('/:id', segmentsController.updateSegment);
router.delete('/:id', segmentsController.deleteSegment);
router.post('/:id/distribute', segmentsController.distributeSegment);
router.get('/stats', segmentsController.getStats);

module.exports = router;
