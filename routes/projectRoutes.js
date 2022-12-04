const express = require('express');
// const userController = require('../controllers/userController');
const projectController = require('../controllers/projectController');
const uploadPictures = require('../utils/uploadPictures');
const router = express.Router();

router.route('/').get(projectController.getAllProjects).post(uploadPictures, projectController.createProject);
router.route('/:id').get(projectController.getProject).patch(uploadPictures, projectController.updateProject).delete(projectController.deleteProject);
router.route('/categories/get').get(projectController.getCategories);



module.exports = router;