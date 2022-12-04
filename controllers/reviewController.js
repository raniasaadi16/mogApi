const Review = require('../models/Review');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const filterObj = require('../utils/filterObj');
const cloudinary = require('../utils/cloudinary');

/****************GET ALL REVIEWS*****************/
exports.getAllReviews = asyncErr( async (req, res, next) => {
    const reviews = await Review.find();

    res.status(200).json({
        status: 'success',
        result: reviews.length,
        data: {
            reviews
        },
    })
});

/****************GET REVIEW*****************/
exports.getReview = asyncErr( async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    if(!review) return next(new appError('no review with this id!', 404));

    res.status(200).json({
        status: 'success',
        data: {
            review
        },
    })
});

/****************CREATE REVIEW*****************/
exports.createReview = asyncErr(async (req,res,next) =>{  
    try{
        const { name, content } = req.body;
        let picture;        
        if(req.files.picture) {
            const result = await cloudinary.uploader.upload(req.files.picture[0].path, {
                folder: 'mog',
                use_filename: true
            });
            picture = result.secure_url;
        }
        
       
        const review = await Review.create({ name, content, picture });

        res.status(201).json({
            status: 'success',
            msg: 'review created succussfully!',
            data: {
                review
            }
        })
    } catch(err){
        console.log(err)
    }
 
});

/****************UPDATE REVIEW*****************/
exports.updateReview = asyncErr( async (req, res, next) => {
    const findreview = await Review.findById(req.params.id);
    if(!findreview) return next(new appError('this review not exist!', 404));

    const fields = filterObj(req.body, 'name','content');
    
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
    
    const review = await Review.findByIdAndUpdate( req.params.id, fields,{new: true, runValidators: true});

    res.status(200).json({
        status: 'success',
        msg: 'review updated successfully',
        data: {
            review
        }
    })
});

/****************DELETE REVIEW*****************/
exports.deleteReview = asyncErr( async (req, res, next) => {
    const review = await Review.findById(req.params.id); 
    if(!review) return next(new appError('no review with this id!', 404));

    await review.remove();

    res.status(200).json({
        status: 'success',
        msg: 'review deleted succusfully',
        data: {
            review
        },
    })
});





