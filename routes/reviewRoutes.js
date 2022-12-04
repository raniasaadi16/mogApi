const express = require('express');
// const userController = require('../controllers/userController');
const reviewController = require('../controllers/reviewController');
const uploadPictures = require('../utils/uploadPictures');
const router = express.Router();

router.route('/').get(reviewController.getAllReviews).post(uploadPictures, reviewController.createReview);
router.route('/:id').get(reviewController.getReview).patch(uploadPictures, reviewController.updateReview).delete(reviewController.deleteReview);



module.exports = router;