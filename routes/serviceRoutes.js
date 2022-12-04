const express = require('express');
// const userController = require('../controllers/userController');
const serviceController = require('../controllers/serviceController');
const uploadPictures = require('../utils/uploadPictures');
const router = express.Router();

router.route('/').get(serviceController.getAllServices).post(uploadPictures, serviceController.createService);
router.route('/:id').get(serviceController.getService).patch(uploadPictures, serviceController.updateService).delete(serviceController.deleteService);



module.exports = router;