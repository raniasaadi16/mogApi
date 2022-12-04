const User = require('../models/User');
const jwt = require('jsonwebtoken');
const appError = require('../utils/appError');
const asyncErr = require('../utils/AsyncErr');
const filterObj = require('../utils/filterObj');

/****************PROTECT*****************/
exports.protect = asyncErr( async (req, res, next) => {
    let token;
    if(req.cookies.jwt){
        token = req.cookies.jwt
    } else if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1];   
    };

    // CHECK IF THE TOKEN EXIST 
    if(!token) return next(new appError('you must login!', 401));

    // CHECK IF TOKEN IS VALID
    let decoded;
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return next(new appError('token not valid', 400));
        decoded = user
    });

    // CHECK IF USER STILL EXIST
    const user = await User.findById(decoded.id);
    if(!user) return next(new appError('user no longer exist!', 404));

    // CHECK IF THE PASSWORD WAS CHANGED AFTER THE TOKEN ISSUD
    if(user.passwordChangedAfter(decoded.iat)) return next(new appError('User recently changed password! please login again ',401));

    // FINALLY ^.^
    req.user = user;

    next();
});

/****************LOGIN*****************/
exports.login = asyncErr( async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) return next(new appError('you must enter all fields', 400));

    const user = await User.findOne({email}).select('+password');
    //console.log(await user.checkPassword(user.password, password))
    if(!user || !await user.checkPassword(user.password, password)) return next(new appError('invalid email or password', 404));

    // GENERATE THE TOKEN
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    const cookieOption = {
        // expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly: true,
        //secure: true
    };
    //if(req.secure || req.headers('x-forwarded-proto')=== 'https') cookieOption.secure = true;

    res.cookie('jwt', token, cookieOption);

    res.status(200).json({
        status: 'success',
        data: {
            user, token
        },
        msg: 'Login Successful'
    })
});

//*******************CREATE USER*****************/
exports.createUser = asyncErr( async (req, res, next) => {
    const { email, password } = req.body;
    if(!email || !password) return next(new appError('missed field', 400));

    const user = await User.create({ email, password });
    res.status(201).json({
        status: 'success',
        msg: 'user created',
        data: {
            user
        }
    })
})

//*******************LOGOUT*****************/
exports.logout = asyncErr(async (req,res,next)=>{
    const cookieOption = {
        expires: new Date(Date.now() + 10*1000),
        httpOnly: true,
        secure: true
    };
    //if(req.secure || req.headers('x-forwarded-proto')=== 'https') cookieOption.secure = true;
    res.cookie('jwt', 'logout', cookieOption);
    
    res.status(200).json({
        status: 'success',
        msg: 'logout succusfully'
    })
});

//*******************UPDATE ME*****************/
exports.updateMe = asyncErr( async (req, res, next) => {
    const user = await User.findById(req.user.id)
    const fields = filterObj(req.body, 'email', 'password');
        
     // UPDATE PASSWORD
     if(fields.email) user.email = fields.email;
     if(fields.password) user.password = fields.password;   
     await user.save();

    // const user = await User.findByIdAndUpdate(req.user.id, fields, {
    //     new: true,
    //     runValidators: true
    // });

    res.status(200).json({
        status: 'success',
        message: 'informations updated succussfully',
        data: {
            user
        }
    })
});


//*******************GET USERS*****************/
exports.getUsers = asyncErr(async (req, res, next)=>{
    const users = await User.find();
    
    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    })
});

//*******************GET USER*****************/
exports.getUser = asyncErr(async (req, res, next)=>{
    const user = await User.findById(req.params.id);
    if(!user) return next(new appError('no user with this id!', 404));
    res.status(200).json({
        status: 'success',
        data: {
            user: {email: user.email, admin: user.admin}
        }
    })
});

//*******************IS LOGGEDIN*****************/
exports.isLoggedin = async (req,res,next)=>{
    if (req.params.token) {
        try {
            // 1) verify token
            let decoded;
            jwt.verify(req.params.token, process.env.JWT_SECRET,(err,user)=>{
                if(err) return next();
                decoded = user
            });
            
            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.passwordChangedAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            req.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};
//without token
exports.CheckLogin = async (req, res, next)=> {
   
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];   
        try {
            // 1) verify token
            let decoded;
            jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
                if(err) return next();
                decoded = user
            });
            
            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currentUser.passwordChangedAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            req.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
}
exports.getCurrentUser = asyncErr(async (req,res,next)=>{
    // console.log(req.user)
     if(req.user){
         res.status(200).json({
             data:{
                 user: req.user,
                 isAuth: true
             }
         })
     }else{
         res.status(200).json({
             data: {
                 user: null,
                 isAuth: false
             }
         })
     }
 })

/****************DELETE USER*****************/
exports.deleteUser = asyncErr( async (req, res, next) => {
    const user = await User.findById(req.params.id); 
    if(!user) return next(new appError('no user with this id!', 404));
    if(user.admin) return next(new appError("you can't delete the admin!", 400));

    await user.remove();

    res.status(200).json({
        status: 'success',
        msg: 'user deleted succusfully',
        data: {
            user
        },
    })
});