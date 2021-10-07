const User = require('../models/User.Model')

const sendToken = require('../utils/jwtToken');

//Register User   => /api/v1/signup
exports.registerUser = async (req, res, next) => {

    const user = await User.create(req.body)

    if (!user) {
        res.status(201).json({
            success: false
        })
    }

    const ruser = await sendToken(user)

    let token = ruser.token;
    let option = ruser.option;

    const data = {
        token,
        user
    }

    res.status(200).cookie('token', token, option).json({
        success: true,
        token,
        user
    })

}

//Login User
exports.loginUser = async (req, res, next) => {

    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(204).json({
            success: false,
            message: 'Email Or Password Empty'
        })
    }

    //finding user in data bsae
    const user = await User.findOne({ phoneNumber }).select('+password');

    if (!user) {
        res.status(401).json({
            success: false,
            message: 'Invalid Email Or Password'
        })
    }

    //checks password is correct 
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        res.status(401).json({
            success: false,
            message: 'Wrong Email Or Password'
        })
    }

    const tokendata = await sendToken(user);

    const token = tokendata.token
    const option = tokendata.option

    res.status(200).cookie('token', token, option).json({
        success: true,
        token,
        user
    })
}

//update user profile   => api/v1/user/update
exports.updateProfile = async (req, res) => {

    //update avater TODO
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })

}

//get current user  => /api/v1/user
exports.getUserProfile = async (req, res, next) => {

    let user = await User.findOne({ _id: req.user.id })

    if (!user) {
        return res.status(401).json({
            success: false,
            user: [],
            message: 'User Not Found'
        })
    }

    res.status(200).json({
        success: true,
        user
    })
}

//logout user => /api/v1/logout
exports.logout = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'logged out'
    })
}

// ADmin
exports.checkUser = async (req, res) => {

    const user = await User.findById(req.params.id)

    if (!user) {
        res.status(201).json({
            success: false
        })
    }

    const isApproved = await Journey.find({ _id: req.params.tid, "passengers.passengerID": req.params.id })

    if (isApproved.length == 0) {
        res.status(404).json({
            success: true,
            message: "User Not In The List"
        })
    } else {
        res.status(200).json({
            success: true,
            message: "User In The List"
        })
    }
}