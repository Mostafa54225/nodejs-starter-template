const bcrypt = require('bcryptjs')
const User = require('../models/User.models')
const { createCustomeError } = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes');
const UnathentincatedError = require('../errors/unauthenticated.js');
const BadRequest = require('../errors/bad-request');



const register = async (req, res, next) => {
    const count = await User.countDocuments({ username: req.body.username })
    if (count != 0) return next(createCustomeError('Username already exists', 400))

    const user = await User.create(req.body)
    const token = user.createJWT()
    res.cookie('access_token', token, {
        http_only: true,
    }).status(StatusCodes.CREATED).json({user: {name: user.username}, token})
}



const login = async (req, res, next) => {
    if(!req.body.username || !req.body.password) throw new BadRequest('Username and password are required')


    const user = await User.findOne({ username: req.body.username })
    if(!user) throw new UnathentincatedError('Invalid username or password')

    const isPasswordCorrect = await user.comparePassword(req.body.password)
    if(!isPasswordCorrect) throw new UnathentincatedError('Invalid password')

    const token = user.createJWT()

    const { password, ...otherDetails } = user._doc

    res.cookie('access_token', token, {
        http_only: true,
    }).status(StatusCodes.OK).json({ ...otherDetails, token })
}

const logout = async (req, res, next) => {
    res.clearCookie('access_token')
    res.status(StatusCodes.OK).json({ message: 'Logged out' })
}

module.exports = {
    register,
    login,
    logout
}