const Project = require('../models/Project');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const filterObj = require('../utils/filterObj');
const cloudinary = require('../utils/cloudinary');

/****************GET ALL PROJECTs*****************/
exports.getAllProjects = asyncErr( async (req, res, next) => {
    const projects = await Project.find();

    res.status(200).json({
        status: 'success',
        result: projects.length,
        data: {
            projects
        },
    })
});

/****************GET PROJECT*****************/
exports.getProject = asyncErr( async (req, res, next) => {
    const project = await Project.findById(req.params.id);
    if(!project) return next(new appError('no project with this id!', 404));

    res.status(200).json({
        status: 'success',
        data: {
            project
        },
    })
});

/****************CREATE PROJECT*****************/
exports.createProject = asyncErr(async (req,res,next) =>{  
    try{
        const { projectName, category } = req.body;
        let picture;        
        if(req.files.picture) {
            const result = await cloudinary.uploader.upload(req.files.picture[0].path, {
                folder: 'mog',
                use_filename: true
            });
            picture = result.secure_url;
        }
        
       
        const project = await Project.create({projectName, category, picture });

        res.status(201).json({
            status: 'success',
            msg: 'project created succussfully!',
            data: {
                project
            }
        })
    } catch(err){
        console.log(err)
    }
 
});

/****************UPDATE PROJECT*****************/
exports.updateProject = asyncErr( async (req, res, next) => {
    const findproject = await Project.findById(req.params.id);
    if(!findproject) return next(new appError('this project not exist!', 404));

    const fields = filterObj(req.body, 'projectName','category');
    
    if(req.files) {
        if(req.files.picture) {
            // DELETE THE PREV PHOTO

            // ADD THE NEW ONE
            const result = await cloudinary.uploader.upload(req.files.picture[0].path, {
                folder: 'mog',
                use_filename: true
            });
            fields.picture = result.secure_url;
        }   
    }
    
    const project = await Project.findByIdAndUpdate( req.params.id, fields,{new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        msg: 'project updated successfully',
        data: {
            project
        }
    })
});

/****************DELETE PROJECT*****************/
exports.deleteProject = asyncErr( async (req, res, next) => {
    const project = await Project.findById(req.params.id); 
    if(!project) return next(new appError('no project with this id!', 404));

    await project.remove();

    res.status(200).json({
        status: 'success',
        msg: 'project deleted succusfully',
        data: {
            project
        },
    })
});

/****************GET ALL CATEGORIES*****************/
exports.getCategories = asyncErr(async (req, res, next) => {
    const categories = await Project.aggregate([
      {
        $match: {
        }
      },
      {
        $group: {
          _id: '$category',
        }
      },
      
    ]);
  
    res.status(200).json({
      status: 'success',
      result: categories.length,
      data: {
        categories
      }
    });
  });



