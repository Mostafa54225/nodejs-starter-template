const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User.models')
const { createCustomeError } = require('../errors/custom-error')

const register = async (req, res, next) => {
    const count = await User.countDocuments({ username: req.body.username })
    if (count != 0) return next(createCustomeError('Username already exists', 400))

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(req.body.password, salt)


    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash 
    })
    
    await newUser.save()
    res.status(201).json(`user ${newUser.username} has been created`)
}

const login = async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username })
    if(!user) return next(createCustomeError('User not found', 404))

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if(!isPasswordCorrect) return next(createCustomeError('Password is incorrect', 401))

    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn: '1h'})

    const { password, ...otherDetails } = user._doc

    res.cookie('access_token', token, {
        http_only: true,
    }).status(200).json({ ...otherDetails })
}

module.exports = {
    register,
    login
}