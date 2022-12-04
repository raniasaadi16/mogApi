const Service = require('../models/Service');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const filterObj = require('../utils/filterObj');
const cloudinary = require('../utils/cloudinary');

/****************GET ALL SERVIECES*****************/
exports.getAllServices = asyncErr( async (req, res, next) => {
    const services = await Service.find();

    res.status(200).json({
        status: 'success',
        result: services.length,
        data: {
            services
        },
    })
});

/****************GET SERVIECE*****************/
exports.getService = asyncErr( async (req, res, next) => {
    const service = await Service.findById(req.params.id);
    if(!service) return next(new appError('no service with this id!', 404));

    res.status(200).json({
        status: 'success',
        data: {
            service
        },
    })
});

/****************CREATE SERVIECE*****************/
exports.createService = asyncErr(async (req,res,next) =>{  
    try{
        const { serviceName, description, icon, color } = req.body;
        let picture;        
        if(req.files.picture) {
            const result = await cloudinary.uploader.upload(req.files.picture[0].path, {
                folder: 'mog',
                use_filename: true
            });
            picture = result.secure_url;
        }
        
       
        const service = await Service.create({serviceName, picture, description, icon, color });

        res.status(201).json({
            status: 'success',
            msg: 'service created succussfully!',
            data: {
                service
            }
        })
    } catch(err){
        console.log(err)
    }
 
});

/****************UPDATE SERVIECE*****************/
exports.updateService = asyncErr( async (req, res, next) => {
    const findservice = await Service.findById(req.params.id);
    if(!findservice) return next(new appError('this service not exist!', 404));

    const fields = filterObj(req.body, 'serviceName','description', 'icon', 'color');
    
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
    
    const service = await Service.findByIdAndUpdate( req.params.id, fields,{new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        msg: 'service updated successfully',
        data: {
            service
        }
    })
});

/****************DELETE SERVIECE*****************/
exports.deleteService = asyncErr( async (req, res, next) => {
    const service = await Service.findById(req.params.id); 
    if(!service) return next(new appError('no service with this id!', 404));

    await service.remove();

    res.status(200).json({
        status: 'success',
        msg: 'service deleted succusfully',
        data: {
            service
        },
    })
});





